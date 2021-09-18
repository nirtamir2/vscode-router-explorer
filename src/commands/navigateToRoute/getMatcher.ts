import * as globby from "globby";
import { pathToRegexp } from "path-to-regexp";

enum MatcherType {
  Index = "Index",
  Fallback = "Fallback",
  Regular = "Regular",
}

// a[bbb]c -> [bbb]
const GLOBAL_BOX_REGEXP = /\[([\s\S])+]/g;

function getFileNameWithoutExtension(fileName: string) {
  return fileName.replace(/\.[\s\S]+$/, "");
}

function isIndexFile(fileName: string) {
  return getFileNameWithoutExtension(fileName).toLocaleLowerCase() === "index";
}

// [...fallbackRout]
function isFallbackRouteFile(fileName: string) {
  return getFileNameWithoutExtension(fileName).match(/^\[\.{3}([\s\S])+]$/);
}

function getIndexFileRegexp(file: globby.Entry) {
  const filePathWithoutName = file.path.replace(
    new RegExp(`[\/]?${getFileNameWithoutExtension(file.name)}[\/]?$`),
    ""
  );
  const regexp = pathToRegexp(filePathWithoutName.replace(GLOBAL_BOX_REGEXP, ":param"));
  return regexp;
}

function getFallbackRouterRegexp(file: globby.Entry) {
  const filePathWithoutName = file.path.replace(
    new RegExp(`[\/]?${getFileNameWithoutExtension(file.name)}[\/]?$`),
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
  const regexp = pathToRegexp(parameterizedPath, undefined);
  return regexp;
}

export function getMatcher(file: globby.Entry): {
  regexp: RegExp;
  type: MatcherType;
} {
  if (isIndexFile(file.name)) {
    return {
      type: MatcherType.Index,
      regexp: getIndexFileRegexp(file),
    };
  }
  if (isFallbackRouteFile(file.name)) {
    return {
      type: MatcherType.Fallback,
      regexp: getFallbackRouterRegexp(file),
    };
  }

  return {
    type: MatcherType.Regular,
    regexp: getRegularPathRegexp(file),
  };
}
