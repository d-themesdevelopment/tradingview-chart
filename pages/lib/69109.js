export let handleMuteLinkingGroup = null;

export function muteLinkingGroup(e, t) {
  if (handleMuteLinkingGroup !== null) {
    handleMuteLinkingGroup(e, t);
  }
}

export function setMuteLinkingGroup(handle) {
  handleMuteLinkingGroup = handle;
}