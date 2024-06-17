import React from "react";

interface TodoInputProps {
  value: string;
  placeholder: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEnterInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({
  value,
  handleInputChange,
  handleEnterInput,
  placeholder,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={handleInputChange}
      onKeyDown={handleEnterInput}
      placeholder={placeholder}
      className="px-4 border border-gray-300 rounded-md focus:outline-none h-10 flex-grow"
    />
  );
};

export default TodoInput;
