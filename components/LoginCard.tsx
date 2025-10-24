"use client";

import z from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Separator } from "./ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { MdOutlineEmail } from "react-icons/md";
import ShowPasswordInput from "./ShowPasswordInput";

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export default function LoginCard() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const loginWithEmail = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const { email, password } = values;

      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onRequest: () => {
            toast.dismiss();
            toast.loading("Logging in...", { position: "top-center" });
          },
          onSuccess: () => {
            toast.dismiss();
            toast.success("Login successful!", { position: "top-center" });
            router.push("/new-chat");
          },
          onError: (context) => {
            toast.dismiss();
            toast.error(context.error.message, { position: "top-center" });
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithGitHub = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>

        <CardDescription>
          Login to your Apollo account to access your chats
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(loginWithEmail)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        type="email"
                        placeholder="Email address"
                        {...field}
                      />
                      <InputGroupAddon>
                        <MdOutlineEmail />
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ShowPasswordInput
                      placeholder="Password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p
              className="cursor-pointer text-primary"
              onClick={() =>
                toast("Too bad lol 👈🤣", { position: "top-center" })
              }
            >
              Forgot password?
            </p>

            <Button className="w-full cursor-pointer" type="submit">
              Login
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <p className="text-sm">OR</p>
              <Separator className="flex-1" />
            </div>

            <Button
              className="w-full cursor-pointer"
              onClick={loginWithGoogle}
              type="button"
              variant="outline"
            >
              <FcGoogle /> Login with Google
            </Button>

            <Button
              className="w-full cursor-pointer"
              onClick={loginWithGitHub}
              type="button"
              variant="outline"
            >
              <FaGithub /> Login with GitHub
            </Button>

            <p className="text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link className="text-primary underline" href="/sign-up">
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
