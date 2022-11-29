import { PhoneIcon } from "@heroicons/react/20/solid";
import { useId } from "react";

type Props = {
  // icon: React.ComponentProps<"svg">;
  label: string;
  value: string;
  setValue: (value: string) => void;
  button: {
    onClick: () => void;
    label: string;
  };
};

export default function InputWithButton(props: Props) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id={id}
            type="text"
            name="name"
            value={props.value}
            onChange={(e) => props.setValue(e.target.value)}
            className="block w-full rounded-none rounded-l-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="0400000000"
          />
        </div>
        <button
          type="button"
          onClick={props.button.onClick}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {props.button.label}
        </button>
      </div>
    </div>
  );
}
