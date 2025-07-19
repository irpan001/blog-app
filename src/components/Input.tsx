// src/components/Input.tsx
import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ id, label, error, containerClassName, ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        id={id}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? "border-red-500" : "" // Menambah border merah jika ada error
          }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default Input;
