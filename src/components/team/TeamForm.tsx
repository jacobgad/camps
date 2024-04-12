import type { ButtonProps } from "@ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

type Props = {
  defaultValues?: Partial<Schema>;
  onSubmit: (data: Schema) => void;
  buttonProps?: Partial<ButtonProps>;
};

const schema = z.object({
  campId: z.string().cuid(),
  name: z.string().min(3),
  color: z.string(),
  points: z.number().int(),
});
type Schema = z.infer<typeof schema>;

const colorOptions = [
  "bg-red-500",
  "bg-pink-500",
  "bg-pink-600",
  "bg-pink-400",
  "bg-gray-50",
  "bg-gray-500",
  "bg-zinc-900",
  "bg-yellow-800",
  "bg-green-500",
  "bg-blue-400",
  "bg-blue-700",
  "bg-purple-500",
  "bg-orange-500",
  "bg-yellow-500",
];

export default function TeamForm(props: Props) {
  const { register, handleSubmit, formState, reset } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  useEffect(() => {
    if (!formState.isDirty) reset(props.defaultValues);
  }, [props.defaultValues, reset, formState.isDirty]);

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex h-full flex-col gap-6"
    >
      <Input label="Team Name" type="text" {...register("name")} />
      <Input
        label="Points"
        type="number"
        {...register("points", { valueAsNumber: true })}
      />

      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="color">Color</label>
        <select {...register("color")}>
          {colorOptions.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      <Button
        {...props.buttonProps}
        text={props.buttonProps?.text ?? "Submit"}
        disabled={!formState.isValid || props.buttonProps?.disabled}
        isLoading={props.buttonProps?.isLoading}
        className="justify-center"
      />
    </form>
  );
}
