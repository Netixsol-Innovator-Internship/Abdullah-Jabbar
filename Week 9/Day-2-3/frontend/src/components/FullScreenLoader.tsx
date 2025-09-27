import Spinner from "./Spinner";

interface FullScreenLoaderProps {
  label?: string;
  subLabel?: string;
  backgroundClassName?: string;
}

export default function FullScreenLoader({
  label,
  subLabel,
  backgroundClassName = "bg-gray-50",
}: FullScreenLoaderProps) {
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${backgroundClassName}`}
      role="status"
      aria-live="polite"
    >
      <Spinner size="lg" />
      {label && (
        <p className="mt-4 text-sm font-medium text-gray-700 text-center">
          {label}
        </p>
      )}
      {subLabel && (
        <p className="mt-1 text-xs text-gray-500 text-center">{subLabel}</p>
      )}
    </div>
  );
}
