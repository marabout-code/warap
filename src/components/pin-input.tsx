"use client";

import { useRef, useState, useCallback } from "react";

interface PinInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function PinInput({
  name,
  value,
  onChange,
  maxLength = 6,
  disabled = false,
  autoFocus = false,
}: PinInputProps) {
  const digits = value.split("");
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
            type="password"
            inputMode="numeric"
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
    </div>
  );
}