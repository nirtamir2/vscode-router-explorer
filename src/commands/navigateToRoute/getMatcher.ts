import * as globby from "globby";
import { pathToRegexp } from "path-to-regexp";

// a[bbb]c -> [bbb]
const GLOBAL_BOX_REGEXP = /\[([\d\w])+]/g;

function getFileNameWithoutExtension(fileName: string) {
  return fileName.split(".").pop() ?? "";
}

function isIndexFile(fileName: string) {
  return getFileNameWithoutExtension(fileName).toLocaleLowerCase() === "index";
}

// [...fallbackRout]
function isFallbackRouteFile(fileName: string) {
  return getFileNameWithoutExtension(fileName).match(/^\[\.{3}([\d\w])+]$/);
}

function getIndexFileRegexp(file: globby.Entry) {
  const filePathWithoutName = file.path.replace(
    new RegExp(`/${file.name}\$`),
    ""
  );
  return pathToRegexp(filePathWithoutName.replace(GLOBAL_BOX_REGEXP, ":param"));
}

function getFallbackRouterRegexp(file: globby.Entry) {
  const filePathWithoutName = file.path.replace(
    new RegExp(`/${file.name}\$`),
    ""
  );

  return pathToRegexp(
    filePathWithoutName.replace(GLOBAL_BOX_REGEXP, ":param"),
    undefined,
    { end: false }
  );
}

function getRegularPathRegexp(file: globby.Entry) {

  const parameterizedPath = file.path.replace(GLOBAL_BOX_REGEXP, ":param");
  const regexp = pathToRegexp(parameterizedPath, undefined)
  return regexp
}

export function getMatcher(file: globby.Entry): { regexp: RegExp; type: string } {
  if (isIndexFile(file.name)) {
    return {
      type: "index",
      regexp: getIndexFileRegexp(file),
    };
  }
  if (isFallbackRouteFile(file.name)) {
    return {
      type: "fallback",
      regexp: getFallbackRouterRegexp(file),
    };
  }

  return {
    type: "regular",
    regexp: getRegularPathRegexp(file),
  };
}
