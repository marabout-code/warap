"use client";

import { useRef, useState, useCallback } from "react";

interface PinInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  showToggle?: boolean;
}

export default function PinInput({
  name,
  value,
  onChange,
  maxLength = 6,
  disabled = false,
  autoFocus = false,
  showToggle = true,
}: PinInputProps) {
  const digits = value.split("");
  const [show, setShow] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback(
    (index: number) => {
      const next = inputsRef.current[index];
      if (next) {
        next.focus();
        next.select();
      }
    },
    []
  );

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const raw = input.replace(/\D/g, "");

      if (raw.length > 1) {
        // Pasted multiple characters
        const chars = raw.slice(0, maxLength).split("");
        const newDigits = [...digits];
        chars.forEach((char, i) => {
          if (index + i < maxLength) newDigits[index + i] = char;
        });
        const newVal = newDigits.join("").slice(0, maxLength);
        onChange(newVal);
        const nextIndex = Math.min(index + chars.length, maxLength - 1);
        setTimeout(() => focusInput(nextIndex), 0);
        return;
      }

      const newDigits = [...digits];
      newDigits[index] = raw;
      const newVal = newDigits.join("");
      onChange(newVal);

      if (raw && index < maxLength - 1) {
        setTimeout(() => focusInput(index + 1), 0);
      }
    },
    [digits, maxLength, onChange, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!digits[index] && index > 0) {
          const newDigits = [...digits];
          newDigits[index - 1] = "";
          onChange(newDigits.join(""));
          setTimeout(() => focusInput(index - 1), 0);
        } else {
          const newDigits = [...digits];
          newDigits[index] = "";
          onChange(newDigits.join(""));
        }
        e.preventDefault();
      } else if (e.key === "ArrowLeft" && index > 0) {
        setTimeout(() => focusInput(index - 1), 0);
      } else if (e.key === "ArrowRight" && index < maxLength - 1) {
        setTimeout(() => focusInput(index + 1), 0);
      } else if (e.key === "Delete") {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    },
    [digits, maxLength, onChange, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, maxLength);
      if (pasted) {
        const newDigits = pasted.split("");
        const result = new Array(maxLength).fill("");
        newDigits.forEach((char, i) => {
          result[i] = char;
        });
        onChange(result.join(""));
        const nextIndex = Math.min(pasted.length, maxLength - 1);
        setTimeout(() => focusInput(nextIndex), 0);
      }
    },
    [maxLength, onChange, focusInput]
  );

  return (
    <div className="relative">
      <input
        type="hidden"
        name={name}
        value={value}
      />
      <div className="flex justify-center gap-3">
        {Array.from({ length: maxLength }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type={show ? "text" : "password"}
            inputMode={show ? undefined : "numeric"}
            maxLength={1}
            autoFocus={autoFocus && i === 0}
            disabled={disabled}
            value={digits[i] || ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`h-14 w-12 rounded-xl border-2 bg-white text-center text-xl font-bold tracking-widest text-slate-900 shadow-sm transition-all duration-200 outline-none
              focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:shadow-glow
              disabled:opacity-50 disabled:cursor-not-allowed
              ${digits[i] ? "border-primary-400 bg-primary-50/30" : "border-slate-200 hover:border-slate-300"}
              sm:h-16 sm:w-14`}
          />
        ))}
      </div>
      {showToggle && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          className="mx-auto mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-primary-600 disabled:opacity-50"
        >
          {show ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          {show ? "Masquer le PIN" : "Afficher le PIN"}
        </button>
      )}
    </div>
  );
}