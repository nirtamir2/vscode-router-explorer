import * as globby from "globby";
import { MatcherType } from "../MatcherType";
import { getNextMatcher } from "./nextMatcher";
import { getNuxtMatcher, isVueFile } from "./nuxtMatcher";

export function getMatcher(file: globby.Entry): {
  regexp: RegExp;
  type: MatcherType;
} {
  if (isVueFile(file.name)) {
    return getNuxtMatcher(file);
  }
  return getNextMatcher(file);
}
