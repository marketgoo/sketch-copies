import Settings from "sketch/settings";
import * as airtable from "./api/airtable.js";
import * as spreadsheets from "./api/spreadsheets.js";
import { select } from "./utils.js";

const supportedApis = {
  "Airtable": airtable,
  "Google Spreadsheets": spreadsheets,
};

export async function get() {
  const type = Settings.settingForKey("mktgoo.copies.api") || askType();

  return supportedApis[type].get();
}

export function reset() {
  const type = askType();
  return supportedApis[type].reset();
}

function askType() {
  const type = select("Where are the copies?", Object.keys(supportedApis));
  Settings.setSettingForKey("mktgoo.copies.api", type);
  return type;
}