"use client";

import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { FiLock } from "react-icons/fi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function ShowPasswordInput({
  ...props
}: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput type={showPassword ? "text" : "password"} {...props} />
      <InputGroupAddon>
        <FiLock />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          className="rounded-full cursor-pointer"
          size="icon-sm"
          variant="ghost"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
