/** @type {import("react").FC<import("../../global").IconProps>} */
export function TriangleDownIcon(props) {
  const width = props.size ?? props.width ?? 16;
  const height = props.size ?? props.height ?? 16;

  return (
    <svg
      width={width}
      height={height}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18 9 12 3 6 9H18ZM18 15 12 21 6 15H18Z"></path>
    </svg>
  );
}
