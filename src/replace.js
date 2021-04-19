const sketch = require("sketch");
const document = sketch.getSelectedDocument();

export function replace(layer, copy) {
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

export function isHtml(copy) {
  return /<[^>]+>/.test(copy);
}

function getReplacement(layer, copy) {
  const ranges = getRanges(layer);
  const copies = getCopyPieces(copy);

  if (ranges.length < copies.length) {
    const index = ranges.length - 2;
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
