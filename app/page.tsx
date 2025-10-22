import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <div className="sticky top-0">
        <Header isLoggedIn={data !== null} />
      </div>

      <div className="mt-16 mx-32 flex items-center">
        <div className="space-y-16">
          <div className="space-y-4">
            <h1 className="text-8xl font-bold font-serif">
              The future of AI is here
            </h1>

            <h2 className="text-4xl">
              Apollo is a modern chatbot website that allows users to ask
              questions and get fast and reliable answers.
            </h2>
          </div>

          <Button
            className="cursor-pointer px-8 py-6 text-lg font-bold rounded-full hover:-translate-y-1 transition-transform shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            asChild
          >
            <Link href="/new-chat">Try Apollo</Link>
          </Button>
        </div>

        <div className="w-full flex justify-center">
          <Image
            src="/ai-chatbot-best-practices.jpg"
            width={750}
            height={750}
            alt="AI chatbot best practices"
            className="w-full h-auto max-w-[750px]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      <div className="mt-32 mx-32 grid grid-cols-2 bg-accent rounded-2xl p-16 gap-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Apollo v1</h1>

          <h2 className="text-2xl">
            Introducing the best model we&apos;ve ever made, better at
            reasoning, coding, math, and more.
          </h2>

          <Button
            className="cursor-pointer //px-8 //py-6 //text-lg //rounded-lg"
            asChild
          >
            <Link href="/learn-more">Learn more</Link>
          </Button>
        </div>
      </div>

      <div className="m-32 p-16 bg-secondary rounded-2xl">
        <h1 className="mb-8 text-2xl font-bold">
          Ask questions about any topic
        </h1>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <p className="max-w-3/4 p-4 bg-secondary rounded">Hello</p>
                </div>

                <p>Hey there! 👋 How can I help you today?</p>

                <div className="flex justify-end">
                  <p className="max-w-3/4 p-4 bg-secondary rounded">
                    Give me 1-2 sentences on how to start my own business
                  </p>
                </div>

                <p>
                  Start by validating a clear market need and defining a unique
                  value proposition, then draft a lean business plan (covering
                  revenue model, target customers, and financial projections).
                  Secure the basics—legal structure, permits, and a working
                  prototype—before launching a minimum-viable product and
                  aggressively acquiring early adopters.
                </p>

                <div className="flex justify-end">
                  <p className="max-w-3/4 p-4 bg-secondary rounded">
                    Thank you!
                  </p>
                </div>

                <p>
                  You&apos;re welcome! Good luck with your venture—feel free to
                  ask if you need more help along the way. 🚀
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <p className="max-w-3/4 p-4 bg-secondary rounded">
                    Write 1-2 sentences on some of the themes in Romeo and
                    Juliet
                  </p>
                </div>

                <p>
                  Romeo and Juliet explores how youthful passion clashes with
                  entrenched family feuds, illustrating the destructive power of
                  hatred and the tragic consequences of impulsive love. The play
                  also underscores the tension between fate and free will,
                  showing how the couple&apos;s doomed destiny is shaped by both
                  personal choices and societal pressures.
                </p>

                <div className="flex justify-end">
                  <p className="max-w-3/4 p-4 bg-secondary rounded">Great!</p>
                </div>

                <p>
                  Glad you liked it! Let me know if you&apos;d like a deeper
                  dive into a particular theme or anything else about the play.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <p className="max-w-3/4 p-4 bg-secondary rounded">
                    Explain Newtons laws to me
                  </p>
                </div>

                <ol className="prose list-decimal list-inside">
                  <li>
                    Objects don&apos;t move on their own - you must apply a
                    force.
                  </li>

                  <li>
                    The amount of force you apply determines how fast the object
                    speeds up or slows down.
                  </li>

                  <li>
                    Forces always come in pairs: whatever force you exert on
                    something, that something exerts the same force back on you.
                  </li>
                </ol>

                <div className="flex justify-end">
                  <p className="max-w-3/4 p-4 bg-secondary rounded">
                    That makes sense
                  </p>
                </div>

                <p>
                  I&apos;m glad it cleared things up! If you want to dig
                  deeper—say, examples in physics, real-world applications, or
                  how these laws connect to other concepts—just let me know.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
