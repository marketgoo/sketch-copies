import Settings from "sketch/settings";
import { Document } from "sketch/dom";
import { alert, prompt } from "../utils.js";

function getAPIData() {
  const document = Document.getSelectedDocument();

  let url = Settings.documentSettingForKey(document, "mktgoo.copies.url");

  if (!url) {
    url = prompt("What's the public url of the tsv file?", "");
    Settings.setDocumentSettingForKey(document, "mktgoo.copies.url", url);
  }

  return url;
}

export async function get() {
  const url = getAPIData();

  if (!url) {
    return alert(
      "Cannot get data",
      "You have to set set a url to get the copies from Google Spreadsheets",
    );
  }

  return fetch(url)
    .then((res) => res.text())
    .then((text) => {
      const data = {};

      text.split("\n").forEach((line) => {
        const [key, value] = line.split("\t");
        data[key] = value;
      });

      return data;
    });
}
