import type { Patient } from "./Patient";

export type Slot = {
  available: boolean;
  patient?: Patient;
};