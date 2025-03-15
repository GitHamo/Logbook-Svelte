import { withApiAuth } from '$lib/server/api';
import { error, json } from '@sveltejs/kit';
// import moment from 'moment';
import { getBookStats } from '$lib/api/logger';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    return withApiAuth(event, async () => {
        try {
            // const logbookResponse = {
            //     activity: [
            //         {
            //             day: "03/12/2024",
            //             value: Math.floor(Math.random() * 100),
            //             score: "#f054fa",
            //         },
            //         {
            //             day: "04/12/2024",
            //             value: Math.floor(Math.random() * 100),
            //             score: "#96f808",
            //         },
            //         {
            //             day: "05/12/2024",
            //             value: Math.floor(Math.random() * 100),
            //             score: "#615d28",
            //         },
            //         {
            //             day: moment().subtract(2, 'day').format('DD/MM/YYYY'),
            //             value: Math.floor(Math.random() * 100),
            //             score: "#ec9a1c",
            //         },
            //         {
            //             day: moment().subtract(1, 'day').format('DD/MM/YYYY'),
            //             value: Math.floor(Math.random() * 100),
            //             score: "#7f6a7a",
            //         },
            //         {
            //             day: moment().format('DD/MM/YYYY'),
            //             value: Math.floor(Math.random() * 100),
            //             score: "#b2c606",
            //         },
            //         {
            //             day: moment().add(1, 'day').format('DD/MM/YYYY'),
            //             value: Math.floor(Math.random() * 100),
            //             score: "#268932",
            //         },
            //         {
            //             day: moment().add(2, 'day').format('DD/MM/YYYY'),
            //             value: Math.floor(Math.random() * 100),
            //             score: "#2c7cb8",
            //         },
            //     ],
            //     averages: [
            //         ["all",8.82,302],
            //         ["daily",8.82,302],
            //         ["weekly",61.75,43],
            //         ["monthly",264.55,10],
            //         ["yearly",2664,1],
            //     ],
            // };

            const bookId = event.params.bookId;
            const logbookResponse = await getBookStats(bookId, event.locals.authToken as string); 

            return json(logbookResponse);
        } catch (err) {
            throw error(500, 'Failed to load logbook');
        }
    });
};