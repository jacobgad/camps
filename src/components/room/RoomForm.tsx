import type { ButtonProps } from "@ui/Button";
import { HashtagIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  defaultValues?: Partial<Schema>;
  onSubmit: (data: Schema) => void;
  buttonProps?: Partial<ButtonProps>;
};

const schema = z.object({
  name: z.string().min(3),
  capacity: z.number().min(1),
  campId: z.string().cuid(),
});
type Schema = z.infer<typeof schema>;

export default function RoomForm(props: Props) {
  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

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
