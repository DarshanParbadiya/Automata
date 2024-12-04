import { cn } from '../lib/utils';
interface Props {
  children: React.ReactNode;
  className?: string;
}
export const Container = ({ children, className }: Props) => {
  return (
    <div className={cn('max-w-[120rem] mx-auto px-8', className)}>{children}</div>
  );
};
