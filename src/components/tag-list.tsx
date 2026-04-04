import { Badge } from "@/components/ui/badge";

export function TagList({
  tags,
  limit,
}: {
  tags: string[];
  limit?: number;
}) {
  const visible = limit ? tags.slice(0, limit) : tags;
  const remaining = limit ? tags.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="text-[10px] font-normal text-muted-foreground"
        >
          {tag}
        </Badge>
      ))}
      {remaining > 0 && (
        <span className="text-[10px] text-muted-foreground">
          +{remaining}
        </span>
      )}
    </div>
  );
}
