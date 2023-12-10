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
	const [selectedData, setSelectedData] = useState<ProductData[] | undefined>();
	const [favoriteFilter, setFavoriteFilter] = useState(false);
	const [favoriteFilterData, setFavoriteFilterData] = useState<
		ProductData[] | undefined
	>([]);

	useEffect(() => {
		setReceivedData(cardsData);
		filterByFavorites(favoriteFilter);
	}, []);

	useEffect(() => {
		filterByFavorites(isFavoriteFilterActive);
	}, [isFavoriteFilterActive]);

	useEffect(() => {
		mountCardsHtml();
	}, [receivedData, favoriteFilter, selectedData, actualPage]);

	useEffect(() => {
		setReceivedData(cardsData);
	}, [cardsData]);

	const buyIntention = (skuToBeChanged: string) => {
		toggleBuyIntention(skuToBeChanged);
		setQuantityBuyIntention(skuToBeChanged, 1);
	};

	const limitDescription = (description: string) => {
		const limitedDescription = description.slice(0, 100);

		return <div className="product-description">{limitedDescription}...</div>;
	};

	const mountCardsHtml = () => {
		const productData = selectedData
			? selectedData
			: favoriteFilter
			  ? favoriteFilterData
			  : receivedData;

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
				} = card;

				return (
					<li key={idx} className="card" id={name}>
						<div
							onClick={() => navigate(`/produto/${card.sku}`)}
							className="link-to-details"
						>
							<div>
								<div className="product-name">{name}</div>
								{imageUrl ? (
									<img src={imageUrl} className="image-product" />
								) : (
									<Skeleton
										height={300}
										style={{ transform: 'scale(1)' }}
										variant="text"
									/>
								)}
								<div
									className="icon-favorite"
									onClick={e => alternateFavorite(card.sku, e)}
								>
									{favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
								</div>
							</div>
							<div>
								{limitDescription(description)}
								<div className="product-value">
									{masks.currencyFormatter(value)}
								</div>
							</div>
						</div>
						<Button
							variant="contained"
							className={card.hasBuyIntention ? 'cta-selected' : 'card-cta'}
							onClick={() => buyIntention(card.sku)}
						>
							{hasBuyIntention ? 'Adicionado' : 'Comprar'}
						</Button>
					</li>
				);
			});

		setCardsHtml(cardsHtmlBuilt);
	};

	const receiveDataSelected = (cardsDataSelected: ProductData | string) => {
		cardsDataSelected === 'clear'
			? setSelectedData(undefined)
			: setSelectedData([cardsDataSelected as ProductData]);
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
		const filtered = receivedData?.filter(product => product.favorite);
		setFavoriteFilterData(filtered);
	};

	const changePage = (type: string) => {
		type === 'previous'
			? setActualPage(actualPage => actualPage - 1)
			: setActualPage(actualPage => actualPage + 1);
	};

	return (
		<div className="home">
			<h1 className="title-home">Escolha seus produtos</h1>
			{favoriteFilter && <p>Esses são seus produtos Favoritos</p>}
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
				<div>Não há produtos para exibição</div>
			)}
		</div>
	);
};

export default Home;
