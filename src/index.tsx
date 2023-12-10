import React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import RoutesApp from './routes';
import { Header, Footer } from './components';
import { BrowserRouter } from 'react-router-dom';
import ProductsProvider from './contexts/ProductContext';
import UserProvider from './contexts/UserContext';
import './global.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
	<BrowserRouter>
		<ProductsProvider>
			<UserProvider>
				<React.StrictMode>
					<Header />
					<RoutesApp />
					<ToastContainer />
					<Footer />
				</React.StrictMode>
			</UserProvider>
		</ProductsProvider>
	</BrowserRouter>,
);
