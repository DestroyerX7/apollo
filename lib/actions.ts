"use server";

import Groq from "groq-sdk";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "groq-sdk/resources/chat.mjs";
import { prisma } from "./auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
### System
You are a helpful assistant named Apollo. 

### Context
This is a chatbot website called Apollo created by Blake Ojera. The tools used to make this website include Next.js 15, Shadcn, Better Auth, Neon for the database, Prisma, Groq API, and TypeScript. Blake Ojera is a sophomore at CU Boulder studying computer-science. He enjoys chess, coding, football, video games, and going to the gym.
`;

const maxMessagesLength = 10;

export const getGroqChatCompletion = async (
  messages: ChatCompletionMessageParam[]
) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.slice(-maxMessagesLength),
    ],
    model: "openai/gpt-oss-20b",
  });
};

export const getGroqChatStream = async (
  messages: ChatCompletionMessageParam[]
) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.slice(-maxMessagesLength),
    ],
    model: "openai/gpt-oss-20b",
    stream: true,
  });
};

export const createNewChat = async (userId: string, name: string) => {
  return await prisma.chat.create({
    data: {
      userId,
      name,
    },
  });
};

export const createChatName = async (userMessageContent: string) => {
  const titleGeneratorPrompt = `
### System
You are a title generation tool. Return **ONLY** a title.

### Instructions
- Return only a title the summarizes the input.
- Do not include any markdown or explanation.
- The title cannot be more than 10 words long.

### Input
${userMessageContent}
`;

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: titleGeneratorPrompt,
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  return response.choices[0].message.content || "New chat";
};

export const getChats = async (userId: string) => {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
};

export const getChat = async (chatId: string) => {
  return prisma.chat.findUnique({
    where: { id: chatId },
  });
};

export const saveUserAndAssistantMessages = async (
  userMessage: ChatCompletionUserMessageParam,
  assistantMessage: ChatCompletionAssistantMessageParam,
  chatId: string
) => {
  await prisma.message.createMany({
    data: [
      {
        content: userMessage.content.toString(),
        role: userMessage.role,
        chatId,
      },
      {
        content: assistantMessage.content?.toString() || "No content",
        role: assistantMessage.role,
        reasoning: assistantMessage.reasoning,
        chatId,
      },
    ],
  });
};

export const getChatMessages = async (chatId: string) => {
  return await prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
};

export const updateName = async (name: string, userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });
};
