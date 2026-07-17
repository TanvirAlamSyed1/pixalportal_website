import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
    // Force the full URL explicitly
    // Ensure your fetch call includes the /api prefix
    const url = `http://localhost:8080/api${endpoint}`;
    console.log("Attempting request to:", url);

    const supabase = createClientComponentClient();
    const { data: { session } } = await supabase.auth.getSession();
    console.log("DEBUG: Current Session:", session);

    const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Move this above to allow defaults to be overridden safely
    'Authorization': session ? `Bearer ${session.access_token}` : '', 
};

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Tells browser to include cookies/auth context
    }); 

    if (!response.ok) {
        // Log the response text to see the real error
        const text = await response.text();
        console.error("Server Error Response:", text);
        throw new Error(`Server returned ${response.status}: ${text}`);
    }

    return response.json();
}