const { repsA, roots, exts, walk } = require("./tokenize-colors.cjs");
const fs = require("fs");
const path = require("path");
const reps = repsA.concat([
  ["text-white/40", "text-inverse-faint"],
  ["hover:text-white", "hover:text-inverse"],
  ["hover:bg-white/5", "hover:bg-inverse/5"],
  ["hover:bg-white/10", "hover:bg-inverse/10"],
  ["bg-white/5", "bg-inverse/5"],
  ["bg-white/[0.02]", "bg-inverse/[0.02]"],
  ["bg-white/[0.03]", "bg-inverse/[0.03]"],
  ["hover:bg-white/[0.05]", "hover:bg-inverse/[0.05]"],
  ["bg-gray-50/50", "bg-muted/50"],
  ["bg-gray-50", "bg-muted"],
  ["bg-gray-100", "bg-secondary"],
  ["border-gray-100", "border-border-light"],
  ["border-gray-200", "border-border"],
  ["border-gray-300", "border-border-strong"],
  ["text-gray-900", "text-foreground"],
  ["text-gray-800", "text-foreground"],
  ["text-gray-700", "text-foreground"],
  ["text-gray-600", "text-muted-foreground"],
  ["text-gray-500", "text-muted-foreground"]
]);
const files = [];
for (const r of roots) walk(r, files);
let changed = 0;
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  for (const pair of reps) s = s.split(pair[0]).join(pair[1]);
  if (s !== before) { fs.writeFileSync(f, s); changed++; console.log("UPDATED " + f); }
}
console.log("DONE1 changed=" + changed);
