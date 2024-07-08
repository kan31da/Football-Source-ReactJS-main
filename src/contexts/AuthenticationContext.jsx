import { createContext, useRef } from 'react'
import { Toast } from 'primereact/toast';

import useLocalStorage from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import * as authenticationService from '../services/authenticationService';

const AuthenticationContext = createContext();

const calculateAge = (endDate) => {
	const today = new Date();
	const birthDate = new Date(endDate);

	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
};

export const AuthenticationProvider = ({
	children,
}) => {
	const toast = useRef(null);

	const [authentication, setAuthentication] = useLocalStorage('auth', {});

	const navigate = useNavigate();

	const showError = (message) => {
		toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 5000 });
	}

	const showSuccess = (message) => {
		toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 5000 });
	}

	const showInfo = (message) => {
		toast.current.show({ severity: 'info', summary: 'Info', detail: message, life: 5000 });
	}

	const showWarning = (message) => {
		toast.current.show({ severity: 'warn', summary: 'Warning', detail: message, life: 5000 });
	}

	const validateRegister = (values) => {
		if (values.username.trim() == '') {
			showError(`'Username' is required`)

			return false
		}

		if (!values.dateOfBirth) {
			showError(`'Date Of Birth' is required`)

			return false
		}

		if (values.email.trim() == '') {
			showError(`'Email' is required`)

			return false
		}

		if (values.password.trim() == '') {
			showError(`'Password' is required`)

			return false
		}

		const isDateOfBirthInTheFuture= new Date(values.dateOfBirth).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);

		if (isDateOfBirthInTheFuture) {
			showError('Date of Birth cannot be in the future')

			return false
		}

		return true;
	}

	const validateLogin = (values) => {
		if (values.email.trim() == '') {
			showError(`'Email' is required`)

			return false
		}

		if (values.password.trim() == '') {
			showError(`'Password' is required`)

			return false
		}

		return true;
	}

	const loginHandler = async (values) => {
		if (validateLogin(values) == true) {
			authenticationService.login(values?.email, values?.password)
				.then((result) => {
					if (result.error)
						throw new Error(result.error);

					if (result?.code == 403) {
						showError(result.message);
					}
					else {
						setAuthentication(result);

						navigate(`/my-profile`);

						showSuccess(`Successfully logged in profile: ${result?.username}`);
					}
				})
				.catch((error) => {
					console.log(error);
					navigate(`/error`);

					showError('Something went wrong');
				});
		}
	}

	const registerHandler = async (values) => {
		if (validateRegister(values) == true) {
			values.age = calculateAge(values.dateOfBirth);

			authenticationService.register(values)
				.then((result) => {
					if (result.error)
						throw new Error(result.error);

					if (result?.code == 403) {
						showError(result.message);
					}
					else {
						navigate(`/login`);

						showSuccess(`Successfully registered`);
					}
				})
				.catch((error) => {
					console.log(error);
					navigate(`/error`);

					showError('Something went wrong');
				});
		}
	}

	const logoutHandler = () => {
		setAuthentication({});
		navigate(`/`);

		showSuccess(`Successfully logged out`);
	}

	const authenticationProviderValues = {
		loginHandler,
		registerHandler,
		logoutHandler,
		authentication,
		isAdmin: authentication.isAdmin,
		isAuthenticated: !!authentication.accessToken,
		showSuccess,
		showError,
		showInfo,
		showWarning
	}

	return (
		<AuthenticationContext.Provider value={authenticationProviderValues}>
			<Toast ref={toast} />
			{children}
		</AuthenticationContext.Provider>
	);
};

AuthenticationContext.displayName = 'AuthenticationContext';

export default AuthenticationContext;