export interface ResponseEnvelope<T> {
  count: number;
  data: T | T[];
}
