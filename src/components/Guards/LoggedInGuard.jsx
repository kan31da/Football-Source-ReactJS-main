import { useContext } from "react";
import { Navigate, Outlet  } from "react-router-dom";

import AuthenticationContext from '../../contexts/AuthenticationContext';

const LoggedInGuard = () => {
	const { isAuthenticated } = useContext(AuthenticationContext);

    if (isAuthenticated == true) {
       return <Navigate to='/' />;
    } 

    return (
        <Outlet />
    )
}

export default LoggedInGuard;