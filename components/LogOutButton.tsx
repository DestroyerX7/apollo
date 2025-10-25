"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogOutButton({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const logOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={className} onClick={logOut} {...props}>
      {children}
    </div>
  );
}
