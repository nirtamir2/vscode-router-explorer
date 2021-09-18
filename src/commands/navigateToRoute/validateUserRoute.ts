import { URL } from "url";

function isValidPath(url: string): boolean {
  const regex = /^((\w|\d)*\/(\w|\d)*)+$/;
  return url.match(regex) !== null;
}

function isValidHttpUrl(string: string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return (
    (url.protocol === "http:" || url.protocol === "https:") &&
    url.pathname.length > 0
  );
}

export function validateUserRoute(text: string): string | undefined {
  // if (isValidHttpUrl(text)) {
  //   return undefined;
  // }
  if (isValidPath(text)) {
    return undefined;
  }
  return "Invalid url";
}
