import type { Trip } from "./trip";

export interface ContentConfig {
  basePath: string; // kept for future flexibility
  trips: Trip[];
}