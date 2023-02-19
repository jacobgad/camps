import type { ButtonProps } from "@ui/Button";
import {
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { dateToInputDate, phoneSchema } from "utils/form";
import { z } from "zod";

type Props = {
  onSubmit: (data: Schema) => void;
  defaultValues?: Partial<Schema>;
  buttonProps: { isLoading: boolean } & Partial<ButtonProps>;
};

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  dob: z.date().max(new Date()),
  phone: phoneSchema,
  gender: z.enum(["male", "female"]),
});

type Schema = z.infer<typeof schema>;

const genderOptions = ["male", "female"];

export default function PersonalInformationForm(props: Props) {
  const defaultValues = useMemo(
    () =>
      props.defaultValues && {
        ...props.defaultValues,
        dob: dateToInputDate(props.defaultValues.dob),
      },
    [props.defaultValues]
  );

  const { register, formState, reset, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues,
  });

  useEffect(() => {
    if (!formState.isDirty) reset(defaultValues);
  }, [defaultValues, formState.isDirty, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex flex-grow flex-col"
    >
      <div className="flex flex-grow flex-col gap-6">
        <Input
          label="Full Name"
          placeholder="John Smith"
          Icon={UserIcon}
          {...register("name")}
          error={formState.errors.name?.message}
        />
        <Input
          label="Email address"
          type="email"
          Icon={EnvelopeIcon}
          {...register("email")}
          error={formState.errors.email?.message}
          disabled
        />
        <Input
          label="Date of birth"
          type="date"
          Icon={CalendarIcon}
          {...register("dob", { valueAsDate: true })}
          error={formState.errors.dob?.message}
        />
        <div>
          <Input
            label="Phone number"
            placeholder="+61400000000"
            type="tel"
            {...register("phone")}
            prefix="+61"
            error={formState.errors.phone?.message}
          />
          <p className="mt-2 text-sm font-normal text-gray-500">
            We will use this to send you important updates about the camp.
          </p>
        </div>

        <div className="space-y-2 text-sm font-medium">
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
      </div>

      <div className="flex gap-2">
        <Button
          text="Back"
          type="button"
          intent="secondary"
          fullWidth
          className="justify-center"
        />
        <Button
          {...props.buttonProps}
          text="Next"
          type="submit"
          Icon={ArrowRightIcon}
          fullWidth
          disabled={!formState.isValid || props.buttonProps.isLoading}
          className="justify-center"
        />
      </div>
    </form>
  );
}
