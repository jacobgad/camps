import type { ButtonProps } from "@ui/Button";
import { HashtagIcon } from "@heroicons/react/20/solid";
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
  name: z.string().min(3),
  capacity: z.number().min(1),
  campId: z.string().cuid(),
  code: z.string().optional().nullable(),
  gender: z.enum(["male", "female"]),
});
type Schema = z.infer<typeof schema>;

const genderOptions = ["male", "female"];

export default function RoomForm(props: Props) {
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
      <div className="flex-grow space-y-4">
        <Input label="Room Name" type="text" {...register("name")} />
        <Input
          label="Capacity"
          type="number"
          Icon={HashtagIcon}
          {...register("capacity", { valueAsNumber: true })}
        />
        <Input
          label="Room Code"
          type="text"
          helperText="Optional"
          {...register("code")}
        />
      </div>

      <div className="space-y-2 text-sm font-medium text-gray-700">
        <p className="text-sm font-medium">Gender</p>
        {genderOptions.map((gender) => (
          <div key={gender}>
            <input
              type="radio"
              value={gender}
              id={`gender-${gender}`}
              {...register("gender")}
            />
            <label htmlFor={`gender-${gender}`} className="ml-2 capitalize">
              {gender}
            </label>
          </div>
        ))}
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
