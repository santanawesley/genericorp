import React, {
	ChangeEvent,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconEye from '../../assets/icons/icon-eye.png';
import IconEyeClosed from '../../assets/icons/icon-eye-closed.png';
import { masks, showToast, validate } from '../../utils';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import { UserContext } from '../../contexts/UserContext';

const Login = () => {
	const modalRef = useRef<HTMLDivElement>(null);
	const { updateUserData, toggleAuthentication } = useContext(UserContext);

	const [isLogin, setIsLogin] = useState(false);
	const [showLogOut, setShowLogOut] = useState(false);
	const [showLogIn, setShowLogIn] = useState(false);
	const [showRegisterScreen, setShowRegisterScreen] = useState(false);

	const [typedUserName, setTypedUserName] = useState('');
	const [typedUserEmail, setTypedUserEmail] = useState('');
	const [typedUserPhone, setTypedUserPhone] = useState('');
	const [typedUserPassword, setTypedUserPassword] = useState('');
	const [typedUserConfirmationPassword, setTypedUserConfirmationPassword] =
		useState('');
	const [typedLoginEmail, setTypedLoginEmail] = useState('');
	const [typedLoginPassword, setTypedLoginPassword] = useState('');

	const [userNameStorage, setUserNameStorage] = useState('');

	const [showPasswordsLogIn, setShowPasswordsLogIn] = useState(false);
	const [showPasswords, setShowPasswords] = useState(false);
	const [showSamePasswords, setShowSamePasswords] = useState(false);

	const [validName, setValidName] = useState(true);
	const [validPhone, setValidPhone] = useState(true);
	const [validEmail, setValidEmail] = useState(true);
	const [validPassword, setValidPassword] = useState(true);
	const [validConfirmationPassword, setValidConfirmationPassword] =
		useState(true);
	const [validEmailLogin, setValidEmailLogin] = useState(true);
	const [validPasswordLogin, setValidPasswordLogin] = useState(true);

	const [validatedEmailFormat, setValidatedEmailFormat] = useState(true);
	const [validatedEmailLoginFormat, setValidatedEmailLoginFormat] =
		useState(true);
	const [validatedPasswordFormat, setValidatedPasswordFormat] = useState(true);
	const [validateSamePassword, setValidateSamePassword] = useState(true);

	const IconLogged = () => {
		const letters = userNameStorage?.slice(0, 1).toUpperCase();

		return (
			<div className={letters && 'icon-letter-name'}>
				{' '}
				{letters || <SentimentSatisfiedAltIcon fontSize="large" />}{' '}
			</div>
		);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				resetFormsFields();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const emailStorage = localStorage.getItem('EmailStorage');
		const passwordStorage = localStorage.getItem('PasswordStorage');
		const nameStorage = localStorage.getItem('NameStorage');
		const phoneStorage = localStorage.getItem('PhoneStorage');

		nameStorage && setUserNameStorage(nameStorage);

		if (emailStorage && passwordStorage) {
			setIsLogin(true);
			nameStorage &&
				phoneStorage &&
				updateUserData({
					name: nameStorage,
					email: emailStorage,
					phone: Number(phoneStorage.replace(/\D+/g, '')),
				});
		}
	}, []);

	useEffect(() => {
		toggleAuthentication(isLogin);
	}, [isLogin]);

	const LogOut = () => {
		localStorage.removeItem('NameStorage');
		localStorage.removeItem('EmailStorage');
		localStorage.removeItem('PasswordStorage');
		localStorage.removeItem('PhoneStorage');

		setTypedLoginEmail('');
		setTypedLoginPassword('');
		setValidEmailLogin(true);
		setIsLogin(false);
		setShowLogOut(false);

		return showToast('success', 'Deslogado com sucesso!');
	};

	const LogInto = () => {
		validateFieldsAreTyped('allLogin');
		if (!typedLoginPassword.length || !typedLoginEmail.length) {
			showToast('error', 'É necessário preencher todos os campos');
			return;
		}

		const userStorage = localStorage.getItem('UserStorage');
		if (!userStorage) return showToast('error', 'E-mail não cadastrado');
		const userData = userStorage && JSON.parse(userStorage);

		const { EmailStorage, PasswordStorage, NameStorage, PhoneStorage } =
			userData;

		if (
			EmailStorage === typedLoginEmail &&
			PasswordStorage === typedLoginPassword
		) {
			localStorage.setItem('NameStorage', NameStorage);
			localStorage.setItem('EmailStorage', EmailStorage);
			localStorage.setItem('PasswordStorage', PasswordStorage);
			localStorage.setItem('PhoneStorage', PhoneStorage);

			setUserNameStorage(NameStorage);
			setIsLogin(true);
			setShowLogIn(false);
			updateUserData({
				name: NameStorage,
				email: EmailStorage,
				phone: PhoneStorage,
			});
			return showToast('success', 'Login efetuado com sucesso!');
		} else {
			return showToast('error', 'E-mail e/ou Senha não conferem');
		}
	};

	const handleRegisterScreen = (): void => {
		setShowLogIn(false);
		setShowRegisterScreen(true);
	};

	const registerScreen = (): void => {
		validateFieldsAreTyped('all');

		if (
			!typedUserName ||
			!typedUserEmail ||
			!typedUserPassword ||
			!typedUserPhone ||
			!typedUserConfirmationPassword
		)
			return showToast('error', 'É necessário preencher todos os campos!');
		if (!validatedEmailFormat)
			return showToast('error', 'Formato de e-mail inválido');
		if (!validatedPasswordFormat)
			return showToast('error', 'Formato de senha inválida');
		if (!validateSamePassword)
			return showToast('error', 'As senhas não coincidem!');

		localStorage.setItem(
			'UserStorage',
			`{"NameStorage": "${typedUserName}", "EmailStorage": "${typedUserEmail}", "PasswordStorage": "${typedUserPassword}", "PhoneStorage": "${typedUserPhone}"}`,
		);
		localStorage.setItem('NameStorage', typedUserName);
		localStorage.setItem('EmailStorage', typedUserEmail);
		localStorage.setItem('PasswordStorage', typedUserPassword);
		localStorage.setItem('PhoneStorage', typedUserPhone);

		updateUserData({
			name: typedUserName,
			email: typedUserEmail,
			phone: +typedUserPhone,
		});

		setUserNameStorage(typedUserName);
		setIsLogin(true);
		setShowRegisterScreen(false);
		showToast('success', 'Registro efetuado com sucesso!');
	};

	const resetFormsFields = () => {
		setTypedLoginEmail('');
		setTypedLoginPassword('');
		setTypedUserName('');
		setTypedUserEmail('');
		setTypedUserPhone('');
		setTypedUserPassword('');
		setTypedUserConfirmationPassword('');

		setValidEmailLogin(true);
		setValidPasswordLogin(true);
		setValidName(true);
		setValidPhone(true);
		setValidEmail(true);
		setValidPassword(true);
		setValidConfirmationPassword(true);

		cancelAction();
	};

	const cancelAction = () => {
		setShowRegisterScreen(false);
		setShowLogIn(false);
	};

	const validateFieldsAreTyped = (type: string) => {
		if (type === 'name' || type === 'all') {
			setValidName(typedUserName.length > 1);
		}
		if (type === 'phone' || type === 'all') {
			setValidPhone(typedUserPhone.length > 13);
		}
		if (type === 'email' || type === 'all') {
			!validEmail
				? setValidEmail(false)
				: setValidEmail(!!typedUserEmail.length);
		}
		if (type === 'password' || type === 'all') {
			!validPassword
				? setValidPassword(false)
				: setValidPassword(!!typedUserPassword.length);
		}
		if (type === 'confirmationPassword' || type === 'all') {
			setValidConfirmationPassword(!!typedUserConfirmationPassword);
		}
		if (type === 'emailLogin' || type === 'allLogin') {
			!validEmailLogin
				? setValidEmailLogin(false)
				: setValidEmailLogin(!!typedLoginEmail);
		}
		if (type === 'passwordLogin' || type === 'allLogin') {
			setValidPasswordLogin(!!typedLoginPassword);
		}
	};

	const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		setTypedUserPassword(inputValue);

		const formatPasswordIsValid = validate.validatePassword(inputValue);
		!validatedPasswordFormat &&
			formatPasswordIsValid &&
			setValidatedPasswordFormat(true);
	};

	const checkPassword = (
		event: ChangeEvent<HTMLInputElement>,
		type: string,
	) => {
		const inputValue = event.target.value;
		const formatPasswordIsValid = validate.validatePassword(inputValue);
		formatPasswordIsValid
			? setValidatedPasswordFormat(true)
			: setValidatedPasswordFormat(false);

		formatPasswordIsValid && comparePasswords(type);
	};

	const comparePasswords = (type: string) => {
		!typedUserPassword.length || !typedUserConfirmationPassword.length
			? setValidateSamePassword(true)
			: typedUserPassword === typedUserConfirmationPassword
			  ? setValidateSamePassword(true)
			  : setValidateSamePassword(false);

		validateFieldsAreTyped(type);
	};

	const handlePhone = (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.target;
		input.value = masks.phone(input.value);

		setTypedUserPhone(input.value);
	};

	const handleName = (event: ChangeEvent<HTMLInputElement>) => {
		const input = event.target;
		input.value = masks.name(input.value);

		setTypedUserName(input.value);
	};

	const handleEmail = (event: ChangeEvent<HTMLInputElement>, type: string) => {
		const inputValue = event.target.value;
		type === 'email'
			? setTypedUserEmail(inputValue)
			: setTypedLoginEmail(inputValue);

		const formatEmailIsValid = validate.validateEmail(inputValue);

		type === 'email'
			? !validatedEmailLoginFormat &&
			  formatEmailIsValid &&
			  setValidatedEmailLoginFormat(true)
			: !validatedEmailFormat &&
			  formatEmailIsValid &&
			  setValidatedEmailFormat(true);
	};

	const checkEmail = (event: ChangeEvent<HTMLInputElement>, type: string) => {
		const inputValue = (event.target as HTMLInputElement).value;

		const formatEmailIsValid = validate.validateEmail(inputValue);

		switch (type) {
			case 'email':
				formatEmailIsValid
					? setValidatedEmailFormat(true)
					: setValidatedEmailFormat(false);
				break;
			case 'emailLogin':
				formatEmailIsValid
					? setValidatedEmailLoginFormat(true)
					: setValidatedEmailLoginFormat(false);
		}

		validateFieldsAreTyped(type);
	};

	return (
		<>
			<div className="wrapper-login">
				{isLogin ? (
					<button
						onClick={() => setShowLogOut(true)}
						className="info-user-logged icon-login"
					>
						{IconLogged()}
					</button>
				) : (
					<button onClick={() => setShowLogIn(true)} className="icon-login">
						<AccountCircleIcon fontSize="large" />
					</button>
				)}
				{showLogIn && (
					<>
						<div className="popup" ref={modalRef}>
							<p className="title">Faça seu Login</p>
							<div className="inputs-forms">
								<input
									type="email"
									placeholder="Informe seu e-mail*"
									value={typedLoginEmail}
									onChange={e => handleEmail(e, 'emailLogin')}
									onBlur={e => checkEmail(e, 'emailLogin')}
									required
								/>
								{!typedLoginEmail && !validEmailLogin && (
									<p className="error-messages login-error-messages">
										É necessário informar o seu E-mail.
									</p>
								)}
								{typedLoginEmail && !validatedEmailLoginFormat && (
									<p className="error-messages login-error-messages">
										Formato de E-mail inválido.
									</p>
								)}
							</div>
							<div className="inputs-forms">
								<input
									type={showPasswordsLogIn ? 'text' : 'password'}
									value={typedLoginPassword}
									className="input-password"
									placeholder="Informe sua senha*"
									onChange={(e: {
										target: { value: React.SetStateAction<string> };
									}) => setTypedLoginPassword(e.target.value)}
									onBlur={() => validateFieldsAreTyped('passwordLogin')}
									required
								/>
								<img
									src={showPasswordsLogIn ? IconEye : IconEyeClosed}
									className="icon-show-password icon-show-password-login"
									onClick={() =>
										setShowPasswordsLogIn(
											showPasswordsLogIn => !showPasswordsLogIn,
										)
									}
									alt="Mostrar/Ocultar senha"
								/>
								{!validPasswordLogin && (
									<p className="error-messages login-error-messages">
										É necessário informar a Senha.
									</p>
								)}
							</div>
							<div className="buttons-column">
								<button className="button-advance" onClick={() => LogInto()}>
									Entrar
								</button>
								<button
									className="button-return"
									onClick={() => resetFormsFields()}
								>
									Cancelar
								</button>
							</div>
							<button
								onClick={() => handleRegisterScreen()}
								className="link-register"
							>
								Ainda não é cadastrado?{' '}
								<span className="cta-register">Cadastre-se</span>
							</button>
						</div>
					</>
				)}
				{showLogOut && (
					<div className="popup w180">
						<p className="title">Deseja sair?</p>
						<div className="buttons-row">
							<button onClick={() => LogOut()} className="button-advance">
								Sim
							</button>
							<button
								onClick={() => setShowLogOut(false)}
								className="button-return"
							>
								Não
							</button>
						</div>
					</div>
				)}
			</div>
			{showRegisterScreen && (
				<div className="wrapper-modal-register popup">
					<div className="intermediary-div">
						<div className="modal-register">
							<p className="title">Faça seu cadastro</p>
							<div className="label-input inputs-forms">
								<label htmlFor="input_name"> Informe seu nome* </label>
								<input
									type="text"
									id="input_name"
									value={typedUserName}
									className="inputs-forms"
									onChange={e => handleName(e)}
									onBlur={() => validateFieldsAreTyped('name')}
									required
								/>
								{!validName && (
									<p className="error-messages">
										É necessário informar seu Nome.
									</p>
								)}
							</div>
							<div className="label-input inputs-forms">
								<label htmlFor="input_phone"> Informe seu telefone* </label>
								<input
									type="tel"
									id="input_phone"
									value={typedUserPhone}
									className="inputs-forms"
									onChange={e => handlePhone(e)}
									onBlur={() => validateFieldsAreTyped('phone')}
									required
								/>
								{!validPhone && typedUserPhone.length === 0 && (
									<p className="error-messages">
										É necessário informar seu Telefone.
									</p>
								)}
								{!validPhone && typedUserPhone.length > 0 && (
									<p className="error-messages">Número de Telefone inválido!</p>
								)}
							</div>
							<div className="label-input inputs-forms">
								<label htmlFor="input_email"> Informe seu e-mail* </label>
								<input
									type="email"
									id="input_email"
									value={typedUserEmail}
									className="inputs-forms"
									onChange={e => handleEmail(e, 'email')}
									onBlur={e => checkEmail(e, 'email')}
									required
								/>
								{!typedUserEmail && !validEmail && (
									<p className="error-messages">
										É necessário informar o seu E-mail.
									</p>
								)}
								{typedUserEmail && !validatedEmailFormat && (
									<p className="error-messages">Formato de E-mail inválido.</p>
								)}
							</div>
							<div className="label-input inputs-forms">
								<label htmlFor="input_password"> Cadastre uma senha* </label>
								<input
									type={showPasswords ? 'text' : 'password'}
									id="input_password"
									value={typedUserPassword}
									className="inputs-forms input-password"
									onChange={e => handlePassword(e)}
									onBlur={e => checkPassword(e, 'password')}
									required
								/>
								<img
									src={showPasswords ? IconEye : IconEyeClosed}
									className="icon-show-password"
									onClick={() =>
										setShowPasswords(showPasswords => !showPasswords)
									}
									alt="Mostrar/Ocultar senha"
								/>
								{!validPassword && (
									<p className="error-messages">
										É necessário cadastrar uma senha
									</p>
								)}
								{typedUserPassword && !validatedPasswordFormat && (
									<p className="error-messages">
										A senha deve ter de 6 a 8 dígitos, sendo pelo menos uma
										maiuscúla, um número e um caráter especial.
									</p>
								)}
							</div>
							<div className="label-input inputs-forms">
								<label htmlFor="input_repeat_password"> Repita a senha* </label>
								<input
									type={showSamePasswords ? 'text' : 'password'}
									id="input_repeat_password"
									value={typedUserConfirmationPassword}
									className="inputs-forms input-password"
									onChange={(e: {
										target: { value: React.SetStateAction<string> };
									}) => setTypedUserConfirmationPassword(e.target.value)}
									onBlur={e => checkPassword(e, 'confirmationPassword')}
									required
								/>
								<img
									src={showSamePasswords ? IconEye : IconEyeClosed}
									className="icon-show-password"
									alt="Mostrar/Ocultar senhas"
									onClick={() =>
										setShowSamePasswords(
											showSamePasswords => !showSamePasswords,
										)
									}
								/>
								{!validateSamePassword && (
									<p className="error-messages">As senhas não conferem.</p>
								)}
								{!validConfirmationPassword && (
									<p className="error-messages">
										É necessário cadastrar uma senha
									</p>
								)}
							</div>
							<div className="buttons-column mb0">
								<button
									onClick={() => registerScreen()}
									className="button-advance"
								>
									Confirmar
								</button>
								<button
									onClick={() => resetFormsFields()}
									className="button-return"
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Login;
