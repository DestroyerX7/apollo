import { getChatMessages } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await getChatMessages(chatId); //fetch(`/api/chats/${chatId}/messages`);
      //   if (!res.ok) throw new Error("Failed to fetch messages");
      return res; // [{ id, role, content }]
    },
  });
}
