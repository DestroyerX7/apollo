import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, text }: { chatId: string; text: string }) => {
      return [{ content: "This is the wftyuasfksdj", role: "user" }];
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json(); // { id, content, role }
    },

    onMutate: async ({ chatId, text }) => {
      // Cancel any outgoing refetches for this chat
      await queryClient.cancelQueries({ queryKey: ["chat", chatId] });

      // Snapshot current messages so we can roll back on error
      const prevMessages = queryClient.getQueryData(["chat", chatId]);

      // Create a temporary optimistic message
      const optimisticMsg = {
        id: crypto.randomUUID(),
        content: text,
        role: "user",
        optimistic: true,
      };

      // Optimistically add it to cache
      queryClient.setQueryData(["chat", chatId], (old: any = []) => [
        ...old,
        optimisticMsg,
      ]);

      return { prevMessages, chatId, optimisticId: optimisticMsg.id };
    },

    onSuccess: (newMessage, { chatId }, ctx) => {
      // Replace the optimistic message with the confirmed one
      queryClient.setQueryData(["chat", chatId], (old: any = []) =>
        old.map((m: any) => (m.id === ctx.optimisticId ? newMessage : m))
      );
    },

    onError: (err, { chatId }, ctx) => {
      // Roll back if something fails
      queryClient.setQueryData(["chat", chatId], ctx?.prevMessages);
    },

    onSettled: (_data, _error, { chatId }) => {
      // Optionally refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    },
  });
}
