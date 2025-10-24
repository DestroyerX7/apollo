import { Chat } from "@/generated/prisma";
import Link from "next/link";

type Props = {
  chats: Chat[];
  selectedChatId?: string;
};
export default function ChatList({ chats, selectedChatId }: Props) {
  return (
    <div className="flex flex-col">
      {chats.map((chat) => (
        <Link
          className={
            "hover:bg-gray-200 transition-colors p-2 rounded truncate text-sm " +
            (selectedChatId === chat.id ? "bg-gray-200" : "")
          }
          href={"/chat/" + chat.id}
          key={chat.id}
        >
          {chat.name}
        </Link>
      ))}
    </div>
  );
}
