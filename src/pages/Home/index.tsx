import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { Search } from '../../components';
import { masks, showToast } from '../../utils';
import { ProductContext, ProductData } from '../../contexts/ProductContext';
import { UserContext } from '../../contexts/UserContext';
import './home.css';

const Home = () => {
	const { isAuthenticated } = useContext(UserContext);
	const {
		cardsData,
		isFavoriteFilterActive,
		setQuantityBuyIntention,
		toggleBuyIntention,
		toggleFavorite,
	} = useContext(ProductContext);
	const navigate = useNavigate();

	const [actualPage, setActualPage] = useState(1);
	const [amountProducts, setAmountProducts] = useState(0);
	const [cardsHtml, setCardsHtml] = useState<JSX.Element[]>();
	const [receivedData, setReceivedData] = useState<ProductData[] | undefined>();
	const [selectedDataSku, setSelectedDataSku] = useState<string>('');
	const [favoriteFilter, setFavoriteFilter] = useState(false);
	const [hoveredImage, setHoveredImage] = useState<number>(-1);

	useEffect(() => {
		setReceivedData(cardsData);
		filterByFavorites(favoriteFilter);
	}, []);

	useEffect(() => {
		filterByFavorites(isFavoriteFilterActive);
	}, [isFavoriteFilterActive]);

	useEffect(() => {
		mountCardsHtml();
	}, [receivedData, favoriteFilter, selectedDataSku, actualPage]);

	useEffect(() => {
		setReceivedData(cardsData);
	}, [cardsData]);

	useEffect(() => {
		const imageContainers = document.querySelectorAll('.image-product');
		imageContainers.forEach((container, index) => {
			container.addEventListener('mouseenter', () => handleMouseEnter(index));
			container.addEventListener('mouseleave', handleMouseLeave);
		});

		return () => {
			imageContainers.forEach((container, index) => {
				container.removeEventListener('mouseenter', () =>
					handleMouseEnter(index),
				);
				container.removeEventListener('mouseleave', handleMouseLeave);
			});
		};
	}, []);

	const zoomHoverImages = (imageId?: number) => {
		const image = document.querySelectorAll(
			`.image-${
				typeof imageId === 'number' && !isNaN(imageId) ? imageId : hoveredImage
			}`,
		)[0] as HTMLElement;
		const container = document.querySelector(
			`.container-image-${
				typeof imageId === 'number' && !isNaN(imageId) ? imageId : hoveredImage
			}`,
		);

		container?.addEventListener('mousemove', e => {
			if (e instanceof MouseEvent) {
				const { left, top, width, height } = container.getBoundingClientRect();
				const x = ((e.pageX - left) / width) * 100;
				const y = ((e.pageY - top) / height) * 100;

				image ? (image.style.transformOrigin = `${x}% ${y}%`) : false;
			}
		});

		container?.addEventListener('mouseenter', () => {
			image ? (image.style.transform = 'scale(1.4)') : false; // Altera o tamanho da imagem
		});

		container?.addEventListener('mouseleave', () => {
			image ? (image.style.transform = 'scale(1)') : false; // Retorna ao tamanho original
		});
	};

	const handleMouseEnter = (imageId: number) => {
		zoomHoverImages(imageId);
		setHoveredImage(imageId);
	};

	const handleMouseLeave = () => {
		setHoveredImage(-1);
	};

	const buyIntention = (skuToBeChanged: string) => {
		toggleBuyIntention(skuToBeChanged);
		setQuantityBuyIntention(skuToBeChanged, 1);
	};

	const limitDescription = (description: string) => {
		const limitedDescription = description.slice(0, 100);

		return <div className="product-description">{limitedDescription}...</div>;
	};

	const mountCardsHtml = () => {
		let productData = receivedData;
		if (selectedDataSku)
			productData = productData?.filter(
				product => product.sku === selectedDataSku,
			);
		if (favoriteFilter)
			productData = productData?.filter(product => product.favorite);

		setAmountProducts(productData?.length || 0);
		const cardsHtmlBuilt = productData
			?.slice(actualPage * 10 - 10, actualPage * 10)
			.map((card: ProductData, idx: number) => {
				const {
					description,
					favorite,
					hasBuyIntention,
					imageUrl,
					name,
					value,
					sku,
				} = card;

				return (
					<li
						key={idx}
						className="card"
						id={name}
						onMouseEnter={() => handleMouseEnter(idx)}
						onMouseLeave={handleMouseLeave}
					>
						<div
							onClick={() => navigate(`/produto/${sku}`)}
							className="link-to-details"
						>
							<div>
								<div className="product-name">{name}</div>
								<div className={`container-image container-image-${idx}`}>
									{imageUrl ? (
										<img
											src={imageUrl}
											className={`image-product image-${idx}`}
											alt={`Image ${idx}`}
										/>
									) : (
										<Skeleton
											height={300}
											style={{ transform: 'scale(1)' }}
											variant="text"
										/>
									)}
								</div>
								<div
									className="icon-favorite"
									onClick={e => alternateFavorite(sku, e)}
								>
									{favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
								</div>
							</div>
							<div>
								{description ? (
									limitDescription(description)
								) : (
									<Skeleton
										height={135}
										style={{ transform: 'scale(1)' }}
										variant="text"
									/>
								)}
								<div className="product-value">
									{masks.currencyFormatter(value)}
								</div>
							</div>
						</div>
						<Button
							variant="contained"
							className={hasBuyIntention ? 'cta-selected' : 'card-cta'}
							onClick={() => buyIntention(sku)}
						>
							{hasBuyIntention ? 'Adicionado' : 'Comprar'}
						</Button>
					</li>
				);
			});

		setCardsHtml(cardsHtmlBuilt);
	};

	const receiveDataSelected = (cardsSkuSelected: string) => {
		setSelectedDataSku(cardsSkuSelected);
	};

	const alternateFavorite = (
		skuToBeChanged: string,
		e:
			| React.MouseEvent<HTMLDivElement, MouseEvent>
			| React.MouseEvent<SVGSVGElement, MouseEvent>,
	) => {
		e.stopPropagation();
		isAuthenticated
			? toggleFavorite(skuToBeChanged)
			: showToast(
					'error',
					'Para acessar os favoritos é necessário estar logado',
			  );
	};

	const filterByFavorites = (filterFavorite: boolean) => {
		setFavoriteFilter(filterFavorite);
	};

	const changePage = (type: string) => {
		type === 'previous'
			? setActualPage(actualPage => actualPage - 1)
			: setActualPage(actualPage => actualPage + 1);
	};

	return (
		<div className="home">
			<h1 className="title-home">Escolha seus produtos</h1>
			{favoriteFilter && <p>Filtro Favoritos ativo</p>}
			{selectedDataSku && <p>Busca por nome ativa</p>}
			<Search sendDataChoosen={receiveDataSelected} />
			{cardsHtml?.length ? (
				<>
					<div className="buttons-pagination">
						<Button
							onClick={() => changePage('previous')}
							disabled={actualPage === 1}
						>
							Anterior
						</Button>
						{actualPage}/{Math.ceil(amountProducts / 10)}
						<Button
							onClick={() => changePage('next')}
							disabled={actualPage === Math.ceil(amountProducts / 10)}
						>
							Próximo
						</Button>
					</div>
					<ul className="wrapper-cards">{cardsHtml}</ul>
				</>
			) : (
				<>
					<div>
						Não há produtos{' '}
						{(selectedDataSku || favoriteFilter) && 'com esse filtro '} para
						exibição
					</div>
				</>
			)}
		</div>
	);
};

export default Home;
