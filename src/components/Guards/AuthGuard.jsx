import { useContext } from "react";
import { Navigate, Outlet  } from "react-router-dom";

import AuthenticationContext from '../../contexts/AuthenticationContext';

const AuthGuard = () => {
	const { isAuthenticated } = useContext(AuthenticationContext);

    if (!isAuthenticated) {
       return <Navigate to='/login' />;
    } 

    return (
        <Outlet />
    )
}

export default AuthGuard;