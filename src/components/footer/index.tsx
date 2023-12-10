import React from 'react';

import Cookies from '../cookies';
import './footer.css';

const Footer = () => {
	return (
		<div className="footer">
			<>
				<Cookies />
				<>
					© 2023
					<span> GENERICORP </span>
					Todos os direitos reservados.
				</>
			</>
		</div>
	);
};

export default Footer;
