
import { clean } from '54358';

export function hotKeySerialize(key) {
  return clean(JSON.stringify(key));
}

export function hotKeyDeserialize(key) {
  return JSON.parse(clean(key, true));
}
