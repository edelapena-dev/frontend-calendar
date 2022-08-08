import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

// const templateEvent = {
//     _id: new Date().getTime(),
//     title: "Cumpleaños",
//     notes: "es a las 10 AM",
//     start: new Date(),
//     end: addHours( new Date(), 2),
//     bgColor: '#fafafa',
//     user: {
//         _id: '123',
//         name: 'Esteban'
//     }
// };

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        isLoadingEvent: true,
        events: [],
        activeEvent: null
    },
    reducers: {
        onSetActiveEvent: ( state, { payload } ) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: ( state, { payload }) => {
            state.events.push(payload);
            state.activeEvent = null;
        },
        onUpdateEvent: ( state, { payload }) => {
            state.events = state.events.map( event => {
                if(event.id === payload.id){
                    return payload
                }
                return event;
            });
            state.activeEvent = null;
        },
        onDeleteEvent: ( state ) => {
            if(state.activeEvent !== null)
                state.events = state.events.filter( event => event.id !== state.activeEvent.id);
            state.activeEvent = null;
        },
        onGetEvents: ( state, { payload = [] } ) => {
            state.isLoadingEvent = false;
            // state.events = payload;
            payload.forEach( event => {
                const exists = state.events.some( dbEvent => dbEvent.id === event.id );
                if( !exists ){
                    state.events.push( event );
                }
                
            });
            state.activeEvent = null;
        },
        onLogoutCalendar: ( state ) => {
            state.isLoadingEvent = true;
            state.events = [];
            state.activeEvent = null;
        }
    }
});

// Action creators are generated for each case reducer function
export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent, onGetEvents, onLogoutCalendar } = calendarSlice.actions;