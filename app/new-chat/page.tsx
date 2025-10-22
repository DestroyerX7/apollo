import NewChatMessageInput from "@/components/NewChatMessageInput";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

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
    <div className="flex">
      <Sidebar user={data.user} />

      <div className="flex flex-col justify-center w-1/2 mx-auto gap-8">
        <div className="flex items-center justify-center gap-4">
          <Image src="/apollo.png" alt="Apollo" width={32} height={32} />

          <h1 className="font-bold text-2xl">How can I help you?</h1>
        </div>

        <NewChatMessageInput userId={data.user.id} />
      </div>
    </div>
  );
}
