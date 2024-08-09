"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function isNotAuth(Component) {
  return function IsNotAuth(props) {
    const router = useRouter();
    useEffect(() => {
      const checkAuth = async () => {
        const token = await localStorage.getItem("token");
        if (token) {
          router.push("/dashboard");
        }
      };
      checkAuth();
    }, []);

    return <Component {...props} />;
  };
}
