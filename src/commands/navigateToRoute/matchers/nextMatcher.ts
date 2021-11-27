import * as globby from "globby";
import { pathToRegexp } from "path-to-regexp";
import { MatcherType } from "../MatcherType";
import { FileUtils } from "./FileUtils";

// a[bbb]c -> [bbb]
const GLOBAL_BOX_REGEXP = /\[([\s\S])+]/g;

function getIndexFileRegexp(file: globby.Entry) {
  const filePathWithoutName = file.path.replace(
    new RegExp(`[\/]?${FileUtils.getNameWithoutExtension(file.name)}[\/]?$`),
    ""
  );
  return pathToRegexp(filePathWithoutName.replace(GLOBAL_BOX_REGEXP, ":param"));
}

function getFallbackRouterRegexp(file: globby.Entry) {
  const filePathWithoutName = file.path.replace(
    new RegExp(`[\/]?${FileUtils.getNameWithoutExtension(file.name)}[\/]?$`),
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
  return pathToRegexp(parameterizedPath, undefined);
}

// [...fallbackRout]
function isFallbackRouteFile(fileName: string) {
  return FileUtils.getNameWithoutExtension(fileName).match(
    /^\[\.{3}([\s\S])+]$/
  );
}

export function getNextMatcher(file: globby.Entry) {
  if (file)
    if (FileUtils.isIndex(file.name)) {
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
