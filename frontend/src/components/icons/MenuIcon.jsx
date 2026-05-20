/** @type {import("react").FC<import("../../global").IconProps>} */
export const MenuIcon = (props) => {
  const width = props.size ?? props.width ?? 24;
  const height = props.size ?? props.height ?? 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="currentColor"
    >
      <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
    </svg>
  );
};
