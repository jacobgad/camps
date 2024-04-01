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
  email: z.string().email(),
});
type Schema = z.infer<typeof schema>;

export default function OrganiserForm(props: Props) {
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
      <Input label="Email" type="email" {...register("email")} />

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
