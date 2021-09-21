import * as globby from "globby";
import { MatcherType } from "../MatcherType";
import { getNextMatcher } from "./nextMatcher";
import { getNuxtMatcher, isVueFile } from "./nuxtMatcher";
import * as vscode from "vscode";

function shouldUseNuxtStyleInVueFiles() {
  return (
    vscode.workspace
      .getConfiguration("router-explorer")
      .get<string>("search.routes.vue.style") === "nuxt"
  );
}

export function getMatcher(file: globby.Entry): {
  regexp: RegExp;
  type: MatcherType;
} {
  if (isVueFile(file.name) && shouldUseNuxtStyleInVueFiles()) {
    return getNuxtMatcher(file);
  }
  return getNextMatcher(file);
}
