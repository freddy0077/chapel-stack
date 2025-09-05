import React from "react";

interface SkeletonLoaderProps {
  variant?: "text" | "card" | "table" | "avatar" | "button" | "custom";
  width?: string;
  height?: string;
  className?: string;
  rows?: number;
  animate?: boolean;
}

/**
 * Skeleton loader component for better loading states
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = "text",
  width,
  height,
  className = "",
  rows = 1,
  animate = true,
}) => {
  const baseClasses = `bg-gray-200 rounded ${animate ? "animate-pulse" : ""}`;

  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "h-4";
      case "card":
        return "h-32 w-full";
      case "table":
        return "h-12 w-full";
      case "avatar":
        return "h-10 w-10 rounded-full";
      case "button":
        return "h-10 px-4 py-2";
      case "custom":
        return "";
      default:
        return "h-4";
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  if (rows > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
};

/**
 * Sacrament record skeleton loader
 */
export const SacramentRecordSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SkeletonLoader variant="avatar" />
          <div className="space-y-1">
            <SkeletonLoader width="120px" />
            <SkeletonLoader width="80px" />
          </div>
        </div>
        <SkeletonLoader variant="button" width="80px" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <SkeletonLoader width="60px" />
          <SkeletonLoader width="100px" />
        </div>
        <div className="space-y-1">
          <SkeletonLoader width="70px" />
          <SkeletonLoader width="90px" />
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <SkeletonLoader width="100px" />
        <div className="flex space-x-2">
          <SkeletonLoader variant="button" width="60px" />
          <SkeletonLoader variant="button" width="60px" />
        </div>
      </div>
    </div>
  );
};

/**
 * Sacrament table skeleton loader
 */
export const SacramentTableSkeleton: React.FC<{ rows?: number }> = ({
  rows = 5,
}) => {
  return (
    <div className="space-y-2">
      {/* Table header skeleton */}
      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
        <SkeletonLoader width="80px" />
        <SkeletonLoader width="100px" />
        <SkeletonLoader width="90px" />
        <SkeletonLoader width="120px" />
        <SkeletonLoader width="80px" />
        <SkeletonLoader width="60px" />
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-4 p-4 bg-white border border-gray-200 rounded-lg"
        >
          <SkeletonLoader width="70px" />
          <SkeletonLoader width="90px" />
          <SkeletonLoader width="80px" />
          <SkeletonLoader width="110px" />
          <SkeletonLoader width="70px" />
          <div className="flex space-x-1">
            <SkeletonLoader variant="button" width="30px" height="30px" />
            <SkeletonLoader variant="button" width="30px" height="30px" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Sacrament stats skeleton loader
 */
export const SacramentStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <SkeletonLoader width="80px" />
              <SkeletonLoader width="40px" height="32px" />
            </div>
            <SkeletonLoader variant="avatar" width="48px" height="48px" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Modal skeleton loader
 */
export const ModalSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Modal header */}
      <div className="flex items-center justify-between">
        <SkeletonLoader width="200px" height="24px" />
        <SkeletonLoader variant="button" width="24px" height="24px" />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <SkeletonLoader width="100px" />
            <SkeletonLoader variant="custom" className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Modal footer */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <SkeletonLoader variant="button" width="80px" />
        <SkeletonLoader variant="button" width="100px" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
