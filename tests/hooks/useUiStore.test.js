import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { useUiStore } from '../../src/hooks/useUiStore';
import { uiSlice } from '../../src/store';
import { Provider } from 'react-redux';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    });
}


describe('Pruebas en useUiStore.js', () => { 

    test('debe de regresar los valores por defecto', () => { 
        
        const mockStore = getMockStore({
            isDateModalOpen: false
        });

        const { result } = renderHook( () => useUiStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });
        //console.log(result)
        expect( result.current ).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any(Function), 
            openDateModal: expect.any(Function), 
            toogleDateModal: expect.any(Function),                 
        })

    });

    test('openDateModal debe de colocar true en la variable isDateModalOpen', () => { 
        const mockStore = getMockStore({ isDateModalOpen: false });
        const { result } = renderHook( () => useUiStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });

        const { isDateModalOpen, openDateModal } = result.current;

        act(() => {
            openDateModal()    
        });
        //* No se debe tomar la variable directamente de isDateModalOpen por que al ser un valor primitivo no se modifica al ejecutar el metodo
        expect(result.current.isDateModalOpen).toBeTruthy();
    });

    test('closeDateModal debe de colocar false en la variable isDateModalOpen', () => { 
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook( () => useUiStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });

        const { closeDateModal } = result.current;

        act(() => {
            closeDateModal()    
        });
        //* No se debe tomar la variable directamente de isDateModalOpen por que al ser un valor primitivo no se modifica al ejecutar el metodo
        expect(result.current.isDateModalOpen).toBeFalsy();
    });

    test('toogleDateModal debe de colocar false o true dependiendo como este la variable isDateModalOpen al inicio', () => { 
        const mockStore = getMockStore({ isDateModalOpen: true });
        const { result } = renderHook( () => useUiStore() , {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider> 
        });

        act(() => {
            result.current.toogleDateModal()    
        });
        //* No se debe tomar la variable directamente de isDateModalOpen por que al ser un valor primitivo no se modifica al ejecutar el metodo
        expect(result.current.isDateModalOpen).toBeFalsy();

        act(() => {
            result.current.toogleDateModal()    
        });
        expect(result.current.isDateModalOpen).toBeTruthy();
    });
})