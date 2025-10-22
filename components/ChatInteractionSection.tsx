"use client";

import {
  getChatMessages,
  // getGroqChatCompletion,
  getGroqChatStream,
  saveUserAndAssistantMessages,
} from "@/lib/actions";
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionChunk,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "groq-sdk/resources/chat.mjs";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-light.css";
import { Separator } from "./ui/separator";
import { Stream } from "groq-sdk/lib/streaming.mjs";
import MessageInput from "./MessageInput";
import CopyButton from "./CopyButton";

type Props = {
  chatId: string;
};

const getTextFromReactNode = (children: React.ReactNode): string => {
  if (typeof children === "string") return children;
  if (typeof children === "number") return children.toString();
  if (Array.isArray(children))
    return children.map(getTextFromReactNode).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    const props = children.props;
    return getTextFromReactNode(props.children);
  }
  return "";
};

export default function ChatInteractionSection({ chatId }: Props) {
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chatMessages = await getChatMessages(chatId);

        const chatCompletionMessageParams: ChatCompletionMessageParam[] =
          chatMessages.map(({ role, content }) => {
            if (role == "user" || role == "assistant" || role == "system") {
              return {
                role,
                content,
              };
            }

            return {
              role: "user",
              content,
            };
          });

        setMessages(chatCompletionMessageParams);

        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.log(error);
      }
    };

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role == "user") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const submit = async (userMessageContent: string) => {
    try {
      const userMessage: ChatCompletionUserMessageParam = {
        role: "user",
        content: userMessageContent,
      };

      setMessages((prev) => [...prev, userMessage]);

      const stream = await getGroqChatStream([...messages, userMessage]);

      await Promise.all([
        (async () => {
          const assistantMessage = await readStream(stream);

          await saveUserAndAssistantMessages(
            userMessage,
            assistantMessage,
            chatId
          );
        })(),
        setMessagesWithStream(stream, userMessage),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  // const setMessagesWithoutStream = async (
  //   userMessage: ChatCompletionUserMessageParam
  // ) => {
  //   try {
  //     const chatCompletion = await getGroqChatCompletion([
  //       ...messages,
  //       userMessage,
  //     ]);

  //     setMessages((prev) => [...prev, chatCompletion.choices[0].message]);

  //     await saveUserAndAssistantMessages(
  //       userMessage,
  //       chatCompletion.choices[0].message,
  //       chatId
  //     );
  //   } catch (erorr) {
  //     console.log(erorr);
  //   }
  // };

  const setMessagesWithStream = async (
    stream: Stream<ChatCompletionChunk>,
    userMessage: ChatCompletionUserMessageParam
  ) => {
    const assistantMessage: ChatCompletionAssistantMessageParam = {
      role: "assistant",
      content: "",
      reasoning: "",
    };

    const updatedMessages = [...messages, userMessage];
    let lastUpdate = Date.now();

    for await (const chunk of stream) {
      if (chunk.choices[0].delta.content) {
        assistantMessage.content += chunk.choices[0].delta.content;
      }

      if (chunk.choices[0].delta.reasoning) {
        assistantMessage.reasoning += chunk.choices[0].delta.reasoning;
      }

      // await new Promise((resolve) => setTimeout(resolve, 10));

      const now = Date.now();
      if (now - lastUpdate > 50) {
        setMessages([...updatedMessages, assistantMessage]);
        lastUpdate = now;
      }
    }

    setMessages([...updatedMessages, assistantMessage]);
  };

  const readStream = async (stream: Stream<ChatCompletionChunk>) => {
    const assistantMessage: ChatCompletionAssistantMessageParam = {
      role: "assistant",
      content: "",
      reasoning: "",
    };

    for await (const chunk of stream) {
      if (chunk.choices[0].delta.content) {
        assistantMessage.content += chunk.choices[0].delta.content;
      }

      if (chunk.choices[0].delta.reasoning) {
        assistantMessage.reasoning += chunk.choices[0].delta.reasoning;
      }
    }

    return assistantMessage;
  };

  return (
    <div className="flex flex-col w-1/2 mx-auto min-h-screen gap-32 p-4">
      <div className="flex-1">
        <div className="prose max-w-full">
          {messages.map((message) => {
            if (message.role == "user") {
              return (
                <div
                  className="flex justify-end not-prose"
                  key={crypto.randomUUID()}
                >
                  <div className="flex flex-col items-end gap-1">
                    <p className="bg-secondary rounded p-4 whitespace-pre-wrap">
                      {message.content.toString()}
                    </p>

                    <CopyButton text={message.content.toString()} />
                  </div>
                </div>
              );
            }

            return (
              <ReactMarkdown
                key={crypto.randomUUID()}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  code: ({ children, className, ...props }) => {
                    const blockCode =
                      className && className.includes("language-");

                    if (blockCode) {
                      return (
                        <div>
                          <div className="flex justify-between">
                            <p>{className.replace("hljs language-", "")}</p>

                            <CopyButton text={getTextFromReactNode(children)} />
                          </div>
                          <code {...props}>{children}</code>;
                        </div>
                      );
                    }

                    return (
                      <code
                        className="[&::before]:content-none [&::after]:content-none bg-muted rounded p-1"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children, ...props }) => (
                    <pre
                      className="not-prose text-sm bg-muted rounded p-4 overflow-x-auto"
                      {...props}
                    >
                      {children}
                    </pre>
                  ),
                  hr: () => <Separator />,
                }}
              >
                {message.content?.toString()}
              </ReactMarkdown>
            );
          })}
        </div>

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-4 ">
        <MessageInput onSubmit={submit} />
      </div>
    </div>
  );
}
