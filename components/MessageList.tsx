import ReactMarkdown from "react-markdown";
import { Separator } from "./ui/separator";
import CopyButton from "./CopyButton";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import React from "react";
import { ChatCompletionMessageParam } from "groq-sdk/resources/chat.mjs";

type Props = {
  messages: ChatCompletionMessageParam[];
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

export default function MessageList({ messages }: Props) {
  return (
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
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              code: ({ children, className, ...props }) => {
                const blockCode = className && className.includes("language-");

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
            {message.content?.toString()}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
