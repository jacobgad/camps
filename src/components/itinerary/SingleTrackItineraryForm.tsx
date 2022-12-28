import { UserIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type DefaultValues = {
  campId: string;
} & Partial<Schema>;

type Props = {
  isLoading?: boolean;
  onSubmit: (data: Schema) => void;
  defaultValues: DefaultValues;
};

const schema = z.object({
  campId: z.string().cuid(),
  name: z.string().min(3),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.date(),
});
type Schema = z.infer<typeof schema>;

export default function SingleTrackItineraryForm(props: Props) {
  const [showDescription, setShowDescription] = useState(
    !!props.defaultValues.description
  );
  const [showLocation, setShowLocation] = useState(
    !!props.defaultValues.location
  );

  const { register, formState, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex h-full flex-col"
    >
      <div className="flex flex-grow flex-col gap-4">
        <Input label="Session Name" {...register("name")} />
        <Input
          label="Date"
          type="datetime-local"
          Icon={CalendarIcon}
          {...register("date", { valueAsDate: true })}
        />
        {showDescription ? (
          <Input
            label="Description"
            helperText="optional"
            {...register("description")}
          />
        ) : (
          <Button
            text="Add description"
            intent="secondary"
            size="small"
            Icon={UserIcon}
            onClick={() => setShowDescription(true)}
          />
        )}

        {showLocation ? (
          <Input
            label="Location"
            helperText="optional"
            Icon={MapPinIcon}
            {...register("location")}
          />
        ) : (
          <Button
            text="Add location"
            intent="secondary"
            size="small"
            Icon={MapPinIcon}
            onClick={() => setShowLocation(true)}
            className="-mt-1"
          />
        )}
      </div>

      <Button
        text="Add new session"
        disabled={!formState.isValid}
        isLoading={props.isLoading}
        className="mt-4 justify-center"
      />
    </form>
  );
}
