export default function MessageBubble({ message }) {
  return (
    <div className="bg-gray-200 p-2 rounded max-w-[90%]">
      {message.text}
    </div>
  );
}
