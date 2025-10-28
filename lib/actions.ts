"use server";

import Groq from "groq-sdk";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "groq-sdk/resources/chat.mjs";
import { prisma } from "./auth";
import { v2 as cloudinary } from "cloudinary";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
### System
You are a helpful assistant named Apollo. 

### Context
This is a chatbot website called Apollo created by Blake Ojera. The tools used to make this website include Next.js 15, Shadcn, Better Auth, Neon for the database, Prisma, Groq API, and TypeScript. Blake Ojera is a sophomore at CU Boulder studying computer-science. He enjoys chess, coding, football, video games, and going to the gym.
`;

const maxMessagesLength = 10;
const maxCompletionTokens = 2500;
const reasoningEffort = "low";

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
    max_completion_tokens: maxCompletionTokens,
    reasoning_effort: reasoningEffort,
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
    max_completion_tokens: maxCompletionTokens,
    reasoning_effort: reasoningEffort,
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
    max_completion_tokens: maxCompletionTokens,
    reasoning_effort: reasoningEffort,
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

export const updateImage = async (imageUrl: string, userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image: imageUrl,
    },
  });
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryUploadResponse = {
  // public_id: string;
  // version: number;
  // signature: string;
  // width: number;
  // height: number;
  // format: string;
  // resource_type: string;
  // created_at: string;
  // tags: string[];
  // bytes: number;
  // type: string;
  // etag: string;
  // placeholder: boolean;
  // url: string;
  secure_url: string;
};

export const uploadImage = async (
  file: File,
  previousImageUrl: string | null | undefined
): Promise<string> => {
  if (!file) throw new Error("No file provided");

  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Helper function to upload buffer to Cloudinary
  const streamUpload = (buffer: Buffer): Promise<CloudinaryUploadResponse> =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "apollo-uploads",
          transformation: [
            { width: 2048, height: 2048, crop: "limit" }, // limits max size
          ],
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      stream.end(buffer);
    });

  const result = await streamUpload(buffer);

  if (previousImageUrl && previousImageUrl.includes("apollo-uploads/")) {
    deleteImageByUrl(previousImageUrl);
  }

  return result.secure_url;
};

const deleteImageByUrl = async (url: string) => {
  const publicId = getPublicIdFromUrl(url);

  await cloudinary.uploader.destroy(publicId, (error /*, result*/) => {
    if (error) {
      throw error;
    }
  });
};

const getPublicIdFromUrl = (url: string) => {
  const publicIdWithExt = url.substring(url.indexOf("apollo-uploads/"));
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension
  return publicId;
};

export const deleteChat = async (chatId: string) => {
  await prisma.chat.delete({ where: { id: chatId } });
};

export const renameChat = async (name: string, chatId: string) => {
  await prisma.chat.update({
    where: { id: chatId },
    data: { name },
  });
};
