import type HashtagIcon from "@heroicons/react/20/solid/HashtagIcon";
import { forwardRef, useId } from "react";

type Props = {
  label: string;
  Icon?: typeof HashtagIcon;
  error?: string;
};

type InputProps = React.ComponentPropsWithoutRef<"input"> & Props;
type Ref = HTMLInputElement;

const Input = forwardRef<Ref, InputProps>(function Input(
  { label, Icon, error, ...rest },
  ref
) {
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
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          {...rest}
          type={rest.type ?? "text"}
          ref={ref}
          id={rest.id ?? id}
          className={`block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-300 sm:text-sm ${
            Icon && "pl-10"
          }`}
        />
      </div>
      <p className="h-4 text-xs text-red-500">{error}</p>
    </div>
  );
});

export default Input;
