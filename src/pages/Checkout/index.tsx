import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@mui/material';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCartOutlined';

import { ProductContext, ProductData } from '../../contexts/ProductContext';
import { UserContext } from '../../contexts/UserContext';
import { masks, showToast, validate } from '../../utils';
import ProductsTable from '../../components/table';
import './checkout.css';

const Checkout = () => {
	const navigate = useNavigate();
	const { cardsData, setQuantityBuyIntention, toggleBuyIntention } =
		useContext(ProductContext);
	const { isAuthenticated, userData, updateUserData } = useContext(UserContext);

	const [validateEmail, setValidateEmail] = useState(true);
	const [checkName, setCheckName] = useState(true);
	const [checkEmail, setCheckEmail] = useState(true);
	const [checkPhone, setCheckPhone] = useState(true);
	const [showThankYouModal, setShowThankYouModal] = useState(false);
	const [userDataCheckout, setUserDataCheckout] = useState({
		name: '',
		email: '',
		phone: 0,
	});
	const [productsDataIntent, setProductsDataIntent] = useState<ProductData[]>(
		[],
	);

	useEffect(() => {
		setUserDataCheckout(userData);
	}, [userData]);

	useEffect(() => {
		const buyIntentionSelection = cardsData?.filter(product => {
			return product.hasBuyIntention;
		});
		setProductsDataIntent(buyIntentionSelection);
	}, [cardsData]);

	const putStateUserData = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		let { name, value } = event.target;
		switch (name) {
			case 'name':
				value = masks.name(value);
				break;
			case 'email':
				const formatEmailIsValid = validate.validateEmail(value);
				setValidateEmail(formatEmailIsValid);
				break;
			case 'phone':
				value = masks.phone(value);
		}

		setUserDataCheckout({ ...userDataCheckout, [name]: value });
	};

	const changeUserData = () => {
		const validation =
			validateEmail &&
			userDataCheckout.email &&
			userDataCheckout.name &&
			userDataCheckout.phone;
		if (validation) {
			showToast('success', 'Dados alterados com sucesso!');
			updateUserData(userDataCheckout);
		} else {
			showToast('error', 'Preencha todos os dados de forma correta!');
		}
	};

	const checkData = (
		event?: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | undefined
		>,
	) => {
		const name = event && event?.target.name;

		switch (name) {
			case 'name':
				setCheckName(!!userDataCheckout[name]);
				break;
			case 'email':
				setCheckEmail(!!userDataCheckout[name]);
				break;
			case 'phone':
				setCheckPhone(!!userDataCheckout[name]);
				break;
			default:
				setCheckName(!!userDataCheckout.name);
				setCheckEmail(!!userDataCheckout.email);
				setCheckPhone(!!userDataCheckout.phone);
		}
	};

	const mountUserData = () => {
		return (
			<div className="checkout-user">
				<h2>Dados do Usuário</h2>
				<p>Confirme seus dados:</p>
				<div>
					<Input
						value={userDataCheckout.name}
						name="name"
						className="input-user"
						onChange={e => putStateUserData(e)}
						onBlur={e => checkData(e)}
					/>
					<p className="label">Nome</p>
					{!checkName && <p className="error">Preencha seu nome!</p>}
					<Input
						value={userDataCheckout.email}
						name="email"
						className="input-user"
						onChange={e => putStateUserData(e)}
						onBlur={e => checkData(e)}
					/>
					<p className="label">E-mail</p>
					{!checkEmail && <p className="error">Preencha seu e-mail!</p>}
					{checkEmail && !validateEmail && (
						<p className="error">Formato de e-mail incorreto!</p>
					)}
					<Input
						value={masks.phone(userDataCheckout.phone.toString())}
						name="phone"
						className="input-user"
						onChange={e => putStateUserData(e)}
						onBlur={e => checkData(e)}
					/>
					<p className="label">Telefone</p>
					{!checkPhone && <p className="error">Preencha seu telefone!</p>}
				</div>
				{(userData.email !== userDataCheckout.email ||
					userData.name !== userDataCheckout.name ||
					userData.phone !== userDataCheckout.phone) && (
					<Button
						variant="contained"
						className="button-advance"
						onClick={() => changeUserData()}
					>
						Salvar Alteração
					</Button>
				)}
			</div>
		);
	};

	const mountProductsTable = () => {
		return (
			<>
				<h2>Seus Produtos</h2>
				<ProductsTable dataProducts={productsDataIntent} />
			</>
		);
	};

	const mountOrderSummary = () => {
		return (
			<div>
				<h2>Resumo do Pedido</h2>
				<p className="total-value">
					Valor Total: <br />
					<span className="value">{masks.currencyFormatter(totalValue())}</span>
				</p>
				<div className="buttons-column">
					<Button
						variant="contained"
						className="button-advance"
						onClick={() => completeThePurchase()}
					>
						Efetuar a Compra
					</Button>
					<Button
						variant="contained"
						className="button-return"
						onClick={() => navigate('/')}
					>
						Continuar comprando
					</Button>
				</div>
			</div>
		);
	};

	const totalValue = () => {
		return productsDataIntent.reduce(
			(accumulator, currentValue) =>
				accumulator + currentValue.quantityBuyIntention * currentValue.value,
			0,
		);
	};

	const completeThePurchase = async () => {
		checkData();
		if (
			checkName &&
			checkEmail &&
			checkPhone &&
			validateEmail &&
			productsDataIntent.length
		) {
			const product = productsDataIntent.map(product => {
				return {
					sku: product.sku,
					name: product.name,
					quantityPurchased: product.quantityBuyIntention,
				};
			});

			// Abaixo (comentado) é apenas uma simulação pedida pelo teste caso fosse enviado para uma api.
			// daí seria primeiro instalar e aqui mesmo importar o axios: import axios from 'axios';

			// const payloadSale = {
			// 	user: {
			// 		name: userDataCheckout.name,
			// 		email: userDataCheckout.email,
			// 		phone: userDataCheckout.phone,
			// 	},
			// 	products: product,
			// };

			// await axios
			// 	.post('endpointdaapi', JSON.stringify(payloadSale), {
			// 		headers: { 'Content-Type': 'application/json' },
			// 	})
			// 	.then((response) => {
			// 		const data = response.data;

			// 		// a partir daqui temos os dados de retorno onde deve constar se deu td certo.
			// 	})
			// 	.catch((error: { response }) => {
			// 		console.log(error.response);
			// 	});

			// Alterar as infos dos produtos, favoritos e qtde em estoque (Se tivesse Api o BD é quem se encarregaria disso)
			productsDataIntent.map(product => {
				toggleBuyIntention(product.sku);
				setQuantityBuyIntention(product.sku, 0);
			});

			setShowThankYouModal(true);
		} else {
			showToast(
				'error',
				`${
					productsDataIntent.length
						? 'Preencha todos os dados de forma correta!'
						: 'Produto não selecionado'
				}`,
			);
		}
	};

	const closeModalThanks = () => {
		setShowThankYouModal(false);
		navigate('/');
	};

	return (
		<div className="wrapper-checkout">
			{isAuthenticated ? (
				productsDataIntent.length || showThankYouModal ? (
					<>
						<div className="checkout">
							<div className="user-data">{mountUserData()}</div>
							<div className="products-data">{mountProductsTable()}</div>
							<div className="order-summary">{mountOrderSummary()}</div>
						</div>
						{showThankYouModal && (
							<div className="wrapper-thanks-modal">
								<div className="thanks-modal">
									Compra efetuada com sucesso, <br />
									Parabéns!
									<Button
										variant="contained"
										className="button-return"
										onClick={() => closeModalThanks()}
									>
										Retornar à Home
									</Button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="text-empty">
						<RemoveShoppingCartIcon sx={{ fontSize: 80 }} />
						<p>Não há produtos selecionados</p>
					</div>
				)
			) : (
				<div className="text-empty">
					<p>Para acessar essa etapa é necessário que você se logue.</p>
				</div>
			)}
		</div>
	);
};

export default Checkout;
