
let unsavedCount = 0;

export function setUnsavedCount(n: number) {
  unsavedCount = n;
}

export function hasUnsaved(): boolean {
  return unsavedCount > 0;
}
