import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-150 select-none rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[44px] px-4 py-2.5 text-sm gap-2', // Standard 44px min tap target
    lg: 'min-h-[48px] px-6 py-3.5 text-base gap-2.5 font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-accent-primary text-white hover:bg-accent-primary-hover shadow-sm hover:shadow active:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-slate-950',
    secondary:
      'bg-card-subtle text-content-primary hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-border-subtle',
    outline:
      'bg-transparent border border-border-strong text-content-primary hover:bg-card-subtle',
    ghost:
      'bg-transparent text-content-secondary hover:text-content-primary hover:bg-card-subtle',
    danger:
      'bg-severity-severe text-white hover:bg-red-600 shadow-sm active:bg-red-700',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
