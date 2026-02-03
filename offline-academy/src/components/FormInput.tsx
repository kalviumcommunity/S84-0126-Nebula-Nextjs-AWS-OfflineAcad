import { UseFormRegister, FieldValues, Path, FieldError } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  placeholder?: string;
  className?: string;
}

export default function FormInput<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  error,
  placeholder,
  className = "",
}: FormInputProps<T>) {
  return (
    <div className="flex flex-col gap-2 mb-2 w-full group">
      <label htmlFor={name} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full bg-white/5 border border-white/5 p-4 rounded-xl text-white font-light placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all duration-300 ${className} ${
            error ? "border-rose-500/50 bg-rose-500/5" : ""
          }`}
        />
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
        )}
      </div>
      {error && (
        <span className="text-[10px] text-rose-400 font-medium tracking-wide translate-x-1">{error.message}</span>
      )}
    </div>
  );
}
