// src/types/event.ts
export interface Event {
  eventid: string;   // Changed from EventID to match API/DB
  name: string;      // Changed from Name to match API/DB
  startdate?: string; // Changed from StartDate to match API/DB
  enddate?: string;   // Changed from EndDate to match API/DB[cite: 1]
  created_by_userid?: string; // Updated to match your actual database column name[cite: 1]
}
