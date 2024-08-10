"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const token = await localStorage.getItem("token");
        if (!token) {
          router.push("/login"); // Redirect to login if no token
        }
      };
      checkAuth();
    }, [router]);

    return <Component {...props} />;
  };
}
