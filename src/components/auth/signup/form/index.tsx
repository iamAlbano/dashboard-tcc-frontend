"use client";

import { notify } from "@/components/utils/toast";
import { useAccessibility } from "@/context/accessibility";
import { useUser } from "@/context/user";
import { validateEmail } from "@/utils/functions/validation";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, type FormEvent } from "react";

type Props = {
  className?: string;
};

export default function SignupForm({ ...props }: Props) {
  const { signup, login } = useUser();
  const { getDict, theme } = useAccessibility();
  const dict = getDict();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [passwordType, setPasswordType] = useState<string>("password");
  const [validated, setValidated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setValidated(true);
    if (!name.length || !surname.length || !validateEmail(email))
      return notify(dict.missingFields, "error");

    if (password.length < 5)
      return notify(dict.auth.passwordLengthWarning, "error");

    if (password !== confirmPassword)
      return notify(dict.auth.mismatchPassword, "error");

    setLoading(true);
    const res = await signup(name, surname, email, password);
    setLoading(false);

    if (!res || res?.status !== 201) {
      if (res?.data?.message === "Email already registered")
        return notify(dict.auth.emailAlreadyRegistered, "error");
      else return notify(res?.data?.message ?? dict.errorMessage, "error");
    }

    const loginRes = await login(email, password);

    if (!loginRes || loginRes?.status !== 200) {
      return notify(loginRes?.data?.message ?? dict.errorMessage, "error");
    }

    router.push("/dashboard");
  };

  return (
    <form className={`flex flex-column ${props.className}`}>
      <div className={`flex flex-column gap-2`}>
        <label
          className={`${theme === "light" ? "text-gray-900" : "light"}`}
          htmlFor="name"
        >
          {dict.auth.name}
        </label>
        <span className="flex flex-row gap-2 w-full">
          <InputText
            id="name"
            type="text"
            value={name}
            className={`w-full ${
              validated && name.length < 3 && "border-red-500"
            }`}
            placeholder={dict.auth.name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputText
            id="surname"
            type="text"
            value={surname}
            className={`w-full ${
              validated && surname.length < 3 && "border-red-500"
            }`}
            placeholder={dict.auth.surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </span>
      </div>
      <div className={`flex flex-column gap-2`}>
        <label
          className={`${theme === "light" ? "text-gray-900" : "light"}`}
          htmlFor="email"
        >
          {dict.auth.email}
        </label>
        <InputText
          id="email"
          type="text"
          value={email}
          placeholder="exemplo@gmail.com"
          className={`w-full ${
            validated && !validateEmail(email) && "border-red-500"
          }`}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={`flex flex-column gap-2`}>
        <label
          className={`${theme === "light" ? "text-gray-900" : "light"}`}
          htmlFor="password"
        >
          {dict.auth.password}
        </label>
        <span className="p-input-icon-right">
          <InputText
            id="password"
            type={passwordType}
            value={password}
            className={`w-full ${
              validated && password.length < 5 && "border-red-500"
            }`}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`cursor-pointer pi ${
              passwordType === "password" ? "pi-eye-slash" : "pi-eye"
            }`}
            onClick={() =>
              setPasswordType(passwordType === "password" ? "text" : "password")
            }
          />
        </span>
        <span className="p-input-icon-right">
          <InputText
            id="password"
            type={passwordType}
            value={confirmPassword}
            placeholder="********"
            className={`w-full ${
              validated &&
              (password.length < 5 || password !== confirmPassword) &&
              "border-red-500"
            }`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <i
            className={`cursor-pointer pi ${
              passwordType === "password" ? "pi-eye-slash" : "pi-eye"
            }`}
            onClick={() =>
              setPasswordType(passwordType === "password" ? "text" : "password")
            }
          />
        </span>
      </div>
      <Button
        type="submit"
        className="w-full"
        label={dict.auth.signup}
        onClick={handleSignIn}
        loading={loading}
      />
    </form>
  );
}
