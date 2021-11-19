export function isValidNormalizedRoute(url: string): boolean {
  return url.match(/^(([\w\d-_])*\/?([\w\d-_])*)+$/) !== null;
}