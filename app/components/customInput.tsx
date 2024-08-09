import React from "react";
import { useForm } from "react-hook-form";

interface InputProps {
  register: ReturnType<typeof useForm>["register"];
  placeholder: string;
  inputType: string;
  name: string;
  errors?: any;
  [key: string]: any;
}

export default function CustomInput({
  register,
  name,
  placeholder,
  inputType,
  errors,
  ...rest
}: InputProps) {
  return (
    <div className="w-full">
      <input
        {...register(name)}
        {...rest}
        id="custom-input"
        type={inputType}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-green-light border border-green-light text-white text-body-small focus:outline-none focus:bg-white focus:border-green-light focus:text-green-light focus:caret-green-light"
      />
      {errors && (
        <p className="text-red-500 text-body-small">{errors.message}</p>
      )}
    </div>
  );
}
