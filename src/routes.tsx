import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Pdp, Home, Checkout } from './pages';

const RoutesApp = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/home/:productId" element={<Home />} />
			<Route path="/produto/:productId" element={<Pdp />} />
			<Route path="/checkout" element={<Checkout />} />
		</Routes>
	);
};

export default RoutesApp;
