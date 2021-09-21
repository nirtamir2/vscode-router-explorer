export function isValidNormalizedRoute(url: string): boolean {
  return url.match(/^((\w|\d)*\/?(\w|\d)*)+$/) !== null;
}
