interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary-600" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 opacity-20" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-500">{text}</p>
      </div>
    </div>
  );
}