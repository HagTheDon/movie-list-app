"use client";
import React, { useContext } from "react";
import Button from "./components/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./api/mainApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "./context/AuthContext";
import isNotAuth from "./components/isNotAuth";

type Inputs = {
  email: string;
  password: string;
  token_expiry: boolean;
};

const Page = () => {
  const router = useRouter();
  const { setToken } = useContext(AuthContext);

  // Initialize form - react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    let params = {
      email: data.email,
      password: data.password,
      token_expiry: data.token_expiry ? "7d" : "2h",
    };
    loginMutation.mutate(params);
  };

  // Queries - react-query
  // Mutation - Login
  const loginMutation = useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: (response) => {
      setToken(response?.data);
      localStorage.setItem("token", response?.data);
      router.push("/dashboard");
    },
    onError(error: any) {
      setToken(null);
      localStorage.removeItem("token");
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md"
      >
        <h1 className="font-semibold text-heading-one text-white text-center">
          Sign In
        </h1>
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
            })}
            className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
          />
          {errors.password && (
            <p className="text-body-extra-small text-danger">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-center space-x-2">
          <input
            type="checkbox"
            {...register("token_expiry")}
            id="rememberMe"
            className="w-5 h-5 bg-[#224957] border-[#224957] checked:bg-white checked:border-[#224957] checked:accent-[#224957] rounded-lg cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-white text-body-small">
            Remember me
          </label>
        </div>
        <Button buttonStyle="primary" type="submit" buttonBlock={true}>
          Login
        </Button>
        <p className="text-white text-body-small text-center">
          Don&#39;t have an account?
          <Link key="login" href="/register">
            <span> Register</span>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default isNotAuth(Page);
