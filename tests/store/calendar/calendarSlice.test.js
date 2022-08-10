import { calendarSlice, onAddNewEvent, onDeleteEvent, onGetEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarActiveWithEventsState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en calendarSlice.js', () => { 

    test('debe de regresar el estado por defecto', () => {
        
        const state = calendarSlice.getInitialState();
        expect(state).toEqual(initialState);    
        
    });

    test('onSetActiveEvent debe de activar el evento', () => {
        
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        //console.log(state)
        expect( state.activeEvent ).toEqual( events[0] );
        
    });

    test('onAddNewEvent debe de agregar el Event', () => { 

        const newEvent = {
            id: '3',
            start: new Date('2022-05-09 16:00:00'),
            end: new Date('2022-05-09 18:00:00'),
            title: "Cumpleaños!!!!!!",
            notes: "es a las 10 AM!!!"
        }

        const state = calendarSlice.reducer( initialState, onAddNewEvent(newEvent) );
        //console.log(state)
        expect(state.events).toEqual( [newEvent] );
    });

    test('onUpdateEvent debe de actualziar el evento', () => { 
        const updateEvent = {
            id: '1',
            start: new Date('2022-05-09 16:00:00'),
            end: new Date('2022-05-09 18:00:00'),
            title: "Cumpleaños!!!!!!",
            notes: "es a las 10 AM!!!"
        }
        const state = calendarSlice.reducer( calendarWithEventsState , onUpdateEvent(updateEvent) );
        //console.log(state)
        expect( state.events ).toContain( updateEvent );

    })

    test('onDeleteEvent debe de borrar el evento activo ', () => { 
        const deleteEvent = {
            id: '1',
            start: new Date('2022-05-09 16:00:00'),
            end: new Date('2022-05-09 18:00:00'),
            title: "Cumpleaños!!!!!!",
            notes: "es a las 10 AM!!!"
        }
        const state = calendarSlice.reducer( calendarActiveWithEventsState , onDeleteEvent() );
        //console.log(state)
        expect( state.activeEvent ).toBe(null);
        expect( state.events ).not.toContain(deleteEvent);
    });

    test('onGetEvents debe de establecer los eventos', () => { 
        const state = calendarSlice.reducer( initialState , onGetEvents(events) );
        //console.log(state)
        expect( state.isLoadingEvent ).toBeFalsy();
        expect( state.events ).toEqual(events);
    });

    test('onLogoutCalendar debe de limpiar el estado', () => { 
        
        const state = calendarSlice.reducer( calendarActiveWithEventsState , onLogoutCalendar() );
        //console.log(state);
        expect( state ).toEqual( initialState );
    });

});