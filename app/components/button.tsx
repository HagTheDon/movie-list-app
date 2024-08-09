import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonStyle: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  buttonBlock?: boolean; // Add this prop to determine full-width button
}

export default function CustomButton({
  buttonStyle,
  type = "button",
  disabled = false,
  buttonBlock = false, // Default to false
  children,
  ...rest
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-bold text-center cursor-pointer text-body-regular text-white";

  const primaryStyles = "bg-primary  border border-primary";
  const secondaryStyles = "bg-transparent border border-white";

  const buttonStyles =
    buttonStyle === "primary" ? primaryStyles : secondaryStyles;

  return (
    <button
      className={`${baseStyles} ${buttonStyles} ${buttonBlock ? "w-full" : ""}`} // Add w-full if buttonBlock is true
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
