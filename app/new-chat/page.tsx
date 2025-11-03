import NewChatMessageInput from "@/components/NewChatMessageInput";
import CustomSidebar from "@/components/CustomSidebar";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "New Chat - Apollo",
  description: "Start a new chat by messaging Apollo.",
};

export default async function NewChat() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <CustomSidebar user={data.user} />

      <div className="w-full p-4">
        <SidebarTrigger className="fixed cursor-pointer bg-primary-foreground" />

        <div className="h-full flex flex-col justify-center max-w-3xl mx-auto gap-8">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/apollo.png"
              alt="Apollo"
              width={32}
              height={32}
              className="bg-transparent mix-blend-normal"
            />

            <h1 className="font-bold text-2xl">How can I help you?</h1>
          </div>

          <NewChatMessageInput userId={data.user.id} />
        </div>

        <Toaster />
      </div>
    </SidebarProvider>
  );
}
