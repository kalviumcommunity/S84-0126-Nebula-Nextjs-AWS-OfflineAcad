import { UseFormRegister, FieldValues, Path, FieldError } from "react-hook-form";

// Generic Type T ensures this component works with ANY form schema
interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>; // Ensures 'name' matches a key in your Zod schema
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  placeholder?: string;
}

export default function FormInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  error,
  placeholder,
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`border p-2 rounded-md focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 transition-colors
          ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 dark:border-gray-600 focus:ring-blue-200"
          }`}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium animate-pulse">{error.message}</span>
      )}
    </div>
  );
}
