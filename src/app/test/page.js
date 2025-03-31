"use client"; 
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Test() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [password, setPassword] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPassword(sessionStorage.getItem("newPassword"));
    }
  }, []);

  useEffect(() => {
    console.log(JSON.stringify({ email, password }));
  }, [email, password]);

  return <div>Email: {email}, Password: {password}</div>;
}