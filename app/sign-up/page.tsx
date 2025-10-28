import SignUpCard from "@/components/SignUpCard";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sign up - Apollo",
  description: "Sign up to create an Apollo account.",
};

export default async function SignUp() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (data) {
    redirect("/new-chat");
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="w-sm">
        <SignUpCard />
      </div>

      <Toaster />
    </div>
  );
}
