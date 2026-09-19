import { ImageOff } from "lucide-react";

export default function PropertyPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-card flex items-center justify-center select-none overflow-hidden ${className}`}
    >
      <ImageOff className="w-6 h-6 sm:w-8 sm:h-8 text-accent/30" />
    </div>
  );
}