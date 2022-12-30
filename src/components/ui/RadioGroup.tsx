import { RadioGroup as RG } from "@headlessui/react";
import ItemCard from "./cards/ItemCard";

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
                <ItemCard
                  selected={checked}
                  disabled={disabled}
                  label={formattedOption.label}
                  description={formattedOption.description}
                />
              )}
            </RG.Option>
          );
        })}
      </ul>
    </RG>
  );
}
