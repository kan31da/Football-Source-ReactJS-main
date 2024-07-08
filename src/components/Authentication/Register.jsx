import { useContext } from 'react';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password'
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

import { useForm } from '../../hooks/useForm';
import AuthenticationContext from '../../contexts/AuthenticationContext';

import styles from './Register.module.css'

const Register = () => {
	const { registerHandler } = useContext(AuthenticationContext);

	const { formValues, handleInputChange, handleSubmit } = useForm({
		username: '',
		imageUrl: '',
		dateOfBirth: null,
		email: '',
		password: '',
		age: '',
		favouriteTeams: []
	}, registerHandler);

	return (
		<div className={styles['register-section']}>
			<h1 className={styles['register-title']}>Register Form</h1>
			<form className={styles['register-form']} onSubmit={handleSubmit}>
				<div className="p-fluid">
					<div className="p-field">
						<label htmlFor="username">Username</label>
						<InputText
							id="username"
							name="username"
							placeholder='Username'
							value={formValues.username}
							onChange={handleInputChange}
						/>
					</div>

					<div className="p-field">
						<label htmlFor="imageUrl">Image Url</label>
						<InputText
							id="imageUrl"
							name="imageUrl"
							placeholder='Image Url'
							value={formValues.imageUrl}
							onChange={handleInputChange}
						/>
					</div>

					<div className="p-field">
						<label htmlFor="dateOfBirth">Date of Birth</label>
						<Calendar
							id="dateOfBirth"
							name="dateOfBirth"
							dateFormat='dd/mm/yy'
							placeholder={new Date().toDateString('dd/mm/yy')}
							value={formValues.dateOfBirth}
							onChange={handleInputChange} showIcon
						/>
					</div>

					<div className="p-field">
						<label htmlFor="email">Email</label>
						<InputText
							id="email"
							name="email"
							type='email'
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
							placeholder='Password'
							name="password"
							promptLabel="Choose a password"
							weakLabel="Too simple"
							mediumLabel="Average complexity"
							strongLabel="Complex password"
						/>
					</div>
				</div>

				<Button className={`${styles['submit-btn']} pi pi-sign-in`} type="submit" label=" Register" />
			</form>
		</div>
	);
};

export default Register;