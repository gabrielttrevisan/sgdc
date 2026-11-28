import { HelpIcon } from "../icons/HelpIcon";
import useMatchMedia from "../media-query/useMatchMedia";

export default function HelpButton({
  onClick,
  className,
  type = "button",
  helpLabel = "Ajuda",
  ...props
}) {
  const isMobile = useMatchMedia("(max-width: 768px)");
  const clazzName = className ? ` ${className}` : "";
  const helpVariant = isMobile ? " --help-with-label" : "";

  return (
    <button
      type={type}
      className={`button-block --help${clazzName}${helpVariant}`}
      onClick={onClick}
      {...props}
    >
      <HelpIcon size={16} />

      {isMobile && <span>{helpLabel}</span>}
    </button>
  );
}
