"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";

type Props = {
  text: string;
};

export default function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={copy}
          >
            {copied ? <FaCheck /> : <IoCopyOutline />}
          </Button>
        </TooltipTrigger>

        <TooltipContent side="bottom">Copy</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
