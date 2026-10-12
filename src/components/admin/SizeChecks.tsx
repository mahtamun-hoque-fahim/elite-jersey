import { ALL_SIZES } from "@/data/jerseys";

/** Native checkboxes styled as pills. Submits as repeated `sizes` fields. */
export function SizeChecks({ selected = ALL_SIZES, name = "sizes" }: { selected?: string[]; name?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_SIZES.map((s) => (
        <label key={s} className="cursor-pointer">
          <input type="checkbox" name={name} value={s} defaultChecked={selected.includes(s)} className="peer sr-only" />
          <span className="grid h-9 min-w-11 place-items-center rounded-full border border-line px-3 text-sm font-medium transition-colors peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40">
            {s}
          </span>
        </label>
      ))}
    </div>
  );
}
