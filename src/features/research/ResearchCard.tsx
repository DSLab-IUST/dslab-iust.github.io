import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { useLocalized } from '@/hooks/useLocalized';
import type { ResearchArea } from '@/types/content';

interface ResearchCardProps {
  area: ResearchArea;
  index?: number;
}

export function ResearchCard({ area, index = 0 }: ResearchCardProps) {
  const localized = useLocalized();

  return (
    <Reveal index={index} className="h-full">
      <Card interactive className="h-full min-h-[255px]">
        <span className="text-[22px] leading-none" aria-hidden="true">
          {area.glyph}
        </span>

        <h3 className="text-h4 mt-5 [overflow-wrap:anywhere]">{localized(area.title)}</h3>

        <p className="text-text-muted text-body-sm mt-3">{localized(area.summary)}</p>

        <div className="cluster-xs mt-auto pt-6">
          {area.tags.map((tag) => (
            <Badge key={tag} size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </Reveal>
  );
}
