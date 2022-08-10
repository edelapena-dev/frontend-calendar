import calendarApi from "../../src/api/calendarApi";

describe('Pruebas en CalendarApi', () => { 

    test('debe de tener la configuración por defecto', () => {  
        //console.log(calendarApi)
        //console.log(process.env)
        expect( calendarApi.defaults.baseURL ).toBe( process.env.VITE_API_URL );
        
    });

    test('debe de tener el x-token en el header de todas las peticiones', async() => { 

        const token = 'TOKEN-PRUEBA-ABC';
        localStorage.setItem('token', token);
        const res = await calendarApi.get('/auth');
        //console.log(res.config.headers['x-token']);
        expect(res.config.headers['x-token']).toBe( token );

    });

});