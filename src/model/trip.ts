import type { TripStatus } from "./trip-status.type";

export interface Trip {
  slug: string;
  title: string;
  description: string;
  thumb: string;   // relative to public/
  path: string;    // relative link to the trip folder (subfolder-safe)
  featured?: boolean;
  status?: TripStatus;
}
