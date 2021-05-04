import sketch from "sketch";
import Settings from "sketch/settings";
import { prompt } from "./utils.js";

const document = sketch.getSelectedDocument();

/**
 * @returns true If the replace is done
 * @returns false If copy does'n exist
 * @returns null If there's no changes in the copy
 * @returns string If the change must be done manually
 */
export default function replace(
  layer,
  copy,
  multiFormat = true,
  returnPlainCopy = false,
) {
  if (!copy) {
    return false;
  }

  // Replace variables
  copy = copy.replaceAll(/\{\{([^\}]+)\}\}/g, (string, key) => {
    let variable = Settings.layerSettingForKey(layer, `mktgoo.variable.${key}`);

    if (!variable) {
      variable = prompt(`What's the value of "${string}"?: \n\n${copy}`);

      if (variable) {
        Settings.setLayerSettingForKey(
          layer,
          `mktgoo.variable.${key}`,
          variable,
        );
      }
    }

    return variable ? variable : string;
  });

  //Multiple format
  if (multiFormat && /<[^>]+>/.test(copy)) {
    document.selectedLayers = [layer];
    makeReplace(layer, copy);
    return true;
  }

  //Strip HTML tags
  copy = copy.replaceAll(/<[^>]+>/g, "");

  if (returnPlainCopy) {
    return copy;
  }

  layer.text = copy;
  return true;
}

function makeReplace(layer, copy) {
  const replacements = getReplacement(layer, copy);
  document.sketchObject.actionsController().actionForID("MSEditAction")
    .performAction(nil);
  const textView = layer.sketchObject.editingDelegate().textView();

  replacements.forEach((replace) => {
    const [copy, location, length] = replace;
    textView.setSelectedRange(NSMakeRange(location, length));
    textView.insertText(copy);
  });

  document.sketchObject.actionsController().actionForID("MSEditAction")
    .performAction(nil);
}

function getReplacement(layer, copy) {
  const ranges = getRanges(layer);
  const copies = getCopyPieces(copy);

  if (ranges.length < copies.length) {
    const index = Math.max(0, ranges.length - 1);
    const last = copies.splice(index).join("");
    copies.push(last);
  } else if (ranges.length > copies.length) {
    for (let i = ranges.length - copies.length; i > 0; i--) {
      copies.push("");
    }
  }

  ranges.reverse();
  copies.reverse();

  return ranges.map((value, index) => [copies[index], ...value]);
}

function getRanges(layer) {
  const attrStr = layer.sketchObject.attributedStringValue();
  const effectiveRange = MOPointer.alloc().init();
  let limitRange = NSMakeRange(0, attrStr.length());
  let ranges = [];

  while (limitRange.length > 0) {
    attrStr.attributesAtIndex_longestEffectiveRange_inRange(
      limitRange.location,
      effectiveRange,
      limitRange,
    );

    ranges.push([
      effectiveRange.value().location,
      effectiveRange.value().length,
    ]);

    limitRange = NSMakeRange(
      NSMaxRange(effectiveRange.value()),
      NSMaxRange(limitRange) - NSMaxRange(effectiveRange.value()),
    );
  }

  return ranges;
}

function getCopyPieces(copy) {
  const ranges = copy.split(/<[^>]+>/).filter((value) => value !== "");
  return ranges;
}
