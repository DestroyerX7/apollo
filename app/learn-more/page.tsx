import Header from "@/components/Header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { FaClipboardQuestion, FaGithub, FaReact } from "react-icons/fa6";
import { BsLightningFill } from "react-icons/bs";
import { MdOutlineSaveAlt } from "react-icons/md";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  SiCloudinary,
  SiGooglecloud,
  SiNextdotjs,
  SiPrisma,
  SiShadcnui,
  SiTypescript,
} from "react-icons/si";

export const metadata: Metadata = {
  title: "Learn More - Apollo",
  description: "Learn more about Apollo.",
};

export default async function LearnMore() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header isLoggedIn={data !== null} />
      </div>

      <div className="mx-32 my-16 space-y-32">
        <div className="text-center space-y-8">
          <h1 className="text-8xl font-bold font-serif">Welcome to Apollo</h1>

          <p className="text-4xl">
            Apollo is an AI safety and research company. We build reliable,
            interpretable, and steerable AI systems.
          </p>
        </div>

        <div className="space-y-16">
          <p className="text-4xl text-center">
            Here are some of its amazing capabilites
          </p>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <h1>Ask questions </h1>
                  <FaClipboardQuestion />
                </CardTitle>

                <CardDescription>
                  Ask Apollo questions about any topic
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <h1>Get fast responses</h1>
                  <BsLightningFill />
                </CardTitle>

                <CardDescription>
                  Ask Apollo questions about any topic
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <h1>Save chats</h1>
                  <MdOutlineSaveAlt />
                </CardTitle>

                <CardDescription>
                  Save your chats so you can come back to them in the future
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="flex rounded-2xl overflow-hidden items-stretch bg-secondary">
          <div className="relative w-full">
            <Image
              src="/SeniorPicture.jpg"
              alt="Blake Picture"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 
            (max-width: 1024px) 75vw, 
            50vw"
            />
          </div>

          <div className="p-16 space-y-4">
            <h1 className="text-2xl font-bold">
              My name is Blake Ojera and i&apos;m the Senior Developer behind
              Apollo. It has been a pleasure to be apart of this ground breaking
              work that we have been able to do.
            </h1>

            <p>
              I&apos;m a computer science student at CU Boulder with a strong
              interest in technology and problem-solving. I enjoy building and
              experimenting with software projects — right now, I&apos;m working
              on a 2D game in Unity and a web app that integrates the Spotify
              Web Playback SDK. Outside of programming, I like staying active
              and challenging myself at the gym; one of my current fitness goals
              is to increase my bench press to 225 pounds. I also enjoy
              exploring new FPS games, and learning about how emerging
              technologies like AI are shaping the world around us.
            </p>

            <Button asChild>
              <Link href="https://github.com/DestroyerX7" target="_blank">
                <FaGithub /> My GitHub
              </Link>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Purpose */}
        <div className="grid [grid-template-columns:1fr_3fr] gap-y-32">
          <h1 className="text-4xl font-bold font-serif whitespace-nowrap">
            Our Purpose
          </h1>

          <p className="text-6xl font-bold">
            We believe AI will have a vast impact on the world. Apollo is
            dedicated to building systems that people can rely on and generating
            research about the opportunities and risks of AI.
          </p>
        </div>

        <Separator />

        {/* Gaol */}
        <div className="grid [grid-template-columns:1fr_3fr] gap-y-32">
          <h1 className="text-4xl font-bold font-serif whitespace-nowrap">
            Goals
          </h1>

          <p className="text-6xl font-bold">
            Our goal is to continuously upadte Apollo to make the user
            experience as streamlined as possile.
          </p>
        </div>

        <Separator />

        {/* Tools used */}
        <div className="prose max-w-none">
          <h1>Tools used</h1>

          <table>
            <thead>
              <tr>
                <th>Tool</th>
                <th>Description</th>
                <th>How it's used</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link
                    href="https://nextjs.org/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <SiNextdotjs /> <p>Next.js</p>
                  </Link>
                </td>
                <td>The React Framework for the Web</td>
                <td>Base framework used to build the entire website</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://ui.shadcn.com/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <SiShadcnui /> <p>Shadcn</p>
                  </Link>
                </td>
                <td>
                  A set of beautifully designed components that you can
                  customize, extend, and build on. Start here then make it your
                  own. Open Source. Open Code.
                </td>
                <td>Used to make the website look good with consistent UI</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://www.better-auth.com/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <Image
                      src="/better-auth-logo.png"
                      width={16}
                      height={16}
                      alt="Better Auth Logo"
                    />
                    <p>Better Auth</p>
                  </Link>
                </td>
                <td>
                  The most comprehensive authentication framework for
                  TypeScript.
                </td>
                <td>Securely authenticates the user</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://neon.com/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <Image
                      src="/neon-logo.png"
                      width={16}
                      height={16}
                      alt="Neon Logo"
                    />
                    <p>Neon</p>
                  </Link>
                </td>
                <td>
                  The database developers trust, on a serverless platform
                  designed to help you build reliable and scalable applications
                  faster.
                </td>
                <td>Stores all user and chat data in a PostgreSQL database</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://groq.com/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <Image
                      src="/groq-logo.png"
                      width={16}
                      height={16}
                      alt="Groq Logo"
                    />
                    <p>Groq</p>
                  </Link>
                </td>
                <td>
                  Groq delivers fast, low cost inference that doesn't flake when
                  things get real.
                </td>
                <td>
                  Uses openai/gpt-oss-20b model to get llm responses and
                  reasoning
                </td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://www.prisma.io/orm"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <SiPrisma /> <p>Prisma ORM</p>
                  </Link>
                </td>
                <td>
                  Prisma ORM unlocks a new level of developer experience when
                  working with databases thanks to its intuitive data model,
                  automated migrations, type-safety & auto-completion.
                </td>
                <td>Creates database schema and talks with the database</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://www.typescriptlang.org/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <SiTypescript className="text-blue-500" /> <p>TypeScript</p>
                  </Link>
                </td>
                <td>
                  TypeScript is a strongly typed programming language that
                  builds on JavaScript, giving you better tooling at any scale.
                </td>
                <td>Language the entire website was coded in</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://react-icons.github.io/react-icons/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <FaReact className="text-rose-500 animate-spin [animation-duration:5s]" />
                    <p>React Icons</p>
                  </Link>
                </td>
                <td>
                  Include popular icons in your React projects easily with
                  react-icons, which utilizes ES6 imports that allows you to
                  include only the icons that your project is using.
                </td>
                <td>Shows simple icons</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://cloudinary.com/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <SiCloudinary className="text-blue-700" /> <p>Cloudinary</p>
                  </Link>
                </td>
                <td>
                  Create, manage, and deliver dynamic visual experiences. Manage
                  rich-media assets, streamline workflows, and deliver superior
                  customer experience on one dynamic platform.
                </td>
                <td>Stores user image</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://cloud.google.com/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <SiGooglecloud /> <p>Google Cloud</p>
                  </Link>
                </td>
                <td>
                  Build with the cloud platform designed for developers and AI
                </td>
                <td>Used for Google OAuth to sign up and login</td>
              </tr>

              <tr>
                <td>
                  <Link
                    href="https://github.com/"
                    className="flex items-center gap-2 no-underline"
                    target="_blank"
                  >
                    <FaGithub /> <p>GitHub</p>
                  </Link>
                </td>
                <td>
                  The complete developer platform to build, scale, and deliver
                  secure software.
                </td>
                <td>Used for GitHub OAuth to sign up and login</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
