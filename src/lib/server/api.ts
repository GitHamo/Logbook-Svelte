import { APP_CONSTANTS } from '$lib';
import { error, type RequestEvent } from '@sveltejs/kit';

export function checkAuth(request: Request, locals: App.Locals) {
    // First try to get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token) return;
    }
    
    // Then try to get token from locals
    if (locals.authToken) return;
    
    throw error(401, 'Unauthorized');
}

export function checkCORS(request: Request) {
    const origin = request.headers.get('origin');
    if (origin && !APP_CONSTANTS.API.ALLOWED_ORIGINS.includes(origin)) {
        throw error(403, 'Forbidden');
    }
}

export function setSecurityHeaders(response: Response) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "default-src 'self'");
    return response;
}

// Helper function to combine all API checks
export async function withApiAuth(event: RequestEvent, handler: () => Promise<Response>) {
    checkCORS(event.request);
    checkAuth(event.request, event.locals);
    const response = await handler();
    return setSecurityHeaders(response);
} 