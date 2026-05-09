/** @type {import("react").FC<import("../../global").IconProps>} */
export function ArrowDownIcon(props) {
  const width = props.size ?? props.width ?? 16;
  const height = props.size ?? props.height ?? 16;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.5 8V1.5H5.5V8H4L6 10.5L8 8H6.5Z" fill="#666666" />
    </svg>
  );
}
