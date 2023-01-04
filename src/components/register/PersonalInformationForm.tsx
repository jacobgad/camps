import {
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
  ArrowRightIcon,
} from "@heroicons/react/20/solid";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  onSubmit: (data: Schema) => void;
  defaultValues?: Partial<Schema>;
};

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  dob: z.date().max(new Date()),
  phone: z.string().regex(/^\+61\s4\d{8}$/),
  gender: z.enum(["male", "female"]),
});

type Schema = z.infer<typeof schema>;

const genderOptions = ["male", "female"];

export default function PersonalInformationForm(props: Props) {
  const { register, formState, handleSubmit } = useForm<Schema>();

  return (
    <form
      onSubmit={handleSubmit((data) => props.onSubmit(data))}
      className="flex flex-grow flex-col"
    >
      <div className="flex flex-grow flex-col gap-6">
        <Input
          label="Name"
          Icon={UserIcon}
          {...register("name")}
          error={formState.errors.name?.message}
        />
        <Input
          label="Email address"
          Icon={EnvelopeIcon}
          {...register("email")}
          error={formState.errors.email?.message}
        />
        <Input
          label="Date of birth"
          Icon={CalendarIcon}
          {...register("dob", { valueAsDate: true })}
          error={formState.errors.dob?.message}
        />
        <div>
          <Input
            label="Phone number"
            {...register("phone")}
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
          text="Next"
          type="submit"
          Icon={ArrowRightIcon}
          fullWidth
          disabled={!formState.isValid}
          className="justify-center"
        />
      </div>
    </form>
  );
}
