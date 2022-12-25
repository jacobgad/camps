import { RadioGroup as RG } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Card from "./Card";

type Option = {
  id: number | string;
  label: string;
  description: string;
  disabled?: boolean;
};

type RadioGroupProps<T> = {
  value?: T;
  options: T[];
  onChange: (selected: T) => void;
  formatOption: (option: T) => Option;
  className?: string;
};

export function RadioGroup<T>(props: RadioGroupProps<T>) {
  return (
    <RG
      value={props.value}
      onChange={props.onChange}
      className={props.className}
    >
      <ul className="space-y-2">
        {props.options.map((option) => {
          const formattedOption = props.formatOption(option);

          return (
            <RG.Option
              as="li"
              key={formattedOption.id}
              value={option}
              disabled={formattedOption.disabled}
            >
              {({ checked, disabled }) => (
                <Card
                  className={`flex items-center justify-between transition ${
                    checked ? "bg-indigo-600" : disabled && "bg-gray-200"
                  }`}
                >
                  <div className="text-sm">
                    <RG.Label
                      className={`font-semibold transition ${
                        checked
                          ? "text-indigo-50"
                          : disabled
                          ? "text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {formattedOption.label}
                    </RG.Label>
                    <RG.Description
                      className={`font-normal transition ${
                        checked ? "text-indigo-100" : "text-gray-500"
                      }`}
                    >
                      {formattedOption.description}
                    </RG.Description>
                  </div>
                  <CheckCircleIcon
                    className={`h-6 text-indigo-50 transition ${
                      !checked && "opacity-0"
                    }`}
                  />
                </Card>
              )}
            </RG.Option>
          );
        })}
      </ul>
    </RG>
  );
}
