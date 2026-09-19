const { roots, exts, walk } = require("./tokenize-colors.cjs");
const fs = require("fs");
const reps = [
  ["text-gray-200", "text-border"],
  ["bg-gray-200", "bg-border"],
  ["border-gray-50", "border-border-light"],
  ["text-green-800", "text-success"],
  ["bg-orange-500", "bg-warning"],
  ["bg-orange-50", "bg-warning-bg"],
  ["text-orange-700", "text-warning"],
  ["border-orange-200", "border-warning-border"],
  ["border-purple-200", "border-violet-border"],
  ["bg-red-600", "bg-destructive"],
  ["hover:bg-red-700", "hover:bg-destructive"],
  ["hover:bg-red-100", "hover:bg-destructive-bg"],
  ["bg-success-bg0", "bg-success"],
  ["bg-[#06101E]", "bg-navy-dark"],
  ["via-[#f3e0aa]", "via-gold-light"],
  ["bg-[#F8FAFC]", "bg-muted"],
  ["border-white/5", "border-inverse/5"],
  ["border-white/10", "border-inverse/10"],
  ["border-white/15", "border-inverse/15"],
  ["border-white/20", "border-inverse/20"]
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
console.log("DONE4 changed=" + changed);
