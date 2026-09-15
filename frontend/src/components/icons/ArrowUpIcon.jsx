/** @type {import("react").FC<import("../../global").IconProps>} */
export const ArrowUpIcon = ({ size, width, height, ...props }) => {
  const actualWidth = size ?? width ?? 16;
  const actualHeight = size ?? height ?? 16;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={actualWidth}
      height={actualHeight}
      fill="currentColor"
      {...props}
    >
      <path d="M11.0001 22.0003L13 22.0004L13 8.41421L18.4142 8.41421L12 2L5.58575 8.41421L11 8.41421L11.0001 22.0003Z"></path>
    </svg>
  );
};
