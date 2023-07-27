
import { clean } from './54358.js';

export function hotKeySerialize(key) {
  return clean(JSON.stringify(key));
}

export function hotKeyDeserialize(key) {
  return JSON.parse(clean(key, true));
}
