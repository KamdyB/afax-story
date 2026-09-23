import { ArrowRight } from "lucide-react";

interface ChoiceButtonProps {
  label: string;
  hint?: string | undefined;
  onSelect: () => void;
}

/** A deliberate interaction point: label + hint, directional affordance. */
export default function ChoiceButton({ label, hint, onSelect }: ChoiceButtonProps) {
  return (
    <button type="button" className="choice-button" onClick={onSelect}>
      <span className="choice-button__text">
        <span className="choice-button__label">{label}</span>
        {hint ? <span className="choice-button__hint">{hint}</span> : null}
      </span>
      <ArrowRight
        className="choice-button__arrow"
        size={18}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  );
}
