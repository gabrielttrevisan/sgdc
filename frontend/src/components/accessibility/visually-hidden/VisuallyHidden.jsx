export const VisuallyHidden = ({ children, as: As = "span" }) => {
  return <As className="visually-hidden">{children}</As>;
};
