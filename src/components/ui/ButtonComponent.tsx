import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`h-12 w-full bg-[#0093DD] hover:bg-[#0093DD50] text-sm text-[#FDFDFD] font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${className}`}
      type="button" // Default ke type="button" agar tidak submit form secara otomatis
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonComponent