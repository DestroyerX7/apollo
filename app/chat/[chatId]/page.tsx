import Sidebar from "@/components/Sidebar";
import ChatInteractionSection from "@/components/ChatInteractionSection";
import { getChat } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  params: { chatId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chatId } = await params;

  const chat = await getChat(chatId);

  if (!chat?.name) {
    return {
      title: `Apollo`,
      description: `Chat with Apollo.`,
    };
  }

  return {
    title: `${chat.name} - Apollo`,
    description: `Chat with Apollo.`,
  };
}

export default async function Chat({ params }: Props) {
  const { chatId } = await params;

  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <Sidebar user={data.user} selectedChatId={chatId} />
      <ChatInteractionSection chatId={chatId} />
    </div>
  );
}
