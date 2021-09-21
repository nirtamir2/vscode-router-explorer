import * as globby from "globby";
import { pathToRegexp } from "path-to-regexp";
import { MatcherType } from "../MatcherType";
import { FileUtils } from "./FileUtils";

const SLASH_SEPARATOR = "/";

function normalizeDynamicRoutes(filePathWithoutName: string) {
  return filePathWithoutName
    .split(SLASH_SEPARATOR)
    .map((pathPart) => pathPart.replace(/^_/, ":"))
    .join(SLASH_SEPARATOR);
}

function getFallbackRouterRegexp(file: globby.Entry) {
  const filePathWithoutName = file.path.replace(/\/?_$/, "");
  const parameterizedPath = normalizeDynamicRoutes(filePathWithoutName);

  return pathToRegexp(parameterizedPath, undefined, { end: false });
}

function getIndexFileRegexp(file: globby.Entry) {
  const filePathWithoutIndex = file.path.replace(/\/?index$/, "");
  const parameterizedPath = normalizeDynamicRoutes(filePathWithoutIndex);
  return pathToRegexp(parameterizedPath, undefined);
}

function getPathRegexp(file: globby.Entry) {
  const parameterizedPath = normalizeDynamicRoutes(
    FileUtils.getNameWithoutExtension(file.path)
  );
  return pathToRegexp(parameterizedPath, undefined);
}

export function isVueFile(fileName: string) {
  return FileUtils.getExtension(fileName) === "vue";
}

export function getNuxtMatcher(file: globby.Entry) {
  if (FileUtils.isIndex(file.name)) {
    return {
      type: MatcherType.Index,
      regexp: getIndexFileRegexp(file),
    };
  }
  if (file.name === "_.vue") {
    return {
      type: MatcherType.Fallback,
      regexp: getFallbackRouterRegexp(file),
    };
  }
  return {
    type: MatcherType.Regular,
    regexp: getPathRegexp(file),
  };
}
