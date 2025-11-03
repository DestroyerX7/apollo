import { Button } from "./ui/button";
import Link from "next/link";
import LogOutButton from "./LogOutButton";
import Image from "next/image";

type Props = {
  isLoggedIn: boolean;
};

export default function Header({ isLoggedIn }: Props) {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-primary-foreground z-50">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/apollo.png"
          width={32}
          height={32}
          alt="Apollo"
          className="bg-transparent mix-blend-normal"
        />
        <h1 className="text-2xl font-bold hidden sm:block ">Apollo</h1>
      </Link>

      <div className="flex items-center gap-4">
        <Button variant="link" asChild>
          <Link href="/learn-more">Learn More</Link>
        </Button>

        {isLoggedIn ? (
          <>
            <Button asChild>
              <Link href="/new-chat">Chat</Link>
            </Button>

            {/* The background color flickers to white the first time you hover over the button on dark mode */}
            {/* This is a problem with the shadcn button not the logout button */}
            <Button className="cursor-pointer" variant="outline" asChild>
              <LogOutButton>Log Out</LogOutButton>
            </Button>
          </>
        ) : (
          <>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
