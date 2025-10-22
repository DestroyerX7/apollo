type Props = {
  messages: string[];
};

export default function MessageList({ messages }: Props) {
  return (
    <>
      {messages.map((message) => {
        <p key={crypto.randomUUID()}>{message}</p>;
      })}
    </>
  );
}
