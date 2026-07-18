import { createClient } from '@/lib/supabaseClient'; // Import your local SSR-compatible client

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const url = `${backendUrl}/api${endpoint}`;

    // Use the SSR-compatible client defined in your src/lib/supabaseClient.ts
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // 1. Initialise a proper Headers object
    const headers = new Headers(options.headers);

    // 2. Set the default Content-Type if one wasn't explicitly provided
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // 3. Attach the Supabase JWT securely
    if (session) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Server Error Response:", text);
        throw new Error(`Server returned ${response.status}: ${text}`);
    }

    // Handle 204 No Content for DELETE requests cleanly
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function getMyEvents() {
    return fetchFromBackend('/events', { method: 'GET' });
}

export async function createEvent(eventData: any) {
    return fetchFromBackend('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
}