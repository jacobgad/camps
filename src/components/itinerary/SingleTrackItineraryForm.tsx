import type { ButtonProps } from "@ui/Button";
import { UserIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { dateToInputDateTime } from "utils/form";
import { z } from "zod";
import DeleteItineraryItemButton from "./DeleteItineraryItemButton";

type DefaultValues = {
  campId: string;
} & Partial<Schema>;

type Props = {
  onSubmit: (data: Schema) => void;
  defaultValues: DefaultValues;
  buttonProps: { isLoading: boolean } & Partial<ButtonProps>;
};

const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  campId: z.string().cuid(),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
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
    mode: "onTouched",
    defaultValues: {
      ...props.defaultValues,
      date: dateToInputDateTime(props.defaultValues.date),
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex flex-grow flex-col"
    >
      <div className="flex flex-grow flex-col gap-4">
        <Input
          label="Session Name"
          {...register("name")}
          error={formState.errors.name?.message}
        />
        <Input
          label="Date"
          type="datetime-local"
          Icon={CalendarIcon}
          {...register("date", { valueAsDate: true })}
          error={formState.errors.date?.message}
        />
        {showDescription ? (
          <Input
            label="Description"
            helperText="optional"
            {...register("description")}
            error={formState.errors.description?.message}
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
            error={formState.errors.location?.message}
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

      {props.defaultValues.id && (
        <DeleteItineraryItemButton itineraryItemId={props.defaultValues.id} />
      )}
      <Button
        {...props.buttonProps}
        text={props.buttonProps.text ?? "Submit"}
        disabled={!formState.isValid || props.buttonProps.disabled}
        isLoading={props.buttonProps.isLoading}
        className="mt-6 justify-center"
      />
    </form>
  );
}
