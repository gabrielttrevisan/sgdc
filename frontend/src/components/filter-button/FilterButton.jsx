import { FilterIcon } from "../icons/FilterIcon.jsx";

export default function FilterButton({
  onClick,
  className = "",
  ...props
}) {
  const classes = ["button-block", "--outline", "--primary", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      {...props}
    >
      <FilterIcon size={16} />
      <span>Filtrar</span>
    </button>
  );
}
