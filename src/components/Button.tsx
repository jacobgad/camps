import type ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";

type Props = {
  Icon?: typeof ArrowRightIcon;
};

type ButtonProps = Props & React.ComponentPropsWithoutRef<"button">;

export default function Button({ Icon, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:shadow-none"
    >
      {children}
      {Icon && <Icon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />}
    </button>
  );
}
