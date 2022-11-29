import type HashtagIcon from "@heroicons/react/20/solid/HashtagIcon";
import { useId } from "react";

type Props = {
  label: string;
  Icon: typeof HashtagIcon;
};

type IconInputProps = React.InputHTMLAttributes<HTMLInputElement> & Props;

export default function IconInput({ label, Icon, ...rest }: IconInputProps) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={rest.id ?? id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          id={id}
          {...rest}
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}
