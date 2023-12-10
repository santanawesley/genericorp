/* eslint-disable no-plusplus */
export const validate = {
	validateEmail(input: string) {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(input);
	},
	validatePassword(password: string) {
		const minLenght = 6;
		const maxLenght = 8;

		if (password.length < minLenght || password.length > maxLenght) {
			return false;
		}
		const regexCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
		const regexLetraMaiuscula = /[A-Z]+/;
		const regexNumero = /[0-9]+/;

		if (
			!regexCaracterEspecial.test(password) ||
			!regexLetraMaiuscula.test(password) ||
			!regexNumero.test(password)
		) {
			return false;
		}

		return true;
	},
};
