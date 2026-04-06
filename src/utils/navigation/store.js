const state = {};
const listeners = {};

export function set(key, value) {
  state[key] = value;
  (listeners[key] || []).forEach((fn) => fn(value));
}

export function get(key) {
  return state[key];
}

export function subscribe(key, fn) {
  listeners[key] = listeners[key] || [];
  listeners[key].push(fn);
}