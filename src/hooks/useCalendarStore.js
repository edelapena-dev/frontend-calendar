import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import calendarApi from '../api/calendarApi';
import { convertDateEvents } from '../helpers/convertDateEvents';
import { onAddNewEvent, onSetActiveEvent, onUpdateEvent, onDeleteEvent, onGetEvents } from '../store';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth);

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    }

    const startSavingEvent = async( calendarEvent ) => {
        try {
            if( calendarEvent.id ){
                //*Actualizo
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent);
                dispatch( onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            const { data } = await calendarApi.post('/events', calendarEvent );
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));
        } catch (error) {
            console.log(error);
            Swal.fire('Error', error.response.data?.msg,'error');
        }
    }

    const startDeleteEvent = async() => {
        try {
            await calendarApi.delete(`/events/${ activeEvent.id }`);
            dispatch( onDeleteEvent() );    
        } catch (error) {
            console.log(error);
            Swal.fire('Error', error.response.data?.msg,'error');
        }        
    }

    const startLoadingEvents = async() => {
        try {
            
            const { data } = await calendarApi.get('/events');
            const convertDate = convertDateEvents( data.event );
            dispatch( onGetEvents( convertDate ) );

        } catch (error) {
            console.log(error)
        }
    }

    return{
        //* Properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //*Methods
        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvents,
    }
}
