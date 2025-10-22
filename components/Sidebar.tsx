"use client";

import { Chat } from "@/generated/prisma";
import { getChats, updateName } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoAddCircle,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import ChatList from "./ChatList";
import { User } from "better-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { IoIosArrowUp, IoMdHelpCircleOutline } from "react-icons/io";
import LogOutButton from "./LogOutButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
// import z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  user: User;
  selectedChatId?: string;
};

// const editProfileFormSchema = z.object({
//   name: z.string().min(1),
// });

export default function Sidebar({ user, selectedChatId }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [profileData, setProfileData] = useState({ name: user.name });

  useEffect(() => {
    const loadChats = async () => {
      try {
        const loadedChats = await getChats(user.id);
        setChats(loadedChats);
      } catch (error) {
        console.log(error);
      }
    };

    loadChats();
  }, [user]);

  // const form = useForm<z.infer<typeof editProfileFormSchema>>({
  //   resolver: zodResolver(editProfileFormSchema),
  //   defaultValues: {
  //     name: user.name,
  //   },
  // });

  // const editProfile = async (values: z.infer<typeof editProfileFormSchema>) => {
  //   console.log(values);
  // };

  const editProfile = async () => {
    try {
      if (profileData.name.trim().length < 1) {
        return;
      }

      await updateName(profileData.name.trim(), user.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sticky top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar p-4 overflow-y-auto flex flex-col">
      <div className="sticky top-0 bg-sidebar space-y-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/apollo.png" alt="Apollo" width={32} height={32} />
          <h1 className="font-bold text-2xl">Apollo</h1>
        </Link>

        <Link
          className="flex items-center p-2 hover:bg-accent transition-colors rounded text-primary gap-1 text-sm"
          href="/new-chat"
        >
          <IoAddCircle className="w-[20] h-[20]" />
          <p>New chat</p>
        </Link>
      </div>

      <h1 className="p-2 text-secondary-foreground text-sm">Chats</h1>

      <div className="flex-1">
        <ChatList chats={chats} selectedChatId={selectedChatId} />
      </div>

      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="hover:bg-gray-200 rounded p-2 cursor-pointer focus:outline-none"
            asChild
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.image || ""} alt="@shadcn" />
                  <AvatarFallback>
                    <FaUserCircle className="w-full h-full" />
                  </AvatarFallback>
                </Avatar>

                <p className="text-sm">{user.name || "User"}</p>
              </div>

              <IoIosArrowUp />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link href="/learn-more">
                <DropdownMenuItem className="cursor-pointer">
                  <IoMdHelpCircleOutline />
                  Learn More
                </DropdownMenuItem>
              </Link>

              <DialogTrigger asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <IoSettingsOutline />
                  Settings
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <LogOutButton className="w-full">
                <DropdownMenuItem className="cursor-pointer">
                  <IoLogOutOutline />
                  Log out
                </DropdownMenuItem>
              </LogOutButton>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            value={profileData.name}
            onChange={(e) => setProfileData({ name: e.target.value })}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="cursor-pointer"
              type="submit"
              onClick={editProfile}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
