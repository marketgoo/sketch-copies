import UI from "sketch/ui";

export function prompt(question, initialValue) {
  let value = initialValue;

  UI.getInputFromUser(
    question,
    {
      type: UI.INPUT_TYPE.string,
      initialValue: initialValue,
    },
    (err, response) => {
      if (err) {
        throw new Error(err);
      }
      value = response;
    },
  );

  return value;
}

export function alert(title, message) {
  UI.alert(title, message);
}

export function notify(message) {
  UI.message(message);
}

const validName = /^[\w\.-]+$/;

export function isValidName(name, data) {
  if (!name || !validName.test(name)) {
    return false;
  }

  if (data && !(name in data)) {
    return false;
  }

  return true;
}

export function copyString(str = "") {
  const pasteboard = NSPasteboard.generalPasteboard();
  pasteboard.declareTypes_owner([NSPasteboardTypeString], null);
  pasteboard.setString_forType(str, NSPasteboardTypeString);
}
