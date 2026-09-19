const { roots, walk } = require("./tokenize-colors.cjs");
const fs = require("fs");
const reps = [
  ["bg-[var(--navy)]", "bg-primary"],
  ["text-[var(--navy)]", "text-primary"],
  ["hover:text-[var(--navy)]", "hover:text-primary"],
  ["border-[var(--navy)]", "border-primary"],
  ["from-[var(--navy)]", "from-primary"],
  ["via-[var(--navy)]", "via-primary"],
  ["to-[var(--navy)]", "to-primary"],
  ["bg-[var(--gold)]", "bg-accent"],
  ["text-[var(--gold)]", "text-accent"],
  ["hover:text-[var(--gold)]", "hover:text-accent"],
  ["hover:border-[var(--gold)]", "hover:border-accent"],
  ["border-[var(--gold)]", "border-accent"],
  ["focus:border-[var(--gold)]", "focus:border-accent"],
  ["focus:ring-[var(--gold)]", "focus:ring-accent"],
  ["bg-[var(--bg-muted)]", "bg-muted"],
  ["bg-[var(--bg)]", "bg-background"],
  ["text-[var(--text-muted)]", "text-muted-foreground"],
  ["text-[var(--text-light)]", "text-muted-foreground"],
  ["placeholder:text-[var(--text-light)]", "placeholder:text-muted-foreground"],
  ["text-[var(--text)]", "text-foreground"],
  ["border-[var(--border-light)]", "border-border-light"],
  ["border-[var(--border)]", "border-border"],
  ["text-[var(--gold-dark)]", "text-accent-strong"]
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
console.log("DONE5 changed=" + changed);
