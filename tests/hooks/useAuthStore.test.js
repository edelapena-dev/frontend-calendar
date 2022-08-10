import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { calendarApi } from '../../src/api';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store';
import { initialState, notauthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
}

describe('Pruebas en useAuthStore.js', () => { 
    beforeEach( () => localStorage.clear() );

    test('debe de regresar los valores por defecto', () => { 
        const mockStore = getMockStore({ ...initialState});

        const { result } = renderHook( () => useAuthStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });
        //console.log(result)
        expect( result.current ).toEqual({
            status: 'checking', //'authenticated' 'not-authenticated'
            user: {},
            errorMessage: undefined,

            startLogin: expect.any(Function), 
            startRegisterUser: expect.any(Function), 
            checkToken: expect.any(Function), 
            startLogout: expect.any(Function), 
        })
    });

    test('startLogin debe de iniciar sesion', async() => { 
        
        const mockStore = getMockStore({ ...notauthenticatedState });

        const { result } = renderHook( () => useAuthStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });
        
        await act( async() => {
            await result.current.startLogin( testUserCredentials );    
        });

        const { errorMessage, status, user } = result.current;

        //console.log({ errorMessage, status, user });
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                uid: testUserCredentials.uid,
                name: testUserCredentials.name
            }
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

    });

    test('startLogin debe de fallar iniciar sesion', async() => { 

        const mockStore = getMockStore({ ...notauthenticatedState });

        const { result } = renderHook( () => useAuthStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });
        
        await act( async() => {
            await result.current.startLogin( { email: 'test@gmail.com', password: '12345678'} );    
        });

        const { errorMessage, status, user } = result.current;
        //console.log(status)
        //console.log({ errorMessage, status, user });
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Creadentials not found.',
            status: 'not-authenticated',
            user: {}
        });
        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('token-init-date')).toBe(null);

        await waitFor(
            () => expect( result.current.errorMessage ).toBe(undefined)
        );
    });

    test('startRegisterUser debe de crear un usuario', async() => { 

        const mockStore = getMockStore({ ...notauthenticatedState });

        const { result } = renderHook( () => useAuthStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });

        //*Esto es para evitar que la funcion se cree y cree un usuario
        const spyOn = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: '123124asdasd',
                name: 'Token User',
                token: 'tokenasdqwe314fd'
            }
        });

        await act( async() => {
            await result.current.startRegisterUser({ 
                name: 'TestUser2', 
                email: 'test2@gmail.com', 
                password: '12345678'
            });    
        });

        const { errorMessage, status, user } = result.current;
        //console.log({ errorMessage, status, user })
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { uid: '123124asdasd', name: 'Token User' }
        });

        //*Esto para destruir el spy
        spyOn.mockRestore();
    });

    test('startRegisterUser debe de enviar error al crear un usuario', async() => { 

        const mockStore = getMockStore({ ...notauthenticatedState });

        const { result } = renderHook( () => useAuthStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });

        await act( async() => {
            await result.current.startRegisterUser({ 
                name: 'Test User', 
                email: 'test@gmail.com', 
                password: '12345678'
            });    
        });

        const { errorMessage, status, user } = result.current;
        //console.log({ errorMessage, status, user })
        expect(errorMessage).toEqual(expect.any(String));
        expect(errorMessage).toBe('Error - User email exists.');
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Error - User email exists.", 
            status: "not-authenticated", 
            user: {}
        });
    });

    test('checkToken debe fallar si no hay token', async() => { 
        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook( () => useAuthStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });

        // await act( async() => {
        //     await result.current.startLogin( { email: 'test@gmail.com', password: '12345678'} );    
        // });

        // const { errorMessage, status, user } = result.current;

        await act( async() => {
            await result.current.checkToken();    
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined, 
            status: "not-authenticated", 
            user: {}
        });

        expect(localStorage.getItem('token')).toBe(null);
        expect(localStorage.getItem('token-init-date')).toBe(null);

    });

    test('checkToken debe autenticar si hay token', async() => { 
        
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });     

        await act( async() => {
            await result.current.checkToken();    
        });
        const { errorMessage, status, user } = result.current;
        //console.log({ errorMessage, status, user })
        expect({ errorMessage, status, user }).toEqual({
            status: "authenticated",
            user: {
                name: "Test User",
                uid: "62f1918d80095b7d6997f5cb"
            },
            errorMessage: undefined, 
        });

    });

});