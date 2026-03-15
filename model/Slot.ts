import type { Patient } from "./Patient";

export type Slot = {
  _id?: string;
  available: boolean;
  patient?: Patient;
};
