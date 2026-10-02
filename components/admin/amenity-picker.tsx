"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, X, Search } from "lucide-react";

interface AmenityPickerProps {
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
  inputClassName?: string;
  placeholder?: string;
}

export default function AmenityPicker({
  value = [],
  onChange,
  options = [],
  inputClassName = "",
  placeholder = "Search amenities...",
}: AmenityPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = useMemo(
    () => new Set(value.map((item) => item.toLowerCase())),
    [value]
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((option) => !selected.has(option.toLowerCase()))
      .filter((option) => !q || option.toLowerCase().includes(q))
      .slice(0, 30);
  }, [options, selected, query]);

  const trimmedQuery = query.trim();
  const exactMatch = options.find(
    (option) => option.toLowerCase() === trimmedQuery.toLowerCase()
  );
  const canCreateNew =
    trimmedQuery.length > 0 &&
    !exactMatch &&
    !selected.has(trimmedQuery.toLowerCase());

  function addAmenity(name: string) {
    const clean = name.trim();
    if (!clean) return;
    if (selected.has(clean.toLowerCase())) {
      setQuery("");
      setOpen(false);
      return;
    }
    onChange([...value, clean]);
    setQuery("");
    setOpen(false);
  }

  function removeAmenity(name: string) {
    onChange(value.filter((item) => item !== name));
  }

  function handleSelect(option: string) {
    addAmenity(option);
  }

  function handleCreateNew() {
    if (!canCreateNew) return;
    addAmenity(trimmedQuery);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (exactMatch) {
        addAmenity(exactMatch);
      } else if (suggestions[0]) {
        addAmenity(suggestions[0]);
      } else if (canCreateNew) {
        addAmenity(trimmedQuery);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function openMenu() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setOpen(true);
  }

  function scheduleClose() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    blurTimer.current = setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className="w-full space-y-3">
      {/* Search Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={openMenu}
            onBlur={scheduleClose}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 placeholder:text-slate-400 ${inputClassName}`}
          />
        </div>

        {/* Dropdown Suggestions Menu (Pure Light Mode - Solid White) */}
        {open && (trimmedQuery.length > 0 || suggestions.length > 0) && (
          <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 text-slate-900 shadow-xl transition-all">
            {suggestions.map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 cursor-pointer text-slate-800"
              >
                <span>{option}</span>
              </button>
            ))}

            {canCreateNew && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleCreateNew}
                className="flex w-full items-center gap-2 rounded-md border-t border-slate-100 px-3 py-2 text-left text-sm font-medium text-blue-600 transition-colors hover:bg-slate-100 cursor-pointer mt-1"
              >
                <Plus className="h-4 w-4" />
                Add &quot;{trimmedQuery}&quot;
              </button>
            )}

            {trimmedQuery.length === 0 && suggestions.length === 0 && (
              <p className="px-3 py-2.5 text-center text-xs text-slate-400">
                All available options are selected.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Selected Amenities Badges (Light Style) */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800"
            >
              <span>{amenity}</span>
              <button
                type="button"
                onClick={() => removeAmenity(amenity)}
                className="rounded-sm text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                aria-label={`Remove ${amenity}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}