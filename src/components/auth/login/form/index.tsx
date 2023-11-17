"use client";

import { notify } from "@/components/utils/toast";
import { useAccessibility } from "@/context/accessibility";
import { useUser } from "@/context/user";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, type FormEvent } from "react";

type Props = {
  className?: string;
};

export default function LoginForm({ ...props }: Props) {
  const { login } = useUser();
  const router = useRouter();
  const { getDict, theme } = useAccessibility();
  const dict = getDict();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [passwordType, setPasswordType] = useState<string>("password");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.length || !password.length)
      return notify(dict.missingFields, "error");

    setLoading(true);
    const data = await login(email, password);

    if (!data?.user) notify(dict.auth.invalidCredentials, "error");

    setLoading(false);
    if (data?.user) router.push("/dashboard");
  };

  return (
    <form className={`flex flex-column ${props.className}`}>
      <div className={`flex flex-column gap-2`}>
        <label
          className={`${theme === "light" ? "text-gray-900" : "light"}`}
          htmlFor="email"
        >
          {dict.auth.email}
        </label>
        <InputText
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <span className="p-input-icon-right">
        <label
          className={`${theme === "light" ? "text-gray-900" : "light"}`}
          htmlFor="password"
        >
          {dict.auth.password}
        </label>
        <InputText
          id="password"
          type={passwordType}
          value={password}
          className="w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <i
          className={`pt-2 cursor-pointer pi ${
            passwordType === "password" ? "pi-eye-slash" : "pi-eye"
          }`}
          onClick={() =>
            setPasswordType(passwordType === "password" ? "text" : "password")
          }
        />
      </span>
      <Button
        label={dict.auth.login}
        className="w-full"
        onClick={handleSignIn}
        loading={loading}
        type="submit"
      />
    </form>
  );
}
