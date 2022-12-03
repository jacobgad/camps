import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../forms/Input";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10),
  gender: z.enum(["male", "female"]),
});

type Schema = z.infer<typeof schema>;

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function UpdatePersonalInfo() {
  const session = useSession();
  console.log(session);
  const { data } = trpc.users.getUser.useQuery();
  const { mutate } = trpc.users.update.useMutation();

  function updateUser({ firstName, lastName, ...rest }: Schema) {
    const name = firstName.trim() + " " + lastName.trim();
    mutate({ ...rest, name });
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: data?.name ?? undefined,
      phone: data?.email?.includes("@phone.number")
        ? data?.email.split("@")[0]
        : data?.phone ?? undefined,
      gender: data?.gender ?? undefined,
    },
  });

  if (!data) return <p>loading...</p>;

  return (
    <>
      <h3 className="mb-1 text-lg font-medium leading-6">Registration</h3>
      <p className="mb-6 text-sm font-normal leading-5">
        Please enter your phone number below. You will then receive an SMS
        message with a link to complete registration
      </p>

      <form onSubmit={handleSubmit(updateUser)}>
        <Input
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message?.toString()}
        />
        <Input
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message?.toString()}
        />
        <Input
          label="Phone number"
          {...register("phone")}
          disabled={session.data?.user?.email?.includes("@phone.number")}
          error={errors.phone?.message?.toString()}
        />

        <h3>Gender</h3>
        <div className="grid">
          {genders.map((gender) => (
            <div key={gender.value} className="space-x-2">
              <input
                type="radio"
                id={gender.value}
                {...register("gender")}
                value={gender.value}
              />
              <label htmlFor={gender.value}>{gender.label}</label>
            </div>
          ))}
        </div>

        <button disabled={!isValid} className="disabled:text-gray-500">
          Submit
        </button>
      </form>
    </>
  );
}
