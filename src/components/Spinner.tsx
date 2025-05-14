import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string; // Tailwind class or hex
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = '#7fc9ff',
  text,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        className="animate-spin"
        style={{ width: size, height: size }}
        viewBox="0 0 50 50"
      >
        <circle
          className="text-black"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="90"
          strokeDashoffset="60"
        />
      </svg>
      {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export default Spinner;
