import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  onSubmit: (data: Schema) => void;
  isLoading: boolean;
  defaultValues?: Partial<Schema>;
  buttonText?: string;
};

const schema = z.object({
  name: z.string().min(3),
  organiser: z.string().min(3),
  startDate: z.date(),
  endDate: z.date(),
});
type Schema = z.infer<typeof schema>;

export default function CampDetailsForm(props: Props) {
  const { register, watch, formState, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: props.defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex flex-grow flex-col"
    >
      <div className="mt-4 flex w-full flex-grow flex-col gap-6">
        <Input
          label="Camp name"
          fullWidth
          {...register("name")}
          error={formState.errors.name?.message}
        />
        <div className="grid gap-4">
          <Input
            label="Organiser"
            {...register("organiser")}
            error={formState.errors.organiser?.message}
          />
          <Button
            text="Add additional organiser"
            type="button"
            Icon={PlusCircleIcon}
            intent="secondary"
            size="small"
          />
        </div>
        <Input
          label="Start date"
          type="date"
          {...register("startDate", { valueAsDate: true })}
          error={formState.errors.startDate?.message}
          // defaultValue={
          //   props.defaultValues?.startDate
          //     ? format(props.defaultValues.startDate, "yyyy-MM-dd")
          //     : undefined
          // }
        />
        <Input
          label="End date"
          type="date"
          disabled={!watch("startDate")?.getTime()}
          min={
            watch("startDate")?.getTime() > 0
              ? format(watch("startDate"), "yyyy-MM-dd")
              : undefined
          }
          {...register("endDate", { valueAsDate: true })}
          error={formState.errors.endDate?.message}
        />
      </div>
      <Button
        text={props.buttonText ?? "Submit"}
        type="submit"
        disabled={!formState.isValid}
        isLoading={props.isLoading}
        fullWidth
        className="mt-2 justify-center"
      />
    </form>
  );
}
