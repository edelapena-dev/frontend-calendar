import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "../auth";
import { CalendarPage } from "../calendar";
import { useAuthStore, useCalendarStore } from "../hooks";

export const AppRouter = () => {
    
    //const authStatus = 'not-authenticated'; //not-authenticated
    const { status, checkToken } = useAuthStore();
    
    useEffect(() => {
        checkToken();
    }, []);    
    
    if( status === 'checking' ){
        return(
            <h3>Loading ...</h3>
        )
    }

    return (
        <Routes>
            {
              (status === 'not-authenticated')
                ? (
                    <>  
                        <Route path="/auth/*" element={ <LoginPage />} />
                        <Route path="/*" element={ <Navigate to='/auth/login' /> } />
                    </>    
                  )
                : (
                    <>  
                        <Route path="/" element={ <CalendarPage /> } />
                        <Route path="/*" element={ <Navigate to='/' /> } />
                    </>    
                  )
            }
        </Routes>
    )
}
