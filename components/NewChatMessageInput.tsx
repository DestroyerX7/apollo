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
import { useState } from "react";

type Props = {
  userId: string;
};

export default function NewChatMessageInput({ userId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (userMessageContent: string) => {
    try {
      const userMessage: ChatCompletionUserMessageParam = {
        content: userMessageContent,
        role: "user",
      };

      setIsLoading(true);

      const [name, chatCompletion] = await Promise.all([
        createChatName(userMessageContent),
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
    <MessageInput
      onSubmit={submit}
      isLoading={isLoading}
      clearTextOnSubmit={false}
    />
  );
}
