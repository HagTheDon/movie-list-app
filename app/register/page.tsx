"use client";
import React from "react";
import Button from "../components/button";
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

  // Initialize form - react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    registerMutation.mutate(data);
  };

  // Queries - react-query
  // Mutation - Register
  const registerMutation = useMutation({
    mutationFn: (data) => registerUser(data),
    onSuccess: (response) => {
      router.push("/");
    },
    onError(error: any) {
      console.log("error registration", error);
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md"
      >
        <h1 className="font-semibold text-heading-one text-white text-center">
          Register
        </h1>
        <div className="w-full">
          <input
            type="text"
            placeholder="Name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
          />
          {errors.name && (
            <p className="text-body-extra-small text-danger">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
          />
          {errors.email && (
            <p className="text-body-extra-small text-danger">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).*$/,
                message:
                  "Password must contain letters, numbers, and at least one symbol",
              },
            })}
            className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
          />
          {errors.password && (
            <p className="text-body-extra-small text-danger">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="w-full">
          <input
            type="password"
            placeholder="Repeat Password"
            {...register("repeatPassword", {
              required: "Please repeat your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
          />
          {errors.repeatPassword && (
            <p className="text-body-extra-small text-danger">
              {errors.repeatPassword.message}
            </p>
          )}
        </div>
        <Button buttonStyle="primary" type="submit" buttonBlock={true}>
          Register
        </Button>
        <p className="text-white text-body-small text-center">
          Already have an account?
          <Link key="login" href="/">
            <span> Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default isNotAuth(Page);
