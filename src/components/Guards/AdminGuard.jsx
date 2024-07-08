import { useContext } from "react";
import { Navigate, Outlet  } from "react-router-dom";

import AuthenticationContext from '../../contexts/AuthenticationContext';

const AdminGuard = () => {
	const { isAdmin } = useContext(AuthenticationContext);

    if (!isAdmin) {
       return <Navigate to='/access-denied' />;
    } 

    return (
        <Outlet />
    )
}

export default AdminGuard;