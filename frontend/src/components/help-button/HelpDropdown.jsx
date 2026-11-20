import { HelpIcon } from "../icons/HelpIcon";
import useMatchMedia from "../media-query/useMatchMedia";
import HelpButton from "./HelpButton";

export default function HelpDropdown({
  onClick,
  className,
  type = "button",
  helpLabel = "Ajuda",
  options,
  ...props
}) {
  const isMobile = useMatchMedia("(max-width: 768px)");
  const clazzName = className ? ` ${className}` : "";
  const helpVariant = isMobile ? " --help-with-label" : "";

  if (!Array.isArray(options) || options.length === 0)
    return (
      <HelpButton
        onClick={onClick}
        className={className}
        type={type}
        helpLabel={helpLabel}
        {...props}
      />
    );

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
