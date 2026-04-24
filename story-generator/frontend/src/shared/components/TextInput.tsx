interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  disabled,
  className = '',
  children,
}: TextInputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full border border-edge rounded-lg px-3 py-2.5 text-sm text-ink bg-surface placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {children}
      </div>
    </div>
  );
}
