import React from "react";
import { useForm } from "react-hook-form";

interface InputProps {
  register: ReturnType<typeof useForm>["register"];
  placeholder: string;
  inputType: string;
  name: string;
  [key: string]: any;
}

export default function CustomInput({
  register,
  name,
  placeholder,
  inputType,
  ...rest
}: InputProps) {
  return (
    <div className="max-w-sm">
      <input
        {...register(name)}
        {...rest}
        id="custom-input"
        type={inputType}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-[#224957] border border-[#224957] text-white focus:outline-none focus:ring-2 focus:ring-[#092C39]"
      />
    </div>
  );
}
