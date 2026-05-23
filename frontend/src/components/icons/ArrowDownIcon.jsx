/** @type {import("react").FC<import("../../global").IconProps>} */
export const ArrowDownIcon = ({ size, width, height, ...props }) => {
  const actualWidth = size ?? width ?? 16;
  const actualHeight = size ?? height ?? 16;

  return (
    <svg
      width={actualWidth}
      height={actualHeight}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6.5 8V1.5H5.5V8H4L6 10.5L8 8H6.5Z" fill="currentColor" />
    </svg>
  );
};
