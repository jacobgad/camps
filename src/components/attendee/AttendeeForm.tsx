import type { ButtonProps } from "@ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { phoneSchema } from "utils/form";
import { trpc } from "utils/trpc";

type Props = {
  campId: string;
  defaultValues?: Partial<Schema>;
  onSubmit: (data: Schema) => void;
  buttonProps?: Partial<ButtonProps>;
};

const schema = z.object({
  name: z.string().min(3),
  phoneNumber: phoneSchema,
  teamId: z.number().positive(),
});
type Schema = z.infer<typeof schema>;

export default function AttendeeForm(props: Props) {
  const { register, handleSubmit, formState, reset } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  const teams = trpc.team.getAll.useQuery({ campId: props.campId });

  useEffect(() => {
    if (!formState.isDirty && teams.isSuccess) reset(props.defaultValues);
  }, [props.defaultValues, reset, formState.isDirty, teams.isSuccess]);

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex h-full flex-col gap-6"
    >
      <Input label="Name" type="text" {...register("name")} />
      <Input label="Phone number" type="text" {...register("phoneNumber")} />

      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="color">Team</label>
        <select
          {...register("teamId", { valueAsNumber: true })}
          disabled={teams.isLoading}
        >
          <option key={0} value={undefined}></option>
          {teams.data?.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
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
        type="submit"
      />
    </form>
  );
}
