import sketch from "sketch";
import { get } from "./api.js";
import { alert, copyString, isValidName } from "./utils.js";

export default async function () {
  const texts = new Map();
  const data = await get();

  sketch.find("Text").forEach((layer) => {
    if (!layer.hidden && isValidName(layer.name) && !(layer.name in data)) {
      texts.set(layer.name, layer.text);
    }
  });

  // sketch.find("SymbolInstance").forEach((layer) => {
  //     if (layer.hidden && !isValidName(layer.name) && (layer.name in data)) {
  //         return;
  //     }

  //     layer.overrides.forEach((override) => {
  //         if (isValidOverride(override)) {
  //             const subLayer = override.affectedLayer;

  //             if (isValidLayer(layer)) {
  //                 const name = `${layer.name}.${subLayer.name}`;
  //                 texts.set(name, override.value);
  //             }
  //         }
  //     })
  // })

  const csv = [];

  for (const [id, copy] of texts) {
    csv.push(`"${id}"\t"${copy}"`);
  }

  copyString(csv.join("\n"));
  alert("New texts copied!", "The new copies are in your clipboard");
}

function isValidOverride(override) {
  return override.property === "stringValue" && override.editable;
}
