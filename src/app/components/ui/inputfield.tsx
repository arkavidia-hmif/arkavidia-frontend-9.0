"use client";

import React from "react";
import clsx from "clsx";

interface InputFieldProps {
  label: string;
  placeholder: string;
  helperText?: string;
  state?: "default" | "filled" | "hover" | "focus" | "disabled" | "success" | "warning" | "error";
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  helperText = "",
  state = "default",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={clsx(
          "text-sm font-medium",
          state === "error" && "text-red-500",
          state === "success" && "text-green-500",
          disabled && "text-gray-400"
        )}
      >
        {label} {state === "error" && "*"}
      </label>
      <div
        className={clsx(
          "flex items-center px-3 py-2 border rounded-md transition-all",
          state === "default" && "border-gray-500 bg-transparent",
          state === "filled" && "border-gray-500 bg-gray-100",
          state === "hover" && "border-purple-500 bg-purple-100",
          state === "focus" && "border-purple-700 bg-transparent shadow-outline-purple",
          state === "disabled" && "border-gray-300 bg-gray-200 cursor-not-allowed",
          state === "success" && "border-green-500 bg-green-100",
          state === "warning" && "border-yellow-500 bg-yellow-100",
          state === "error" && "border-red-500 bg-red-100"
        )}
      >
        <span className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            "flex-1 bg-transparent outline-none pl-2 text-sm",
            disabled && "cursor-not-allowed text-gray-500"
          )}
        />
      </div>
      {helperText && (
        <p
          className={clsx(
            "text-xs",
            state === "error" && "text-red-500",
            state === "success" && "text-green-500",
            disabled && "text-gray-400"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default InputField;
