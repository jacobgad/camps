import Link from "next/link";

type LinkButtonProps = {
  text: string;
  href: string;
  Icon?: React.ElementType;
};

export function LinkButton({ text, href, Icon }: LinkButtonProps) {
  return (
    <Link
      href={href}
      type="button"
      className="inline-flex items-center rounded-md border border-indigo-500 bg-transparent px-6 py-3 text-base font-medium text-indigo-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {Icon && <Icon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />}
      {text}
    </Link>
  );
}
