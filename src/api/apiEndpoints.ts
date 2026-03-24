import { HttpMethod } from "./httpMethods";

export const ApiEndpoint = Object.freeze({
  GET_SLOTS: { url: "api/getSlots", method: HttpMethod.POST },
  BOOK_SLOT: { url: "api/bookSlots", method: HttpMethod.POST },
} as const);

export type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];