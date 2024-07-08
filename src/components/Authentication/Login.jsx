import { useContext } from 'react';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

import { useForm } from '../../hooks/useForm';
import AuthenticationContext from '../../contexts/AuthenticationContext';

import styles from './Login.module.css'

const Login = () => {
	const { loginHandler } = useContext(AuthenticationContext);

	const { formValues, handleInputChange, handleSubmit } = useForm({
		email: '',
		password: '',
	}, loginHandler);

	return (
		<div className={styles['login-section']}>
			<h1 className={styles['login-title']}>Login Form</h1>
			<form className={styles['login-form']} onSubmit={handleSubmit}>
				<div className="p-fluid">
					<div className="p-field">
						<label htmlFor="username">Email:</label>
						<InputText
							id="email"
							name="email"
							placeholder='example@example.com'
							value={formValues.email}
							onChange={handleInputChange}
						/>
					</div>

					<div className="p-field">
						<label htmlFor="password">Password</label>
						<Password
							value={formValues.password}
							onChange={handleInputChange}
							toggleMask
							id="password"
							name="password"
							placeholder='Password'
							promptLabel="Choose a password"
							weakLabel="Too simple"
							mediumLabel="Average complexity"
							strongLabel="Complex password"
						/>
					</div>
				</div>

				<Button className={`${styles['submit-btn']} pi pi-sign-in`} type="submit" label=" Login" />
			</form>
		</div>
	);
};

export default Login;