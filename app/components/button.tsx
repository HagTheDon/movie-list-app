import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonStyle: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}

export default function CustomButton({
  buttonStyle,
  type = "button",
  disabled = false,
  children,
  ...rest
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-bold text-center cursor-pointer";

  const primaryStyles = "bg-[#2BD17E] text-white border border-[#2BD17E]";
  const secondaryStyles = "bg-transparent text-white border border-white";

  const buttonStyles =
    buttonStyle === "primary" ? primaryStyles : secondaryStyles;

  return (
    <button
      className={`${baseStyles} ${buttonStyles}`}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
