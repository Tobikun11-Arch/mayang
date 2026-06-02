export interface UserReport {
  id: string;
  type: string;
  severity: string;
  range: string;
  description: string;
  lat: number;
  lng: number;
  contactName: string;
  contactPhone: string;
  imagePreviews: string[];
  reportedAt: string;
}
