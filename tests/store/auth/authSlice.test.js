import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { initialState, authenticatedState, notauthenticatedState } from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Pruebas en authSlice.js', () => { 

    test('debe de regresar el estado inicial', () => { 
        //console.log(authSlice.getInitialState())
        expect(authSlice.getInitialState()).toEqual(initialState)
    });

    test('debe de realizar un login', () => { 

        const state = authSlice.reducer(initialState, onLogin( testUserCredentials ));
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        });

    });

    test('debe de realizar el logout', () => { 
        
        const state = authSlice.reducer(authenticatedState, onLogout());
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });

    });

    test('debe de realizar el logout con errorMessage', () => { 
        
        const errorMessagePayload = 'Realizando Logout';
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessagePayload));
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessagePayload
        });

    });

    test('debe de realizar el logout con errorMessage y limpiar con ClearMessage', () => { 
        
        const errorMessagePayload = 'Realizando Logout';
        let state = authSlice.reducer(authenticatedState, onLogout(errorMessagePayload));
        
        state = authSlice.reducer(authenticatedState, clearErrorMessage());
        
        expect( state.errorMessage ).toBe(undefined);
        
    });

});