"use client";
import React, { useContext } from "react";
import {
  HomeIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface HeaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showProfile: boolean;
  showAdd?: boolean;
}

export default function Header({
  children,
  showProfile,
  showAdd = false,
}: HeaderProps) {
  const router = useRouter();
  // @ts-ignore
  const { setToken, token } = useContext(AuthContext);

  const onClickLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    router.push("/");
  };

  const onClickLogin = () => {
    setToken(null);
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <div className="flex justify-between items-center py-6 px-6">
      <div className="flex items-center space-x-3">
        <HomeIcon
          className="h-6 w-6 text-white"
          onClick={() => router.push("/dashboard")}
        />
        <h2 className="text-white text-heading-two font-semibold">
          {children}
        </h2>
        {showAdd && (
          <PlusCircleIcon
            className="h-6 w-6 text-white"
            onClick={() => router.push("/dashboard/add")}
          />
        )}
      </div>

      {showProfile && (
        <>
          {token === null ? (
            <div className="flex items-center space-x-2">
              <button
                className="text-white text-body-regular"
                onClick={() => onClickLogin()}
              >
                Login
              </button>
              <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-white" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                className="text-white text-body-regular"
                onClick={() => onClickLogout()}
              >
                Logout
              </button>
              <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-white" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
