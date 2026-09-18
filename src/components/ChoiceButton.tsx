interface ChoiceButtonProps {
  label: string;
  hint?: string | undefined;
  onSelect: () => void;
}

export default function ChoiceButton({ label, hint, onSelect }: ChoiceButtonProps) {
  return (
    <button type="button" className="choice-button" onClick={onSelect}>
      <span className="choice-button__label">{label}</span>
      {hint ? <span className="choice-button__hint">{hint}</span> : null}
    </button>
  );
}
