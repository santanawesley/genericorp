import React, { useContext, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { UserContext } from '../../../../contexts/UserContext';
import './login.css';

type Favoritesprops = {
	toggleFilterFavorite: (status: boolean) => void;
};

const Favorites = (props: Favoritesprops) => {
	const { isAuthenticated } = useContext(UserContext);

	const [favoriteFilter, setFavoriteFilter] = useState(false);

	const handleFavorite = () => {
		isAuthenticated && setFavoriteFilter((prevState: boolean) => !prevState);
		props.toggleFilterFavorite(!favoriteFilter);
	};

	return (
		<div
			onClick={() => {
				handleFavorite();
			}}
			className="icon-filter-favorite"
		>
			{favoriteFilter ? (
				<FavoriteIcon fontSize="large" />
			) : (
				<FavoriteBorderIcon fontSize="large" />
			)}
		</div>
	);
};

export default Favorites;
