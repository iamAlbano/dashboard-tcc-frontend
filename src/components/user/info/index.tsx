"use client";
import { useUser } from "@/context/user";
import { Avatar } from "primereact/avatar";

export default function UserInfo() {
  const { name, surname, email } = useUser();
  return (
    <div className="flex flex-row gap-1">
      <span className="desktop flex-column justify-content-center align-items-end">
        <p className="p-0 m-0 font-semibold white-space-nowrap">
          {name} {surname}
        </p>
        <p className="p-0 m-0 white-space-nowrap">{email}</p>
      </span>
      <Avatar
        size="large"
        shape="circle"
        style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
        label={name[0] + surname[0]}
      />
    </div>
  );
}
