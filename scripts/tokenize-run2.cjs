const { roots, exts, walk } = require("./tokenize-colors.cjs");
const fs = require("fs");
const reps = [
  ["text-orange-700 bg-orange-50 border-orange-200", "text-warning bg-warning-bg border-warning-border"],
  ["border-white/30 border-t-white", "border-inverse/30 border-t-inverse"],
  ["border-t-white", "border-t-inverse"],
  ["text-gray-400", "text-muted-foreground"],
  ["text-gray-300", "text-muted-foreground"],
  ["hover:text-gray-600", "hover:text-foreground"],
  ["hover:bg-gray-50", "hover:bg-muted"],
  ["hover:bg-gray-100", "hover:bg-secondary"],
  ["text-green-700 bg-green-50 border-green-200", "text-success bg-success-bg border-success-border"],
  ["bg-green-100", "bg-success-bg"],
  ["bg-green-50", "bg-success-bg"],
  ["border-green-200", "border-success-border"],
  ["text-green-700", "text-success"],
  ["text-green-600", "text-success"],
  ["hover:text-green-700", "hover:text-success"],
  ["bg-emerald-600 text-white", "bg-success text-inverse"],
  ["text-emerald-700 bg-emerald-50 border-emerald-200", "text-success bg-success-bg border-success-border"],
  ["text-emerald-500", "text-success"],
  ["text-blue-800 bg-blue-50 border-blue-200", "text-info bg-info-bg border-info-border"],
  ["text-blue-700 bg-blue-50 border-blue-200", "text-info bg-info-bg border-info-border"],
  ["bg-blue-50", "bg-info-bg"],
  ["border-blue-200", "border-info-border"],
  ["text-blue-700", "text-info"],
  ["text-blue-600", "text-info"],
  ["text-sky-700 bg-sky-50 border-sky-200", "text-info bg-info-bg border-info-border"],
  ["text-purple-700 bg-purple-50 border-purple-200", "text-violet bg-violet-bg border-violet-border"],
  ["bg-purple-50", "bg-violet-bg"],
  ["text-purple-700", "text-violet"],
  ["text-rose-700 bg-rose-50 border-rose-200", "text-destructive bg-destructive-bg border-destructive-border"],
  ["text-red-800", "text-destructive"],
  ["text-red-700", "text-destructive"],
  ["text-red-600", "text-destructive"],
  ["text-red-500", "text-destructive"],
  ["text-red-400", "text-destructive"],
  ["text-red-300", "text-destructive"],
  ["hover:text-red-800", "hover:text-destructive"],
  ["hover:text-red-300", "hover:text-destructive"],
  ["hover:border-red-300", "hover:border-destructive-border"],
  ["border-red-300", "border-destructive-border"],
  ["bg-red-600 text-white", "bg-destructive text-inverse"],
  ["bg-red-50", "bg-destructive-bg"],
  ["border-red-200", "border-destructive-border"],
  ["hover:bg-red-500/10", "hover:bg-destructive/10"],
  ["border-red-500", "border-destructive"]
];
const files = [];
for (const r of roots) walk(r, files);
let changed = 0;
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  for (const pair of reps) s = s.split(pair[0]).join(pair[1]);
  if (s !== before) { fs.writeFileSync(f, s); changed++; console.log("UPDATED " + f); }
}
console.log("DONE2 changed=" + changed);
