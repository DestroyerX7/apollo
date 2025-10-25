"use client";

import {
  createChatName,
  createNewChat,
  getGroqChatCompletion,
  saveUserAndAssistantMessages,
} from "@/lib/actions";
import { ChatCompletionUserMessageParam } from "groq-sdk/resources/chat.mjs";
import { useRouter } from "next/navigation";
import MessageInput from "./MessageInput";
import { FormEvent, useState } from "react";

type Props = {
  userId: string;
};

export default function NewChatMessageInput({ userId }: Props) {
  const [userMessageContent, setUserMessageContent] = useState("");
  const [creatingNewChat, setCreatingNewChat] = useState(false);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const trimmedUserMessageContent = userMessageContent.trim();

      if (creatingNewChat || trimmedUserMessageContent.length < 1) {
        return;
      }

      const userMessage: ChatCompletionUserMessageParam = {
        content: trimmedUserMessageContent,
        role: "user",
      };

      setCreatingNewChat(true);

      const [name, chatCompletion] = await Promise.all([
        createChatName(trimmedUserMessageContent),
        getGroqChatCompletion([userMessage]),
      ]);

      const chat = await createNewChat(userId, name);

      await saveUserAndAssistantMessages(
        userMessage,
        chatCompletion.choices[0].message,
        chat.id
      );

      router.push(`chat/${chat.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={submit}>
      <MessageInput
        placeholder="Message Apollo"
        name="user-message-content"
        rows={1}
        minRows={1}
        maxRows={10}
        disableButton={userMessageContent.trim().length < 1}
        disabled={creatingNewChat}
        loading={creatingNewChat}
        value={userMessageContent}
        onChange={(e) => {
          if (creatingNewChat) {
            return;
          }

          setUserMessageContent(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            submit(e);
          }
        }}
      />
    </form>
  );
}
