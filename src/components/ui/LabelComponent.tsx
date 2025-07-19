import React, { InputHTMLAttributes } from "react";
import { Label } from "radix-ui";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const LabelComponent: React.FC<InputProps> = ({ id, label, error, ...props }) => {
  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <Label.Root
        className="text-sm font-semibold text-[#181D27]"
        htmlFor="firstName"
      >
        {label}
      </Label.Root>
      <input
        id={id}
        className={`w-full h-12 rounded-xl border ${error ? "border-[#EE1D52] " : "border-[#D5D7DA]"} focus:outline-none focus:border-[#181D27] text-sm font-regular text-[#181D27] px-4`}{...props}
        placeholder='Enter your name'
      />
      {error && <p className="text-xs font-regular text-[#EE1D52]">{error}</p>}
    </div>
  )
}

export default LabelComponent

