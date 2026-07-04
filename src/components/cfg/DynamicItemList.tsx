import { useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import type { CfgEntry } from "@/lib/types";
import { useVirtualizer } from "@tanstack/react-virtual";

export function DynamicItemList({
  entries,
  values,
  onChange,
  q = "",
}: {
  entries: CfgEntry[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  q?: string;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) => !q || e.key.toLowerCase().includes(q.toLowerCase()),
      ),
    [entries, q],
  );

  const v = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 12,
  });

  return (
    <div
      ref={parentRef}
      className="h-[420px] overflow-y-auto rounded-lg border border-border"
    >
      <div style={{ height: v.getTotalSize(), position: "relative" }}>
        {v.getVirtualItems().map((vi) => {
          const e = filtered[vi.index];
          const val = values[e.key] ?? e.value;
          const changed = values[e.key] !== undefined && values[e.key] !== e.value;
          return (
            <div
              key={e.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vi.start}px)`,
                height: vi.size,
              }}
              className="flex items-center gap-3 border-b border-border px-3 transition-colors hover:bg-accent/50"
            >
              <span
                className="flex-1 truncate text-sm tabular-nums"
                title={e.key}
              >
                {e.key}
                {changed && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
                )}
              </span>
              <Input
                type="number"
                value={val}
                onChange={(ev) => onChange(e.key, ev.target.value)}
                onBlur={() => {
                  if (val.trim() === "" || Number.isNaN(Number(val)))
                    onChange(e.key, e.value);
                }}
                className="w-28 tabular-nums"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
