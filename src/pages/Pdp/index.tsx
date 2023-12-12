import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import { Button, Skeleton } from '@mui/material';

import { masks, showToast } from '../../utils';
import { ProductContext } from '../../contexts/ProductContext';
import { UserContext } from '../../contexts/UserContext';
import './pdp.css';

const PDP = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useContext(UserContext);
	const { productId } = useParams();

	const {
		cardsData,
		setQuantityBuyIntention,
		toggleBuyIntention,
		toggleFavorite,
	} = useContext(ProductContext);

	const buyIntention = (skuToBeChanged: string) => {
		toggleBuyIntention(skuToBeChanged);
		setQuantityBuyIntention(skuToBeChanged, 1);
	};

	const alternateFavorite = (skuToBeChanged: string) => {
		isAuthenticated
			? toggleFavorite(skuToBeChanged)
			: showToast(
					'error',
					'Para acessar os favoritos é necessário estar logado',
			  );
	};

	const mountProduct = () => {
		const selectedCardData = cardsData?.filter(card => card.sku === productId);

		return selectedCardData?.map(card => (
			<div key={card.sku}>
				<h1 className="name-product-pdp">{card?.name}</h1>
				<div className="pdp">
					<div className="image-icon-favorite">
						{card?.imageUrl ? (
							<img
								src={card?.imageUrl}
								alt="Imagem Principal"
								className="image-pdp"
							/>
						) : (
							<Skeleton
								height={300}
								style={{ transform: 'scale(1)' }}
								variant="text"
							/>
						)}
						{card?.favorite ? (
							<FavoriteIcon
								className="icon-favorite-pdp"
								onClick={() => alternateFavorite(card.sku)}
							/>
						) : (
							<FavoriteBorderIcon
								className="icon-favorite-pdp"
								onClick={() => alternateFavorite(card.sku)}
							/>
						)}
					</div>
					<div className="wrapper-infos-pdp">
						<p className="description-product-pdp">{card?.description}</p>
						<p className="value-product-pdp">
							{masks.currencyFormatter(card?.value)}
						</p>
						<Button
							variant="contained"
							className={card.hasBuyIntention ? 'cta-selected' : 'pdp-cta'}
							onClick={() => buyIntention(card.sku)}
						>
							{card.hasBuyIntention ? 'Adicionado' : 'Comprar'}
						</Button>
					</div>
					<WestIcon
						onClick={() => navigate('/')}
						className="button-return-pdp"
					/>
				</div>
			</div>
		));
	};

	return <div className="wrapper-pdp">{mountProduct()}</div>;
};

export default PDP;
