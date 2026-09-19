const { roots, walk } = require("./tokenize-colors.cjs");
const fs = require("fs");
const reps = [
  ["from-[var(--gold)]/30", "from-accent/30"],
  ["from-[var(--gold)]", "from-accent"],
  ["to-[var(--gold)]", "to-accent"],
  ["border-t-[var(--gold)]", "border-t-accent"],
  ["hover:bg-[var(--navy-light)]", "hover:bg-navy-light"],
  ["shadow-[0_15px_45px_rgba(0,0,0,0.07)]", "shadow-lg"]
];
const files = [];
for (const r of roots) walk(r, files);
let changed = 0;
for (const f of files) {
  if (f.indexOf("scripts/") !== -1) continue;
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  for (const pair of reps) s = s.split(pair[0]).join(pair[1]);
  if (s !== before) { fs.writeFileSync(f, s); changed++; console.log("UPDATED " + f); }
}
console.log("DONE6 changed=" + changed);
