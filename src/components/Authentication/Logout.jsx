import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AuthenticationContext from '../../contexts/AuthenticationContext';
import * as authenticationService from '../../services/authenticationService';

const Logout = () => {
	const { logoutHandler } = useContext(AuthenticationContext);

	const navigate = useNavigate();

	useEffect(() => {
		authenticationService.logout()
			.then(() => {
				logoutHandler();
			})
			.catch(() => {
				navigate(`/error`);
			});
	}, [])
}

export default Logout;