import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
  text: string;
  Icon?: React.ElementType;
} & VariantProps<typeof buttonStyles> &
  React.ComponentProps<"button">;

const buttonStyles = cva(
  [
    "inline-flex items-center border border-transparent font-medium shadow-sm disabled:shadow-none",
    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
  ],
  {
    variants: {
      intent: {
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-200",
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
      isLoading: {
        true: "justify-center shadow-none",
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
  isLoading,
  className,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={props.disabled || (isLoading ?? undefined)}
      className={buttonStyles({
        intent,
        size,
        fullWidth,
        isLoading,
        className,
      })}
    >
      <span className={`flex ${isLoading && "opacity-0"}`}>
        {Icon && <Icon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />}
        {text}
      </span>
      {isLoading && (
        <ArrowPathIcon className="absolute h-5 animate-spin opacity-100" />
      )}
    </button>
  );
}
