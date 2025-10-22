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

type Props = {
  userId: string;
};

export default function NewChatMessageInput({ userId }: Props) {
  const router = useRouter();

  const submit = async (userMessageContent: string) => {
    try {
      const userMessage: ChatCompletionUserMessageParam = {
        content: userMessageContent,
        role: "user",
      };

      const name = await createChatName(userMessageContent);
      const chat = await createNewChat(userId, name);

      const chatCompletion = await getGroqChatCompletion([userMessage]);

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

  return <MessageInput onSubmit={submit} />;
}
