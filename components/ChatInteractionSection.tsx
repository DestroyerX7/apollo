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
import React, { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-light.css";
import { Separator } from "./ui/separator";
import { Stream } from "groq-sdk/lib/streaming.mjs";
import MessageInput from "./MessageInput";
import CopyButton from "./CopyButton";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { User } from "better-auth";
// import MessageList from "./MessageList";

type Props = {
  chatId: string;
  // user: User
};

export default function ChatInteractionSection({ chatId }: Props) {
  const [userMessageContent, setUserMessageContent] = useState("");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chatMessages = await getChatMessages(chatId);

        const chatCompletionMessageParams: ChatCompletionMessageParam[] =
          chatMessages.map(({ content, role }) => {
            return { content, role };
          });

        if (chatCompletionMessageParams.length < 1) {
          router.push("/new-chat");
          return;
        }

        setMessages(chatCompletionMessageParams);

        // Doesn't work
        // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.log(error);

        if (error instanceof Error) {
          toast.error(error.message, { position: "top-center" });
        } else {
          toast.error("An error occured ☹️", { position: "top-center" });
        }
      }
    };

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role == "user") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const submit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const trimmedUserMessageContent = userMessageContent.trim();

      if (isLoading || trimmedUserMessageContent.length < 1) {
        return;
      }

      setUserMessageContent("");

      const userMessage: ChatCompletionUserMessageParam = {
        role: "user",
        content: trimmedUserMessageContent,
        // Maybe do this later
        // name: user.name.length > 0 ? user.name.length : undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const stream = await getGroqChatStream([...messages, userMessage]);
      setIsLoading(false);

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

      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" });
      } else {
        toast.error("An error occured ☹️", { position: "top-center" });
      }
    }
  };

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

  return (
    <div className="flex flex-col h-full gap-32">
      <div className="flex-1">
        <div className="prose max-w-full">
          {messages.map((message) => {
            if (message.role == "user") {
              return (
                <div
                  className="flex justify-end not-prose"
                  key={crypto.randomUUID()}
                >
                  <div className="flex flex-col items-end gap-1 max-w-3/4">
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
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                  rehypeRaw,
                  rehypeHighlight,
                  [
                    rehypeKatex,
                    {
                      macros: {
                        "|": "\\vert", // Does not fix math "|" in tables
                      },
                    },
                  ],
                ]}
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
                          <code {...props}>{children}</code>
                        </div>
                      );
                    }

                    return (
                      <code
                        className="[&::before]:content-none [&::after]:content-none bg-secondary rounded p-1"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children, ...props }) => (
                    <pre
                      className="not-prose text-sm bg-secondary rounded p-4 overflow-x-auto"
                      {...props}
                    >
                      {children}
                    </pre>
                  ),
                  hr: () => <Separator />,
                }}
              >
                {message.content
                  ?.toString()
                  .replace(/\u2011/g, "-")
                  .replace(/\$/g, "&dollar;")
                  .replace(/\\\[/g, "$$$$")
                  .replace(/\\\]/g, "$$$$")
                  .replace(/\\\(/g, "$$")
                  .replace(/\\\)/g, "$$")}
              </ReactMarkdown>
            );
          })}

          {isLoading && <Spinner />}
        </div>

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-primary-foreground rounded-t-2xl">
        <form onSubmit={submit}>
          <MessageInput
            placeholder="Message Apollo"
            name="user-message-content"
            rows={1}
            minRows={1}
            maxRows={10}
            disableButton={userMessageContent.trim().length < 1}
            disabled={isLoading}
            loading={isLoading}
            value={userMessageContent}
            onChange={(e) => {
              if (isLoading) {
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

        <p className="text-center text-sm text-muted-foreground py-2">
          Apollo can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
