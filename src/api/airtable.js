import Settings from "sketch/settings";
import { Document } from "sketch/dom";
import { alert, prompt } from "../utils.js";

function getAPIData() {
  const document = Document.getSelectedDocument();

  let database = Settings.settingForKey("mktgoo.copies.airtable.database");
  let apikey = Settings.settingForKey("mktgoo.copies.airtable.apikey");
  let table = Settings.documentSettingForKey(
    document,
    "mktgoo.copies.airtable.table",
  );

  if (!database) {
    database = prompt("What's the database?");
    Settings.setSettingForKey("mktgoo.copies.airtable.database", database);
  }

  if (!apikey) {
    apikey = prompt("What's the API key?");
    Settings.setSettingForKey("mktgoo.copies.airtable.apikey", apikey);
  }

  if (!table) {
    table = prompt("What's the table?");
    Settings.setDocumentSettingForKey(
      document,
      "mktgoo.copies.airtable.table",
      table,
    );
  }

  return [database, apikey, table];
}

export async function get() {
  const [database, apikey, table] = getAPIData();

  if (!database || !apikey || !table) {
    return alert(
      "Cannot get data",
      "You have to set a database, api key and table from Airtable",
    );
  }

  const url =
    `https://api.airtable.com/v0/${database}/${table}?api_key=${apikey}`;

  return fetch(url)
    .then((res) => res.json())
    .then((json) => {
      const data = {};

      json.records.forEach((item) => {
        const key = item.fields.id;
        const value = item.fields.copy;
        data[key] = value;
      });

      return data;
    });
}
