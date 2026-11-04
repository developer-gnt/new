import type React from 'react';

interface SkeletonCardProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = 80,
  width = '100%',
  borderRadius = 8,
  style,
}) => {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: '#EDF2F7',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
};

