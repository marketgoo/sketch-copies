import sketch from "sketch";
import Settings from "sketch/settings";
import { get } from "./api.js";
import { alert, isValidName } from "./utils.js";
import replace from "./replace.js";

export default async function () {
  const data = await get();
  let copies = 0;
  let changes = 0;

  sketch.find("Text").forEach((layer) => {
    const id = layer.name;

    if (id in data) {
      ++copies;

      const result = replace(layer, data[id]);

      if (result === true) {
        ++changes;
      }
    }
  });

  sketch.find("SymbolInstance").forEach((layer) => {
    layer.overrides.forEach((override) => {
      if (override.property !== "stringValue") {
        return;
      }

      const settingsKey = `mktgoo.copyId.${override.path}`;
      const savedId = Settings.layerSettingForKey(layer, settingsKey);
      let id = savedId || layer.name;

      if (!override.isDefault && isValidName(id, data)) {
        ++copies;

        const result = replace(layer, data[id], false, true);

        if (typeof result === "string") {
          override.value = data[id];
          layer.resizeWithSmartLayout();
          ++changes;
        }
      }
    });
  });

  if (!copies) {
    alert("No copies found", "We didn't found any copy in your document");
  } else if (changes === 0) {
    alert(
      "No changes in your copies",
      `We have found ${copies} copies in your document, but none has changed recently`,
    );
  } else if (changes === 1) {
    alert(
      "Copies updated",
      `We have found ${copies} copies in your document, and ${changes} change was updated succesfully`,
    );
  } else {
    alert(
      "Copies updated",
      `We have found ${copies} copies in your document, and ${changes} changes were updated succesfully`,
    );
  }
}
