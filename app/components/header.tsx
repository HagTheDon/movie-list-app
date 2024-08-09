"use client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import CustomButton from "./button";
import { useRouter } from "next/navigation";

interface HeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showProfile: boolean;
}

export default function Header({ children, showProfile }: HeaderProps) {
  const router = useRouter();
  const { setToken, token } = useContext(AuthContext);

  // useEffect(() => {
  //   if (token == null) {
  //     router.push("/");
  //   }
  // }, [token]);

  const onClickLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    router.push("/");
  };

  const onClickLogin = () => {
    console.log("logout pressed");
    setToken(null);
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <div className="flex justify-between items-center py-4 px-6">
      <h1 className="text-white text-2xl font-bold">{children}</h1>
      {showProfile && (
        <>
          {token === null ? (
            <button onClick={() => onClickLogin()}>Login</button>
          ) : (
            <button onClick={() => onClickLogout()}> Logout</button>
          )}
        </>
      )}
    </div>
  );
}
