"use client";
import { useUser } from "@/context/user";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Redirect() {
  const { isAuth } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth() && pathname.startsWith("/dashboard"))
      return router.push("/login");
    else if (isAuth() && !pathname.startsWith("/dashboard"))
      router.push("/dashboard");
  }, [isAuth, pathname, router]);

  return <></>;
}
