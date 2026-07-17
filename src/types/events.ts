export interface Event {
  eventId: string;          // Maps to EventID
  createdByUserID: string;  // Maps to CreatedByUserID
  name: string;             // Maps to Name
  startDate: string;        // Maps to StartDate
  endDate: string;          // Maps to EndDate
  address?: string;         // Optional field
  postcode?: string;        // Optional field
  mapURL?: string;          // Maps to MapURL
  description?: string;     // Optional field
  s3FolderCreated?: boolean;// Maps to S3FolderCreated
}