import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
 
// Calls the separate Spring Boot backend (event CRUD, etc).
export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const url = `${backendUrl}/api${endpoint}`;
 
    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
 
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': session ? `Bearer ${session.access_token}` : '',
    };
 
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
 
    return response.json();
}
 
// Calls this Next.js app's own /api routes (S3 upload/list/delete, completeform, etc).
// These run same-origin, so the Supabase session cookie is sent automatically —
// no bearer token needed, and no separate host to configure.
export async function fetchLocalApi(endpoint: string, options: RequestInit = {}) {
    const url = `/api${endpoint}`;
 
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
 
    const response = await fetch(url, {
        ...options,
        headers,
    });
 
    if (!response.ok) {
        const text = await response.text();
        console.error("Server Error Response:", text);
        throw new Error(`Server returned ${response.status}: ${text}`);
    }
 
    return response.json();
}