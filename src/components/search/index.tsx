import React, { useContext } from 'react';
import { Autocomplete, TextField } from '@mui/material';

import { ProductContext, ProductData } from '../../contexts/ProductContext';
import './search.css';

interface SearchProps {
	sendDataChoosen: (receiveDataSelected: ProductData | string) => void;
}

const Search = ({ sendDataChoosen }: SearchProps) => {
	const { cardsData } = useContext(ProductContext);

	const options = cardsData?.map(option => {
		const firstLetter = option.name[0].toUpperCase();
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
			...option,
		};
	});

	const handleChange = (
		event: React.ChangeEvent<{}>,
		value: ProductData | null,
	) => {
		value ? sendDataChoosen(value) : sendDataChoosen('clear');
	};

	return (
		<div className="search">
			<Autocomplete
				id="options-search"
				options={options}
				getOptionLabel={option => option.name}
				sx={{ width: 300 }}
				renderInput={params => <TextField {...params} label="Pesquise aqui" />}
				onChange={handleChange}
			/>
		</div>
	);
};

export default Search;
