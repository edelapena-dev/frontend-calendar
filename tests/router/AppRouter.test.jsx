import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import { useAuthStore } from '../../src/hooks';
import { AppRouter } from '../../src/router/AppRouter';

jest.mock('../../src/hooks/useAuthStore');

jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
})
);

describe('Pruebas en <AppRouter />', () => { 
    
    const mockCheckToken = jest.fn();
    beforeEach( () => jest.clearAllMocks() );

    test('debe de mostrar la pantalla de carga y llamar checkToken', () => { 
        
        useAuthStore.mockReturnValue({
            status: 'checking',
            checkToken: mockCheckToken
        });

        render(<AppRouter />);
        //const btn = screen.getByLabelText('btn-delete');
        //screen.debug();
        expect(screen.getByText('Loading ...')).toBeTruthy();
        expect(mockCheckToken).toHaveBeenCalled();
    });
    
    test('debe de mostrar la pantalla de login si no esta autenticado', () => { 
        
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkToken: mockCheckToken
        });

        const { container } = render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );
        //const btn = screen.getByLabelText('btn-delete');
        //screen.debug();
        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(screen.getByText('Registro')).toBeTruthy();
        expect( container ).toMatchSnapshot();
    });

    test('debe de mostrar el calendario si estamos autenticados', () => { 
        
        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkToken: mockCheckToken
        });

        render(
            <MemoryRouter>
                <AppRouter />
            </MemoryRouter>
        );
        //const btn = screen.getByLabelText('btn-delete');
        //screen.debug();
        //*Para evitar que jest renderice el CalendarPage y tengamos que hacer mock par cada CustomHook
        //*Se crea un Mock que una renderizacion propia de CalendarPage que esta al Inicio
        expect( screen.getByText('CalendarPage')).toBeTruthy();


    });


});