import type { StoryMessage } from "../data/story";
import { Forward, Play } from "lucide-react";
import VoiceNote from "./VoiceNote";

interface MessageBubbleProps {
  message: StoryMessage;
}

/** Deterministic pseudo-waveform so bars never reshuffle between renders. */
function barHeight(index: number): string {
  const wave = Math.abs(Math.sin(index * 1.7)) * 0.7 + Math.abs(Math.sin(index * 0.6)) * 0.3;
  return `${Math.round(30 + wave * 70)}%`;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const initial = message.sender.charAt(0).toUpperCase();

  // For voice messages the body doubles as the transcript unless the
  // audio object carries a dedicated one (e.g. in another language).
  const transcript = message.audio
    ? (message.audio.transcript ?? message.body)
    : message.body;
     

  return (
    <figure
      className={`message-bubble${message.channel ? " message-bubble--channel" : ""}`}
    >
      {message.channel ? null : (
        <span className="message-bubble__avatar" aria-hidden="true">
          {initial}
        </span>
      )}
      <div className="message-bubble__main">
        {message.channel ? (
          <p className="message-bubble__channel-tag" aria-hidden="true">
            {message.sender}
          </p>
        ) : (
          <figcaption className="message-bubble__meta">
            <span className="message-bubble__sender">{message.sender}</span>
            {message.meta ? (
              <span className="message-bubble__meta-info">{message.meta}</span>
            ) : null}
          </figcaption>
        )}
        {message.forwarded ? (
          <p className="message-bubble__flag">
            <Forward size={12} strokeWidth={2} aria-hidden="true" />
            Forwarded
          </p>
        ) : null}
        {message.audio ? <VoiceNote audio={message.audio} /> : null}
        {/* Visual-only placeholder used when a message is a voice note
            but no recording exists yet. */}
        {!message.audio && message.voice ? (
          <div className="message-bubble__voice" role="img" aria-label="Voice note (placeholder)">
            <span className="message-bubble__voice-icon" aria-hidden="true">
              <Play size={13} strokeWidth={2.25} />
            </span>
            <span className="message-bubble__wave" aria-hidden="true">
              {Array.from({ length: 26 }, (_, index) => (
                <span
                  key={index}
                  className="message-bubble__wave-bar"
                  style={{ height: barHeight(index) }}
                />
              ))}
            </span>
          </div>
        ) : null}
        {transcript ? (
          <p className="message-bubble__transcript" lang={message.audio?.language}>
            {transcript}
          </p>
        ) : null}
      </div>
    </figure>
  );
}
