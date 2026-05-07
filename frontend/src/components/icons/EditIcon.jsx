/** @type {import("react").FC<import("../../global").IconProps>} */
export const EditIcon = (props) => {
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
        d="M6.44975 3.42727L8.57105 5.54861L3.62132 10.4984H1.5V8.37701L6.44975 3.42727ZM7.15685 2.72017L8.2175 1.65951C8.4128 1.46425 8.72935 1.46425 8.9246 1.65951L10.3389 3.07372C10.5341 3.26898 10.5341 3.58557 10.3389 3.78083L9.27815 4.84149L7.15685 2.72017Z"
        fill="white"
      />
    </svg>
  );
};
