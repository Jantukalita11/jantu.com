export const APP_NAME = "Audio AI Studio";

export type Role = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export interface Plan {
  id: string;
  name: string;
  priceMonthlyCents: number;
  credits: number;
  seatsIncluded: number;
}
