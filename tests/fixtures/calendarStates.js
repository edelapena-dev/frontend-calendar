export const events = [
    {
        id: '1',
        start: new Date('2022-08-09 16:00:00'),
        end: new Date('2022-08-09 18:00:00'),
        title: "Cumpleaños",
        notes: "es a las 10 AM",
    },
    {
        id: '2',
        start: new Date('2022-09-23 08:00:00'),
        end: new Date('2022-09-23 10:00:00'),
        title: "Cumpleaños Esteban",
        notes: "es a las 08 AM",
    }
];

export const initialState = {
    isLoadingEvent: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvent: false,
    events: [...events],
    activeEvent: null
}

export const calendarActiveWithEventsState = {
    isLoadingEvent: false,
    events: [...events],
    activeEvent: { ...events[0] }
}