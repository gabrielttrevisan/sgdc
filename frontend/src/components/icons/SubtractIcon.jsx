/** @type {import("react").FC<import("../../global").IconProps>} */
export function SubtractIcon(props) {
  const width = props.size ?? props.width ?? 16;
  const height = props.size ?? props.height ?? 16;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="currentColor"
    >
      <path d="M5 11V13H19V11H5Z"></path>
    </svg>
  );
}
