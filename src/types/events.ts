// src/types/event.ts
export interface Event {
  EventID: string;
  Name: string;
  StartDate?: string;
  EndDate?: string;
  user_id?: string; // Maps to the authenticated user's ID in Supabase
}
