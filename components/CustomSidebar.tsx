"use client";

import { Chat } from "@/generated/prisma";
import {
  deleteChat,
  getChats,
  updateImage,
  updateName,
  uploadImage,
} from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  IoAddCircle,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoEllipsisHorizontalSharp,
} from "react-icons/io5";
// import ChatList from "./ChatList";
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
// import LogOutButton from "./LogOutButton";
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
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  ArrowUpRight,
  MoreHorizontal,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import { MdLogout } from "react-icons/md";
import { authClient } from "@/lib/auth-client";
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

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_WEBSITE_URL
    : "http://localhost:3000/";

export default function CustomSidebar({ user, selectedChatId }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  // const [profileData, setProfileData] = useState({ name: user.name });
  const router = useRouter();

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

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const target = e.target as typeof e.target & {
        file: { files: FileList };
        name: { value: string };
      };

      const name = target.name.value;

      if (name.trim() !== user.name) {
        await updateName(name.trim(), user.id);
      }

      const file = target.file.files[0];

      if (file) {
        const url = await uploadImage(file, user.image);
        await updateImage(url, user.id);
      }

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const copyLink = async (link: string) => {
    await navigator.clipboard.writeText(link);
  };

  const deleteChatClient = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

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
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="flex items-center gap-2 p-2">
              <Image src="/apollo.png" alt="Apollo" width={32} height={32} />
              <h1 className="font-bold text-2xl">Apollo</h1>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-primary hover:text-primary"
              asChild
            >
              <Link href="/new-chat">
                <IoAddCircle />
                <span>New chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chats</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    className={selectedChatId === chat.id ? "bg-accent" : ""}
                    asChild
                  >
                    <Link href={`/chat/${chat.id}`}>
                      <span>{chat.name}</span>
                    </Link>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction className="cursor-pointer" showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-32">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => copyLink(baseUrl + `chat/${chat.id}`)}
                      >
                        <LinkIcon className="text-muted-foreground" />
                        <span>Copy Link</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href={baseUrl + `chat/${chat.id}`}
                          target="_blank"
                        >
                          <ArrowUpRight className="text-muted-foreground" />
                          <span>New Tab</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => deleteChatClient(chat.id)}
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="focus-visible:ring-0 cursor-pointer"
                  asChild
                >
                  <SidebarMenuButton size="lg">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={user.image || ""} alt="@shadcn" />
                        <AvatarFallback>
                          <FaUserCircle className="w-full h-full" />
                        </AvatarFallback>
                      </Avatar>

                      <p className="text-sm">{user.name || "User"}</p>
                    </div>

                    <IoEllipsisHorizontalSharp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="top"
                  className="w-(--radix-dropdown-menu-trigger-width)"
                >
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/learn-more">
                        <IoHelpCircleOutline />
                        <span>Learn more</span>
                      </Link>
                    </DropdownMenuItem>

                    <DialogTrigger asChild>
                      <DropdownMenuItem className="cursor-pointer">
                        <IoSettingsOutline />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={logOut}
                    >
                      <MdLogout />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Label htmlFor="file" className="mb-2">
                    Image
                  </Label>
                  <Input type="file" name="file" id="file" className="mb-4" />

                  <Label htmlFor="name" className="mb-2">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    name="name"
                    defaultValue={user.name}
                    className="mb-4"
                    // value={profileData.name}
                    // onChange={(e) => setProfileData({ name: e.target.value })}
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
                      // onClick={editProfile}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );

  // return (
  //   <div className="sticky top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar overflow-y-auto flex flex-col">
  //     <div className="sticky top-0 bg-sidebar p-2 space-y-4">
  //       <Link href="/" className="flex items-center gap-2 p-2">
  //         <Image src="/apollo.png" alt="Apollo" width={32} height={32} />
  //         <h1 className="font-bold text-2xl">Apollo</h1>
  //       </Link>

  //       <Link
  //         className="flex items-center p-2 hover:bg-accent transition-colors rounded text-primary gap-1 text-sm"
  //         href="/new-chat"
  //       >
  //         <IoAddCircle className="w-[20] h-[20]" />
  //         <p>New chat</p>
  //       </Link>
  //     </div>

  //     <h1 className="px-4 py-2 text-secondary-foreground text-sm">Chats</h1>

  //     <div className="flex-1 px-2 mb-8">
  //       <ChatList chats={chats} selectedChatId={selectedChatId} />
  //     </div>

  //     <div className="sticky bottom-0 bg-sidebar p-2 border-t border-sidebar-border">
  //       <Dialog>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger
  //             className="hover:bg-gray-200 rounded p-2 cursor-pointer focus:outline-none"
  //             asChild
  //           >
  //             <div className="flex justify-between items-center">
  //               <div className="flex items-center gap-2">
  //                 <Avatar>
  //                   <AvatarImage src={user.image || ""} alt="@shadcn" />
  //                   <AvatarFallback>
  //                     <FaUserCircle className="w-full h-full" />
  //                   </AvatarFallback>
  //                 </Avatar>

  //                 <p className="text-sm">{user.name || "User"}</p>
  //               </div>

  //               <IoEllipsisHorizontalSharp />
  //             </div>
  //           </DropdownMenuTrigger>

  //           <DropdownMenuContent className="w-56">
  //             <DropdownMenuLabel>{user.email}</DropdownMenuLabel>

  //             <DropdownMenuSeparator />

  //             <DropdownMenuGroup>
  //               <Link href="/learn-more">
  //                 <DropdownMenuItem className="cursor-pointer">
  //                   <IoHelpCircleOutline />
  //                   Learn More
  //                 </DropdownMenuItem>
  //               </Link>

  //               <DialogTrigger asChild>
  //                 <DropdownMenuItem className="cursor-pointer">
  //                   <IoSettingsOutline />
  //                   Settings
  //                 </DropdownMenuItem>
  //               </DialogTrigger>
  //             </DropdownMenuGroup>

  //             <DropdownMenuSeparator />

  //             <DropdownMenuGroup>
  //               <LogOutButton className="w-full">
  //                 <DropdownMenuItem className="cursor-pointer">
  //                   <IoLogOutOutline />
  //                   Log out
  //                 </DropdownMenuItem>
  //               </LogOutButton>
  //             </DropdownMenuGroup>
  //           </DropdownMenuContent>
  //         </DropdownMenu>

  //         <DialogContent>
  //           <DialogHeader>
  //             <DialogTitle>Edit profile</DialogTitle>
  //             <DialogDescription>
  //               Make changes to your profile here. Click save when you&apos;re
  //               done.
  //             </DialogDescription>
  //           </DialogHeader>

  //           <form onSubmit={handleSubmit} encType="multipart/form-data">
  //             <Label htmlFor="file" className="mb-2">
  //               Image
  //             </Label>
  //             <Input type="file" name="file" id="file" className="mb-4" />

  //             <Label htmlFor="name" className="mb-2">
  //               Name
  //             </Label>
  //             <Input
  //               id="name"
  //               type="text"
  //               placeholder="Name"
  //               name="name"
  //               defaultValue={user.name}
  //               className="mb-4"
  //               // value={profileData.name}
  //               // onChange={(e) => setProfileData({ name: e.target.value })}
  //             />

  //             <DialogFooter>
  //               <DialogClose asChild>
  //                 <Button className="cursor-pointer" variant="outline">
  //                   Cancel
  //                 </Button>
  //               </DialogClose>
  //               <Button
  //                 className="cursor-pointer"
  //                 type="submit"
  //                 // onClick={editProfile}
  //               >
  //                 Save changes
  //               </Button>
  //             </DialogFooter>
  //           </form>
  //         </DialogContent>
  //       </Dialog>
  //     </div>
  //   </div>
  // );
}
