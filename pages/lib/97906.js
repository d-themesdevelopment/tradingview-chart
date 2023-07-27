import { observable } from "mobx";
// import { spawn } from "<path_to_spawn_module>";
import { readonly } from "<path_to_readonly_module>";
// import { clamp } from "<path_to_clamp_module>";

export function combine(e, t, ...args) {
  return combineWithFilteredUpdate(e, () => true, ...args);
}

export function combineWithFilteredUpdate(e, t, ...args) {
  const s = (...args) => e(...args.map((arg) => arg.value()));
  const r = new (observable())(s(...args));
  const update = () => {
    if (t(...args.map((arg) => arg.value()))) {
      r.setValue(s(...args));
    }
  };
  const spawnedArgs = args.map((arg) => arg.spawn());
  for (const arg of spawnedArgs) {
    arg.subscribe(update);
  }
  return readonly(r).spawn(() => {
    spawnedArgs.forEach((arg) => arg.destroy());
  });
}
