/** @type {import("react").FC<import("../../global").IconProps>} */
export function AtoZIcon(props) {
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
      <path
        d="M2.43418 5.5H1.33301L2.99976 1.5H3.99976L5.66646 5.5H4.56532L4.36041 5H2.6391L2.43418 5.5ZM3.04894 4H3.95057L3.49976 2.9L3.04894 4ZM9.49971 8V1.5H8.49971V8H6.99971L8.99971 10.5L10.9997 8H9.49971ZM5.49971 6.5H1.49972V7.5H3.92683L1.49972 9.5V10.5H5.49971V9.5H3.07278L5.49971 7.5V6.5Z"
        fill="#666666"
      />
    </svg>
  );
}
