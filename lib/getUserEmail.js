import { useSearchParams } from "next/navigation";

export default function getUserEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  return email;
}


