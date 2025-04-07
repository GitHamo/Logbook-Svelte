import { env } from '$env/dynamic/public';

export const APP_CONSTANTS = {
    API: {
        ALLOWED_ORIGINS: [
            process.env.APP_URL,
            env.PUBLIC_APP_URL,
            'http://localhost:5173',

        ] as const,
        BASE_URL: process.env.APP_RESOURCES_API_URL || env.PUBLIC_APP_RESOURCES_API_URL || 'http://localhost:8000',
    },
    ROUTES: {
        AFTER_LOGIN: '/',
        AFTER_LOGOUT: '/login'
    },
    COOKIES: {
        AUTH: {
            COOKIE_NAME: 'auth_token',
            COOKIE_EXPIRY: 60 * 60 * 24 * 7 // 1 week
        },
        CURRENT_BOOK: {
            COOKIE_NAME: 'current_book',
            COOKIE_EXPIRY: 60 * 60 * 24 * 365 // 1 year
        },
    },

    APP_NAME: 'Book Management App',
    VERSION: '1.0.0'
} as const;