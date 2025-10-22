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
import { FaClipboardQuestion } from "react-icons/fa6";
import { BsLightningFill } from "react-icons/bs";
import { MdOutlineSaveAlt } from "react-icons/md";
import Image from "next/image";

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
      <Header isLoggedIn={data !== null} />

      <div className="my-16 mx-32 text-center space-y-8">
        <h1 className="text-8xl font-bold font-serif">Welcome to Apollo</h1>

        <p className="text-4xl mb-32">
          Apollo is an AI safety and research company. We build reliable,
          interpretable, and steerable AI systems.
        </p>

        <p className="text-4xl">Here are some of its amazing capabilites</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mx-32 mb-32">
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

      <div className="flex rounded-2xl overflow-hidden items-stretch bg-secondary mx-32 mb-32">
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
            My name is Blake Ojera, the senior developer behind Apollo. It has
            been a pleasure to be apart of this ground breaking work that we
            have been able to do.
          </h1>

          <p>
            I&apos;m a computer science student at CU Boulder with a strong
            interest in technology and problem-solving. I enjoy building and
            experimenting with software projects — right now, I&apos;m working
            on a 2D game in Unity and a web app that integrates the Spotify Web
            Playback SDK. Outside of programming, I like staying active and
            challenging myself at the gym; one of my current fitness goals is to
            increase my bench press to 225 pounds. I also enjoy exploring new
            FPS games, and learning about how emerging technologies like AI are
            shaping the world around us.
          </p>
        </div>
      </div>

      {/* Goal */}

      {/* Tools used */}
    </>
  );
}
