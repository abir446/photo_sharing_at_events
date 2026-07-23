import { EventEmitter } from "events";

const globalForEmitter = global as unknown as {
  uploadEvents: EventEmitter;
};

export const uploadEvents =
  globalForEmitter.uploadEvents || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEmitter.uploadEvents = uploadEvents;
}
