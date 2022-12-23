import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  campId: string;
  isLoading?: boolean;
  onSubmit: (data: Schema) => void;
};

const schema = z.object({
  campId: z.string().cuid(),
  name: z.string().min(3),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.date(),
});
type Schema = z.infer<typeof schema>;

export default function CreateItineraryItemForm(props: Props) {
  const { register, formState, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: { campId: props.campId },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="grid gap-4"
    >
      <Input label="Session Name" {...register("name")} />
      <Input
        label="Description"
        helperText="optional"
        {...register("description")}
      />
      <Input
        label="Location"
        helperText="optional"
        Icon={MapPinIcon}
        {...register("location")}
      />
      <Input
        label="Date"
        type="datetime-local"
        Icon={CalendarIcon}
        {...register("date", { valueAsDate: true })}
      />
      <Button
        text="Add new session"
        disabled={!formState.isValid}
        isLoading={props.isLoading}
        className="mt-4 justify-center"
      />
    </form>
  );
}
