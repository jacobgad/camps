import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export type ButtonProps = {
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
          "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-200 disabled:hover:bg-indigo-200",
        secondary:
          "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:hover:bg-indigo-50 disabled:text-indigo-300",
        danger:
          "bg-red-50 text-red-700 hover:bg-red-200 disabled:text-red-300 disabled:hover:bg-red-50",
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
}: ButtonProps) {
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
        {Icon && (
          <Icon
            className={`-ml-1 mr-3 ${size === "small" && "h-4 w-4"} ${
              size === undefined && "h-5 w-5"
            } ${size === "large" && "h-6 w-6"}`}
            aria-hidden="true"
          />
        )}
        {text}
      </span>
      {isLoading && (
        <ArrowPathIcon className="absolute h-5 animate-spin opacity-100" />
      )}
    </button>
  );
}
