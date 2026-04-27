import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PeriodKey, PERIOD_LABELS } from "@/lib/pdf-export";
import { CalendarRange } from "lucide-react";

interface Props {
  value: PeriodKey;
  onChange: (v: PeriodKey) => void;
}

export function PeriodFilter({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as PeriodKey)}>
      <SelectTrigger className="h-9 w-[200px] gap-2">
        <CalendarRange className="h-4 w-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(PERIOD_LABELS) as PeriodKey[]).map((k) => (
          <SelectItem key={k} value={k}>
            {PERIOD_LABELS[k]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
