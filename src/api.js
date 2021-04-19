import { get as getData } from "./api/airtable.js";

export async function get() {
  return getData();
}
