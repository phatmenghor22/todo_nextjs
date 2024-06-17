// components/TextInput/TodoInput.tsx
import React from "react";
import { FiX } from "react-icons/fi";

interface TodoInputProps {
  value: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnterInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  placeholder?: string;
}

const TodoInput: React.FC<TodoInputProps> = ({
  value,
  handleInputChange,
  handleEnterInput,
  clearInput,
  placeholder = "Enter todo",
}) => {
  return (
    <div className="relative flex items-center flex-1">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        onKeyDown={handleEnterInput}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none h-10 flex-grow"
      />
      {value && (
        <button
          onClick={clearInput}
          className="absolute right-2 top-2 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default TodoInput;
