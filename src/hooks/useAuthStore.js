//TODO esto es para no usar thunk para peticiones async con redux
import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";


export const useAuthStore = () => {
    
    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async( { email, password } ) => {
        try {
            
            dispatch( onChecking() );
            const { data } = await calendarApi.post('/auth', { email, password });                       
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ uid: data.uid, name: data.name }) );
            
        } catch (error) {
            dispatch( onLogout('Creadentials not found.') );
            setTimeout(()=>{
                dispatch( clearErrorMessage() );
            }, 10)
        }
    }

    const startRegisterUser = async({ name, email, password }) => {
        try {
            
            dispatch( onChecking() );
            const { data } = await calendarApi.post('/auth/new', { name, email, password });                       
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ uid: data.uid, name: data.name }) );
            
        } catch (error) {
            dispatch( onLogout(error.response.data?.msg || 'Error') );
            setTimeout(()=>{
                dispatch( clearErrorMessage() );
            }, 10)
        }
    }

    const checkToken = async() => {
        try {
            const token = localStorage.getItem('token');
            if( !token ) return dispatch( onLogout() );
            
            const { data } = await calendarApi.get('/auth/renew');                       
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ uid: data.uid, name: data.name }) );    

        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogoutCalendar() );
        dispatch( onLogout() );
    }

    return{
        //* Properties
        status, 
        user, 
        errorMessage,

        //*Method
        startLogin,
        startRegisterUser,
        checkToken,
        startLogout
    }

}

