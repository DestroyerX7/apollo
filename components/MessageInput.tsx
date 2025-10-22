"use client";

import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { IoIosSend } from "react-icons/io";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  onSubmit: (userMessageContent: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function MessageInput({
  onSubmit,
  placeholder,
  disabled,
}: Props) {
  const [userMessageContent, setUserMessageContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userMessageContent.trim()) {
      return;
    }

    onSubmit(userMessageContent.trim());
    setUserMessageContent("");
  };

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Ignore clicks on buttons, SVGs, inputs, etc.
    if (["BUTTON", "SVG", "PATH", "TEXTAREA", "INPUT"].includes(target.tagName))
      return;

    // Focus the textarea
    textareaRef.current?.focus();
  };

  return (
    <form
      className="border rounded-2xl shadow cursor-text bg-primary-foreground"
      onSubmit={handleSubmit}
    >
      <div onClick={handleDivClick}>
        <TextareaAutosize
          className="resize-none w-full px-4 pt-4 focus:outline-none"
          rows={1}
          minRows={1}
          maxRows={10}
          value={userMessageContent}
          placeholder={placeholder || "Message Apollo"}
          name="user-message-content"
          onChange={(e) => setUserMessageContent(e.target.value)}
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
        />

        <div className="flex items-center justify-between p-3">
          <Button className="rounded-full" variant="outline">
            apollo-v1
          </Button>

          <Button
            className="cursor-pointer rounded-full"
            size="icon"
            disabled={disabled || !userMessageContent.trim()}
          >
            <IoIosSend />
          </Button>
        </div>
      </div>
    </form>
  );
}
