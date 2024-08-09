"use client";
import React, { useContext } from "react";
import Button from "./components/button";
import CustomInput from "./components/customInput";
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
  //Initialize form - react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    let params = {
      email: data.email,
      password: data.password,
      token_expiry: data.token_expiry ? "7d" : "2h",
    };

    console.log("params to be sent", params);
    loginMutation.mutate(params);
  };
  // Queries - react-query
  //Mutation - Login
  const loginMutation = useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: (response) => {
      console.log("login successful", response);
      setToken(response?.data);
      localStorage.setItem("token", response?.data);
      router.push("/dashboard");
    },
    onError(error: any) {
      console.log("error regisration", error);
      setToken(null);
      localStorage.removeItem("token");
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p>Sign In</p>
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
      <div className="flex items-center space-x-2">
        <input type="checkbox" {...register("token_expiry")} id="rememberMe" />
        <label htmlFor="rememberMe" className="text-white">
          Remember me
        </label>
      </div>
      <Button buttonStyle="primary" type="submit">
        Login
      </Button>
      <p className="text-white">
        Don&#39;t have an account?
        <Link key="login" href="/register">
          <span>Register</span>
        </Link>
      </p>
    </form>
  );
};

export default isNotAuth(Page);
