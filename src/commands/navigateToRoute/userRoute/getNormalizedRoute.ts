import { URL } from "url";

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

function getWithoutLeadingAndTrailingSlash(text: string) {
  let result = text;
  if (text.startsWith("/")) {
    result = result.substring(1);
  }
  if (text.endsWith("/")) {
    result = result.substring(0, result.length - 1);
  }
  return result;
}

function isHttpOrHttpsProtocol(userRoute: string) {
  return userRoute.startsWith("http://") || userRoute.startsWith("https://");
}

export function getNormalizedRoute(userRoute: string) {
  const decodedRoute = decodeURI(userRoute);

  if (isHttpOrHttpsProtocol(decodedRoute) && isValidHttpUrl(decodedRoute)) {
    const pathname = new URL(decodedRoute).pathname;
    return getWithoutLeadingAndTrailingSlash(pathname);
  }

  return getWithoutLeadingAndTrailingSlash(decodedRoute);
}
