import Settings from "sketch/settings";
import { get as getFromAirtable } from "./api/airtable.js";
import { get as getFromSpreadsheets } from "./api/spreadsheets.js";
import { select } from "./utils.js";

const supportedApis = {
  "Airtable": getFromAirtable,
  "Google Spreadsheets": getFromSpreadsheets,
};

export async function get() {
  const type = Settings.settingForKey("mktgoo.copies.api") || setType();

  return supportedApis[type]();
}

export function setType() {
  const type = select("Where are the copies?", Object.keys(supportedApis));
  Settings.setSettingForKey("mktgoo.copies.api", type);
  return type;
}
