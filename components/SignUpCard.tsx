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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { MdOutlineEmail } from "react-icons/md";
import ShowPasswordInput from "./ShowPasswordInput";

const signUpFormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password cannot exceed 128 characters" }),
  confirmPassword: z.string(),
});

export default function SignUpCard() {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const signUpWithEmail = async (values: z.infer<typeof signUpFormSchema>) => {
    try {
      const { email, password, confirmPassword } = values;

      if (password !== confirmPassword) {
        toast.error("Passwords do not match", { position: "top-center" });
        return;
      }

      await authClient.signUp.email({
        email,
        password,
        name: "",
        fetchOptions: {
          onRequest: () => {
            toast.dismiss();
            toast.loading("Signing up...", { position: "top-center" });
          },
          onSuccess: () => {
            toast.dismiss();
            toast.success("Sign up successful!", { position: "top-center" });
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

  const signUpWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const signUpWithGitHub = async () => {
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
        <CardTitle>Sign up</CardTitle>

        <CardDescription>
          Create an Apollo account to save your chats
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(signUpWithEmail)}
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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ShowPasswordInput
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full cursor-pointer" type="submit">
              Sign Up
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <p className="text-sm">OR</p>
              <Separator className="flex-1" />
            </div>

            <Button
              className="w-full cursor-pointer"
              onClick={signUpWithGoogle}
              type="button"
              variant="outline"
            >
              <FcGoogle /> Sign up with Google
            </Button>

            <Button
              className="w-full cursor-pointer"
              onClick={signUpWithGitHub}
              type="button"
              variant="outline"
            >
              <FaGithub /> Sign up with GitHub
            </Button>

            <p className="text-center text-muted-foreground">
              Already have an account?{" "}
              <Link className="text-primary underline" href="/login">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
