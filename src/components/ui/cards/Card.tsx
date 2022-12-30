import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

type Props = {
  children: React.ReactNode;
  clickable?: boolean;
} & VariantProps<typeof cardStyles> &
  React.ComponentProps<"button">;

const cardStyles = cva(
  "rounded-lg active:shadow-none w-full disabled:bg-gray-200 text-left border border-gray-300 p-4 shadow-sm active:bg-indigo-50",
  {
    variants: {
      selected: {
        true: "bg-indigo-600 text-indigo-50",
        false: "bg-white text-gray-900",
      },
    },
  }
);

export default function Card({
  children,
  selected,
  className,
  ...rest
}: Props) {
  return (
    <button {...rest} className={cardStyles({ selected, className })}>
      {children}
    </button>
  );
}
