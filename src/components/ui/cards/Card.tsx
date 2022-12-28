import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

type Props = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof cardStyles>;

const cardStyles = cva("rounded-lg bg-white", {
  variants: {
    variant: {
      light:
        "border border-gray-300 p-4 shadow-sm active:bg-indigo-50 active:shadow-none",
      dark: "shadow-lg py-5 px-6",
    },
  },
  defaultVariants: {
    variant: "light",
  },
});

export default function Card({ children, variant, className }: Props) {
  return <div className={cardStyles({ variant, className })}>{children}</div>;
}
