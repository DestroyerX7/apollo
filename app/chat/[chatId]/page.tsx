import CustomSidebar from "@/components/CustomSidebar";
import ChatInteractionSection from "@/components/ChatInteractionSection";
import { getChat } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

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
    <SidebarProvider>
      <CustomSidebar user={data.user} selectedChatId={chatId} />

      <div className="w-full px-4 pt-4 min-h-screen">
        <SidebarTrigger className="cursor-pointer fixed bg-primary-foreground" />

        <div className="max-w-3xl mx-auto h-full">
          <ChatInteractionSection chatId={chatId} />
        </div>

        <Toaster />
      </div>
    </SidebarProvider>
  );
}
