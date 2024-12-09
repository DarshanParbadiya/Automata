import { cn } from '@repo/ui/lib/utils';
interface HeroProps {
  children: any;
  className?: string;
}

interface HeroElementProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroTitle = ({ children, className }: HeroElementProps) => {
  return (
    <h1 className={cn('text-5xl md:text-7xl my-6 text-gradient', className)}>
      {children}
    </h1>
  );
};

export const HeroSubTitle = ({ children, className }: HeroElementProps) => {
  return (
    <p className={cn('text-lg mb-12 text-primary-text', className)}>
      {children}
    </p>
  );
};

const Hero = ({ children, className }: HeroProps) => {
  return <div className={cn('text-center', className)}>{children}</div>;
};

export default Hero;
