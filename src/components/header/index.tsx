import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import HouseIcon from '@mui/icons-material/House';

import { Cart, Favorites } from './components';
import Login from '../login';
import { showToast } from '../../utils';
import { ProductContext } from '../../contexts/ProductContext';
import { UserContext } from '../../contexts/UserContext';
import './header.css';

const Header: React.FC = () => {
	const { toggleFilterFavorite } = useContext(ProductContext);
	const { isAuthenticated } = useContext(UserContext);

	const returnError = () => {
		return showToast(
			'error',
			'Para acessar os favoritos é necessário estar logado',
		);
	};

	return (
		<div className="header">
			<div className="header-left">
				<Link to="/" className="linkHome">
					<HouseIcon fontSize="large" />
				</Link>
			</div>
			<div className="header-center">
				<h1>GENERICORP</h1>
			</div>
			<div className="header-right">
				<Favorites
					toggleFilterFavorite={
						isAuthenticated ? toggleFilterFavorite : returnError
					}
				/>
				<Login />
				<Cart />
			</div>
		</div>
	);
};

export default Header;
