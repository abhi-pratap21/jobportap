import { initials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'h-10 w-10 text-sm rounded-xl',
  md: 'h-12 w-12 text-base rounded-xl',
  lg: 'h-16 w-16 text-xl rounded-2xl',
};

export default function CompanyLogo({ name, color, size = 'md', className }: Props) {
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center font-bold text-white shadow-sm', sizes[size], className)}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
