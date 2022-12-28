import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

type Props = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof layoutStyles>;

const layoutStyles = cva("h-full", {
  variants: {
    variant: {
      light: "bg-gray-50",
      dark: "bg-[#0D1522]",
    },
    gutter: {
      true: "px-4 py-8",
    },
  },
  defaultVariants: {
    variant: "light",
    gutter: true,
  },
});

export default function Layout(props: Props) {
  const { children, variant, gutter, className } = props;

  return (
    <>
      <main className={layoutStyles({ variant, gutter })}>
        <div
          className={`container mx-auto flex min-h-full max-w-md flex-col ${className}`}
        >
          {children}
        </div>
      </main>

      <style jsx global>{`
        body {
          background: ${variant === "dark" ? "#0D1522" : "#f9fafb"};
        }
      `}</style>
    </>
  );
}
