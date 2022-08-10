export const initialState = {
    status: 'checking', //'authenticated' 'not-authenticated'
    user: {},
    errorMessage: undefined
}

export const authenticatedState = {
    status: 'authenticated', //'authenticated' 'not-authenticated'
    user: {
        uid: '123456',
        name: 'Esteban De la Peña'
    },
    errorMessage: undefined
}

export const notauthenticatedState = {
    status: 'not-authenticated', //'authenticated' 'not-authenticated'
    user: {},
    errorMessage: undefined
}