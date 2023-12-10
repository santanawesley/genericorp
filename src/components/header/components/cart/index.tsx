import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, OutlinedInput } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import {
	ProductContext,
	ProductData,
} from '../../../../contexts/ProductContext';
import { masks } from '../../../../utils';
import './cart.css';

const Cart = () => {
	const navigate = useNavigate();
	const { cardsData, setQuantityBuyIntention, toggleBuyIntention } =
		useContext(ProductContext);

	const [openCart, setOpenCart] = useState(false);
	const [productsDataIntent, setProductsDataIntent] = useState<ProductData[]>(
		[],
	);

	useEffect(() => {
		const buyIntentionSelection = cardsData?.filter(product => {
			return product.hasBuyIntention;
		});
		setProductsDataIntent(buyIntentionSelection);
	}, [cardsData]);

	const removeProduct = (skuToBeChanged: string) => {
		toggleBuyIntention(skuToBeChanged);
		setQuantityBuyIntention(skuToBeChanged, 0);
	};

	const changeQuantity = (
		product: ProductData,
		operation: string,
		amount: number = 1,
	) => {
		if (product.quantityBuyIntention <= 1 && operation === 'decrease') return;
		if (
			product.quantityBuyIntention >= product.quantityInStock &&
			operation === 'increase'
		)
			return;

		const quantityIntention =
			operation === 'increase'
				? product.quantityBuyIntention + amount
				: product.quantityBuyIntention - amount;
		setQuantityBuyIntention(product.sku, quantityIntention);
	};

	const mountCards = () => {
		return productsDataIntent?.map(product => {
			return (
				<div key={product.sku} className="products-cart">
					<img src={product.imageUrl} className="img-cart" />
					<div className="info-product">
						<p className="product-name-cart">{product.name}</p>
						<p className="product-value-cart">
							{masks.currencyFormatter(product.value)}
						</p>
						<div className="quantity-counter">
							<RemoveCircleIcon
								onClick={() => changeQuantity(product, 'decrease')}
								className={product.quantityBuyIntention <= 1 ? 'disabled' : ''}
							/>
							<OutlinedInput
								type="number"
								value={product.quantityBuyIntention}
								className="input-quantity"
								readOnly
								required
							/>
							<AddCircleIcon
								onClick={() => changeQuantity(product, 'increase')}
								className={
									product.quantityBuyIntention >= product.quantityInStock
										? 'disabled'
										: ''
								}
							/>
						</div>
					</div>
					<DeleteForeverIcon
						className="icon-close-cart"
						onClick={() => removeProduct(product.sku)}
					/>
				</div>
			);
		});
	};

	const totalValue = () => {
		return productsDataIntent.reduce(
			(accumulator, currentValue) =>
				accumulator + currentValue.quantityBuyIntention * currentValue.value,
			0,
		);
	};

	const directToCheckout = () => {
		setOpenCart(false);
		navigate('/checkout');
	};

	return (
		<div className="wrapper-cart">
			<ShoppingCartIcon
				fontSize="large"
				onClick={() => setOpenCart(prevState => !prevState)}
				className="icon-cart"
			/>
			{openCart && (
				<div className="cart">
					<div className="content-cart">
						<CloseIcon
							fontSize="large"
							onClick={() => setOpenCart(false)}
							className="button-close"
						/>
						<div className="wrapper-infos-products">
							{!productsDataIntent.length ? (
								<div className="text-empty">
									<RemoveShoppingCartIcon sx={{ fontSize: 80 }} />
									<p>Seu carrinho está vazio</p>
								</div>
							) : (
								<p className="title-cart">Produtos escolhidos</p>
							)}
							{productsDataIntent.length ? (
								<div className="wrapper-products-cart">{mountCards()}</div>
							) : (
								''
							)}
						</div>
						<div>
							{productsDataIntent.length ? (
								<p className="total-value">
									Valor Total:{' '}
									<span>{masks.currencyFormatter(totalValue())}</span>
								</p>
							) : (
								''
							)}
							{productsDataIntent.length ? (
								<div className="buttons-cart">
									<Button
										variant="contained"
										className="button-advance"
										onClick={() => directToCheckout()}
									>
										Finalizar Compra
									</Button>
								</div>
							) : (
								''
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;
