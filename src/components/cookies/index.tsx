import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

import './cookies.css';

const Cookies = () => {
	const [showCookie, setShowCookie] = useState(false);

	useEffect(() => {
		const hasCookiePermission = localStorage.getItem('cookie');
		!hasCookiePermission && setShowCookie(true);
	}, []);

	const setCookie = () => {
		localStorage.setItem('cookie', 'true');
		setShowCookie(false);
	};

	return (
		<div className="cookies-bar">
			{showCookie && (
				<div className="cookies">
					Nosso site usa cookies para oferecer a você uma boa navegação.
					<Button onClick={() => setCookie()}>Continuar e fechar</Button>
				</div>
			)}
		</div>
	);
};

export default Cookies;
