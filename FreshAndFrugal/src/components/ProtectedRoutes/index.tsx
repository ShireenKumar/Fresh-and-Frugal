import { useUserAuth } from '@/context/userAuthContext';
import * as React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface IProtectedRoutesProps {}

const ProtectedRoutes: React.FunctionComponent<IProtectedRoutesProps> = (props) => {
    //const isAuth: boolean = false;
    const { user } = useUserAuth();
    const location = useLocation();

    return user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
}

export default ProtectedRoutes;