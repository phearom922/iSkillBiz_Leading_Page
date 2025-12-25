interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full";

  const variantClasses = {
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300",
    secondary: "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300",
    success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

