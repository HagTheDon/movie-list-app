"use client";
import Button from "../components/button";
import CustomInput from "../components/customInput";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/mainApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import isNotAuth from "../components/isNotAuth";

type Inputs = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const Page = () => {
  const router = useRouter();
  //Initialize form - react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    let params = data;
    console.log("params to be sent", params);
    registerMutation.mutate(data);
  };
  // Queries - react-query
  //Mutation - Register
  const registerMutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (response) => {
      console.log("registration successful", response);
      router.push("/");
    },
    onError(error: any) {
      console.log("error regisration", error);
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p>Register</p>
      <CustomInput
        placeholder="name"
        inputType="text"
        name="name"
        register={register}
      />
      <CustomInput
        placeholder="email"
        inputType="text"
        name="email"
        register={register}
      />
      <CustomInput
        placeholder="password"
        inputType="password"
        name="password"
        register={register}
      />
      <CustomInput
        placeholder="repeat password"
        inputType="password"
        name="repeatPassword"
        register={register}
      />
      <Button buttonStyle="primary" type="submit">
        Register
      </Button>
      <p className="text-white">
        Already have an account?
        <Link key="login" href="/login">
          <span> Login</span>
        </Link>
      </p>
    </form>
  );
};

export default isNotAuth(Page);
