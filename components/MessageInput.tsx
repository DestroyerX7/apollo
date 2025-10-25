"use client";

import { IoIosSend } from "react-icons/io";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "./ui/spinner";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";
import { useRef } from "react";

type Props = {
  loading?: boolean;
  disableButton?: boolean;
  disableTextArea?: boolean;
} & TextareaAutosizeProps;

export default function Yo({
  loading = false,
  disableButton = false,
  disableTextArea = false,
  className,
  disabled,
  ...props
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContainerClick = () => {
    if (textareaRef.current && !disabled && !disableTextArea) {
      textareaRef.current.focus();
    }
  };

  return (
    <div
      className={cn(
        className,
        "border shadow rounded-2xl bg-primary-foreground",
        disabled || disableTextArea ? "cursor-default" : " cursor-text"
      )}
      onClick={handleContainerClick}
    >
      <TextareaAutosize
        className="resize-none w-full p-4 focus:outline-none placeholder:text-muted-foreground"
        disabled={disabled || disableTextArea}
        ref={textareaRef}
        {...props}
      />

      <div className="flex justify-between px-4 pb-4">
        <Button
          className="rounded-full"
          variant="outline"
          type="button"
          onClick={(e) => e.stopPropagation()}
        >
          apollo-v1
        </Button>

        <Button
          className="rounded-full cursor-pointer"
          size="icon"
          variant="default"
          disabled={disabled || disableButton}
          type="submit"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? <Spinner /> : <IoIosSend />}
        </Button>
      </div>
    </div>
  );
}
