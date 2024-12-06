import Link from 'next/link';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@repo/ui/lib/utils';
interface ButtonProps extends VariantProps<typeof buttonClasses> {
  children: React.ReactNode;
  href: string;
}

const buttonClasses = cva('rounded-full inline-flex items-center', {
  variants: {
    variant: {
      primary:
        'bg-primary-gradient text-white hover:text-shadow hover:shadow-primary',
      secondary:
        'bg-white text-off-white bg-opacity-10 border border-transparent-white backdrop-filter-[12px] hover:bg-opacity-20 transition-colors ease-in',
      tertiary: 'bg-gray-500 text-white ',
    },
    size: {
      small: 'text-xs px-3 h-7',
      medium: 'text-sm px-4 h-8',
      large: 'text-md px-6 h-8',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export const IconWrapper = ({
  children,
  className,
}: {
  children: any;
  className: string;
}) => {
  return <span className={cn(className,"bg-transparent-white rounded-full p-1")}>{children}</span>;
};

const Button = ({ children, href, variant, size,className }: ButtonProps) => {
  return (
    <Link className={cn(buttonClasses({ variant, size }),className)} href={href}>
      {children}
    </Link>
  );
};

export default Button;
