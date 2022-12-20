import { forwardRef, useId } from "react";
import { motion } from "framer-motion";

type Ref = HTMLInputElement;
type Props = {
  label: string;
  Icon?: React.ElementType;
  error?: string;
  fullWidth?: boolean;
} & React.ComponentProps<"input">;

export default forwardRef<Ref, Props>(function Input(
  { label, Icon, error, fullWidth, ...props },
  ref
) {
  const id = useId();

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          {...props}
          type={props.type ?? "text"}
          className={`block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-200 sm:text-sm ${
            Icon && "pl-10"
          } ${fullWidth && "w-full"}`}
        />
        {error !== undefined && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute mt-1 rounded bg-red-700 px-2 py-1 text-sm text-red-50"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
});
