import React from 'react'
import './Auth.css'
import { Outlet, Navigate } from 'react-router-dom'
import { matchPath} from 'react-router-dom'
import {useLocation} from 'react-router-dom'



function Auth() {
    const location = useLocation();

    const match = matchPath({path:"/auth/login", exact:true}, location.pathname) || matchPath({path:"/auth/register", exact:true}, location.pathname) 
    || matchPath({path:"/auth/forgot-password", exact:true}, location.pathname) || matchPath({path:"/auth/reset-password/:token", exact:true}, location.pathname);


  return (
    <div className='page-container auth-page'>
        <div className='cool-background-seperator'>
            <h1 className='auth-page-title'>Διαχείριση Ζημιών Ε.Μ.Π</h1>
        </div>

        <div className='auth-container'>
            {!match && <Navigate to='/auth/login/' replace />}
            <Outlet />
        </div>
    </div>
  )
}

export default Auth