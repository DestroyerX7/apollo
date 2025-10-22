import LoginCard from "@/components/LoginCard";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Login - Apollo",
  description: "Login to your Apollo account.",
};

export default async function Login() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (data) {
    redirect("/new-chat");
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-1/4">
        <LoginCard />
      </div>

      <Toaster />
    </div>
  );
}
