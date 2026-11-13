import { useId, type ComponentProps, type ReactNode } from "react";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  id: string;
  children: ReactNode;
}

function FieldShell({ label, hint, error, required, id, children }: FieldShellProps) {
  return (
    <div className="group">
      <label htmlFor={id} className="t-label mb-2 flex items-baseline justify-between text-[color:var(--muted)]">
        <span>
          {label}
          {required && (
            <span aria-hidden className="text-[color:var(--accent-text)]">
              {" "}
              *
            </span>
          )}
        </span>
        {!required && (
          <span className="normal-case tracking-normal text-[color:var(--muted)]">Optional</span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-[color:var(--muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8125rem] font-medium text-[color:var(--alert)]">
          <span aria-hidden>↳ </span>
          {error}
        </p>
      )}
    </div>
  );
}

const control =
  "w-full border-0 border-b bg-transparent px-0 py-3 text-base text-[color:var(--fg)] " +
  "border-[color:var(--line)] placeholder:text-[color:var(--muted)] " +
  "transition-colors duration-[var(--dur-micro)] " +
  "hover:border-[color:var(--fg)] focus:border-[color:var(--accent-text)] focus:outline-none " +
  "focus-visible:shadow-[0_2px_0_0_var(--accent-text)] aria-[invalid=true]:border-[color:var(--alert)]";

type BaseProps = { label: string; hint?: string; error?: string; required?: boolean };

export function Input({ label, hint, error, required, ...rest }: BaseProps & ComponentProps<"input">) {
  const id = useId();
  return (
    <FieldShell {...{ label, hint, error, required, id }}>
      <input
        id={id}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={[hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined}
        className={control}
        {...rest}
      />
    </FieldShell>
  );
}

export function Textarea({ label, hint, error, required, ...rest }: BaseProps & ComponentProps<"textarea">) {
  const id = useId();
  return (
    <FieldShell {...{ label, hint, error, required, id }}>
      <textarea
        id={id}
        required={required}
        rows={4}
        aria-invalid={!!error || undefined}
        aria-describedby={[hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined}
        className={`${control} resize-y`}
        {...rest}
      />
    </FieldShell>
  );
}

export function Select({
  label,
  hint,
  error,
  required,
  children,
  ...rest
}: BaseProps & ComponentProps<"select">) {
  const id = useId();
  return (
    <FieldShell {...{ label, hint, error, required, id }}>
      <select
        id={id}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={[hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined}
        className={`${control} appearance-none rounded-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat pr-6`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%238a8f96' stroke-width='1.5'><path d='M1 1.5 6 6.5 11 1.5'/></svg>\")",
        }}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}
