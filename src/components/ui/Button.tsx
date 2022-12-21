import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

type Props = {
  text: string;
  Icon?: React.ElementType;
} & VariantProps<typeof buttonStyles> &
  React.ComponentProps<"button">;

const buttonStyles = cva(
  [
    "inline-flex items-center border border-transparent font-medium shadow-sm",
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  ],
  {
    variants: {
      intent: {
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray600",
        secondary: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
        danger: "bg-red-100 text-red-700 hover:bg-red-200",
      },
      size: {
        small: "rounded px-2.5 py-1.5 text-xs",
        medium: "rounded-md px-4 py-2 text-sm",
        large: "rounded-md px-6 py-3 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  }
);

export default function Button({
  text,
  Icon,
  intent,
  size,
  fullWidth,
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={buttonStyles({ intent, size, fullWidth, className })}
    >
      {Icon && <Icon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />}
      {text}
    </button>
  );
}
