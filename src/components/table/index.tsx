import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import { ProductContext, ProductData } from '../../contexts/ProductContext';
import { masks } from '../../utils';
import './productsTable.css';

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (
		event: React.MouseEvent<HTMLButtonElement>,
		newPage: number,
	) => void;
}

interface ProductsTableProps {
	dataProducts: ProductData[];
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === 'rtl' ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === 'rtl' ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
};

const ProductsTable = (props: ProductsTableProps) => {
	const { setQuantityBuyIntention, toggleBuyIntention } =
		useContext(ProductContext);

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const { dataProducts } = props;

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataProducts.length) : 0;

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
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

	const removeProduct = (skuToBeChanged: string) => {
		toggleBuyIntention(skuToBeChanged);
		setQuantityBuyIntention(skuToBeChanged, 0);
	};

	return (
		<TableContainer component={Paper} className="table-checkout">
			<Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
				<TableHead>
					<TableRow>
						<TableCell>Produto</TableCell>
						<TableCell align="right"></TableCell>
						<TableCell align="right">Preço</TableCell>
						<TableCell align="right">Quantidade</TableCell>
						<TableCell align="right">Total</TableCell>
						<TableCell align="right"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{(rowsPerPage > 0
						? dataProducts.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage,
						  )
						: dataProducts
					).map((row: ProductData) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row">
								{row.name}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{<img src={row.imageUrl} className="img-checkout" />}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{masks.currencyFormatter(row.value)}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								<div className="quantity-counter-checkout">
									<RemoveCircleIcon
										onClick={() => changeQuantity(row, 'decrease')}
										className={row.quantityBuyIntention <= 1 ? 'disabled' : ''}
									/>
									{row.quantityBuyIntention}
									<AddCircleIcon
										onClick={() => changeQuantity(row, 'increase')}
										className={
											row.quantityBuyIntention >= row.quantityInStock
												? 'disabled'
												: ''
										}
									/>
								</div>
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{masks.currencyFormatter(row.value * row.quantityBuyIntention)}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								<DeleteForeverIcon onClick={() => removeProduct(row.sku)} />
							</TableCell>
						</TableRow>
					))}
					{emptyRows > 0 && (
						<TableRow style={{ height: 53 * emptyRows }}>
							<TableCell colSpan={6} />
						</TableRow>
					)}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
							colSpan={3}
							count={dataProducts.length}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: {
									'aria-label': 'Produtos por página',
								},
								native: true,
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
};

export default ProductsTable;
