const { roots, exts, walk } = require("./tokenize-colors.cjs");
const fs = require("fs");
const reps = [
  ["text-[#a27d38]", "text-accent-strong"],
  ["text-[#d2b16d]", "text-gold-light"],
  ["text-[#17202a]", "text-primary"],
  ["text-[#1d2935]", "text-primary"],
  ["text-[#59636d]", "text-muted-foreground"],
  ["text-[#b9c0c7]", "text-inverse-muted"],
  ["text-[#bfc6cc]", "text-inverse-muted"],
  ["bg-[#091c35]", "bg-navy"],
  ["bg-[#0a1628]", "bg-navy-deep"],
  ["text-[#0a1628]", "text-navy-deep"],
  ["focus:ring-[#0a1628]", "focus:ring-navy-deep"],
  ["focus:border-[#0a1628]", "focus:border-navy-deep"],
  ["bg-[#0f1f3a]", "bg-navy-light"],
  ["bg-[#f7f5f0]", "bg-accent-soft"],
  ["border-[#c8a45d]", "border-gold-light"],
  ["border-[#c8963e]", "border-accent"],
  ["bg-[#c8963e]", "bg-accent"],
  ["peer-checked:bg-[#c8963e]", "peer-checked:bg-accent"],
  ["peer-checked:border-[#c8963e]", "peer-checked:border-accent"],
  ["text-[#06101E]", "text-navy-dark"],
  ["from-[#06101E]/80", "from-navy-dark/80"],
  ["bg-black/40", "bg-scrim-soft"],
  ["bg-black/50", "bg-scrim"],
  ["text-white", "text-inverse"],
  ["bg-white", "bg-card"],
  ["border-white/14", "border-inverse/15"],
  ["bg-[#0a1628]/0", "bg-navy-deep/0"]
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
console.log("DONE3 changed=" + changed);
