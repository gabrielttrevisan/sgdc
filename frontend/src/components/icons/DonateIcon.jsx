/** @type {import("react").FC<import("../../global").IconProps>} */
export const DonateIcon = (props) => {
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
        d="M6.08597 5.49995L3.7575 3.17153L4.4646 2.46442L8.00016 5.99995L4.4646 9.5355L3.7575 8.8284L6.08592 6.49995L1.50002 6.5L1.5 5.5L6.08597 5.49995ZM9.00001 9.4999V2.49993H10V9.4999H9.00001Z"
        fill="white"
      />
    </svg>
  );
};
