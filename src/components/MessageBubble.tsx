import type { StoryMessage } from "../data/story";

interface MessageBubbleProps {
  message: StoryMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <figure className="message-bubble">
      <figcaption className="message-bubble__meta">
        <span className="message-bubble__sender">{message.sender}</span>
        {message.meta ? <span>{message.meta}</span> : null}
      </figcaption>
      <blockquote className="message-bubble__body">
        <p>{message.body}</p>
      </blockquote>
    </figure>
  );
}
