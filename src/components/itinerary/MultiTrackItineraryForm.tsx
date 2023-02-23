import type { ButtonProps } from "@ui/Button";
import { CalendarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useFieldArray, useForm } from "react-hook-form";
import { dateToInputDateTime } from "utils/form";
import { z } from "zod";
import DeleteItineraryItemButton from "./DeleteItineraryItemButton";
import ButtonField from "@ui/ButtonField";
import {
  MapPinIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { Fragment, useEffect, useMemo } from "react";

type DefaultValues = {
  campId: string;
} & Partial<MultiTrackSchema>;

type Props = {
  onSubmit: (data: MultiTrackSchema) => void;
  defaultValues: DefaultValues;
  buttonProps: { isLoading: boolean } & Partial<ButtonProps>;
};

const schema = z.object({
  id: z.number().optional(),
  campId: z.string().cuid(),
  name: z.string().min(3),
  date: z.date(),
  options: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(3),
      capacity: z.number().positive(),
      description: z.string().optional().nullable(),
      location: z.string().optional().nullable(),
    })
  ),
});
export type MultiTrackSchema = z.infer<typeof schema>;

export default function MultiTrackItineraryForm(props: Props) {
  const defaultValues = useMemo(() => {
    return {
      ...props.defaultValues,
      date: dateToInputDateTime(props.defaultValues.date),
    };
  }, [props.defaultValues]);

  const { register, formState, handleSubmit, control, reset } =
    useForm<MultiTrackSchema>({
      resolver: zodResolver(schema),
      mode: "onBlur",
      defaultValues,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (!formState.isDirty) reset(defaultValues);
  }, [formState.isDirty, defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex flex-grow flex-col"
    >
      <div className="flex flex-grow flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Input
            label="Track Name"
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
        </div>

        {fields.map((field, idx) => (
          <Fragment key={field.id}>
            <hr />
            <section className="flex flex-col gap-4">
              <Input
                label="Session Name"
                {...register(`options.${idx}.name`)}
                error={formState.errors.name?.message}
              />
              <Input
                label="Max capacity"
                type="number"
                {...register(`options.${idx}.capacity`, {
                  valueAsNumber: true,
                })}
                Icon={UserGroupIcon}
                error={formState.errors.name?.message}
              />
              <ButtonField
                label="Description"
                helperText="optional"
                {...register(`options.${idx}.description`)}
                buttonProps={{ text: "Add description", Icon: UserIcon }}
              />
              <ButtonField
                label="Location"
                helperText="optional"
                {...register(`options.${idx}.location`)}
                buttonProps={{
                  text: "Add location",
                  Icon: MapPinIcon,
                  className: "-mt-2",
                }}
              />
              {fields.length > 2 && (
                <Button
                  text="Remove session option"
                  Icon={MinusCircleIcon}
                  intent="danger"
                  size="small"
                  onClick={() => remove(idx)}
                />
              )}
            </section>
          </Fragment>
        ))}

        <hr />
        <Button
          type="button"
          text="Add new session option"
          intent="secondary"
          Icon={PlusCircleIcon}
          size="small"
          onClick={() => append({ name: "", capacity: 0 })}
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {props.defaultValues.id && (
          <DeleteItineraryItemButton itineraryItemId={props.defaultValues.id} />
        )}
        <Button
          {...props.buttonProps}
          type="submit"
          text={props.buttonProps.text ?? "Submit"}
          disabled={!formState.isValid || props.buttonProps.disabled}
          isLoading={props.buttonProps.isLoading}
          className="justify-center"
        />
      </div>
    </form>
  );
}
