import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
}

const buttonClass = ({ variant = 'secondary', size = 'md', iconOnly, className }: StyleProps) =>
  cn('btn', VARIANT_CLASS[variant], SIZE_CLASS[size], iconOnly && 'btn-icon', className);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleProps {
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant,
  size,
  iconOnly,
  className,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonClass({ variant, size, iconOnly, className })}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends StyleProps {
  to: string;
  children: ReactNode;
  /** External destinations open in a new tab with the usual opener guard. */
  external?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export function ButtonLink({
  to,
  external = false,
  variant,
  size,
  iconOnly,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClass({ variant, size, iconOnly, className });

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer noopener" className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} preventScrollReset={to.includes('#')} className={classes} {...props}>
      {children}
    </Link>
  );
}
