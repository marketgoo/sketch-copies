import sketch from "sketch";
import Settings from "sketch/settings";
import util from "util";
import { get } from "./api.js";
import { alert, isValidName, notify, prompt } from "./utils.js";
import { isHtml, replace } from "./replace.js";

const { DataSupplier } = sketch;

export function onStartup() {
  DataSupplier.registerDataSupplier(
    "public.json",
    "mktgoo Copies",
    "SupplyData",
  );
  DataSupplier.registerDataSupplier(
    "public.text",
    "mktgoo Copy",
    "SupplySingleData",
  );
}

export function onShutdown() {
  DataSupplier.deregisterDataSuppliers();
}

export async function onSupplyData(context) {
  let dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  const data = await get();

  items.forEach((item, index) => {
    DataSupplier.supplyDataAtIndex(dataKey, data, index);
  });
}

export async function onSupplySingleData(context) {
  let dataKey = context.data.key;
  const items = util.toArray(context.data.items).map(sketch.fromNative);
  const data = await get();

  items.forEach((item, index) => {
    if (item.type === "Text") {
      const id = item.name;

      if (id in data) {
        if (item.text !== data[id]) {
          if (isHtml(data[id])) {
            replace(item, data[id]);
          } else {
            DataSupplier.supplyDataAtIndex(dataKey, data[id], index);
          }
        } else {
          notify("There's no copy changes for this layer");
        }
        item.name = id;
        return;
      }

      const newId = prompt(
        `The copy with id "${id}" was not found in the database. Add a new id`,
      );

      if (newId in data) {
        if (item.text !== data[newId]) {
          DataSupplier.supplyDataAtIndex(dataKey, data[newId], index);
        } else {
          notify("There's no copy changes for this layer");
        }
        item.name = newId;
        return;
      }

      return alert("Error", `The copy "${newId}" does not exist`);
    }

    if (item.type === "DataOverride") {
      const { symbolInstance: layer, override } = item;
      const settingsKey = `mktgoo.copyId.${override.path}`;
      const savedId = Settings.layerSettingForKey(layer, settingsKey);
      let id = savedId || layer.name;

      if (override.isDefault || !isValidName(id, data)) {
        id = prompt("What's the id for this copy?");

        if (!id) {
          return;
        }

        if (!isValidName(id, data)) {
          return alert("Error", `The copy "${id}" does not exist`);
        }

        Settings.setLayerSettingForKey(layer, settingsKey, id);
      }

      DataSupplier.supplyDataAtIndex(dataKey, data[id], index);
    }
  });
}
