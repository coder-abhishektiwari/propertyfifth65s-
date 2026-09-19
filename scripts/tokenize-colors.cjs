const fs = require("fs");
const path = require("path");
const roots = ["app", "components", "lib"];
const exts = new Set([".tsx", ".ts"]);
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (exts.has(path.extname(e.name))) out.push(p);
  }
}
const R = (list) => list;
const repsA = [
  ["text-slate-300", "text-inverse-muted"],
  ["text-slate-950", "text-primary"],
  ["bg-slate-950/95", "bg-overlay-deep/95"],
  ["text-amber-400", "text-accent"],
  ["bg-amber-400", "bg-accent"],
  ["border-amber-500/30", "border-accent/30"],
  ["border-amber-500/20", "border-accent/20"],
  ["border-amber-400/50", "border-accent/50"],
  ["bg-amber-400/10", "bg-accent/10"],
  ["hover:bg-amber-400/10", "hover:bg-accent/10"],
  ["from-amber-500 to-amber-600", "from-accent to-accent-strong"],
  ["hover:from-amber-400 hover:to-amber-500", "hover:from-gold-light hover:to-accent"],
  ["from-amber-200 via-amber-400 to-amber-100", "from-gold-light via-accent to-gold-light"],
  ["shadow-amber-500/10", "shadow-accent/10"],
  ["text-amber-600", "text-warning"],
  ["bg-amber-50", "bg-warning-bg"],
  ["border-amber-200", "border-warning-border"],
  ["text-amber-700", "text-warning"],
  ["text-amber-900", "text-warning"],
  ["from-amber-50 to-orange-50", "from-warning-bg to-accent-soft"],
  ["text-slate-400", "text-inverse-faint"],
  ["hover:text-amber-400", "hover:text-accent"],
  ["bg-[#02070e]", "bg-overlay-deep"],
  ["text-white/80", "text-inverse/80"],
  ["text-white/60", "text-inverse-muted"],
  ["text-white/50", "text-inverse-muted"]
];
const repsB = R([]);
module.exports = { repsA, repsB, roots, exts, walk };
