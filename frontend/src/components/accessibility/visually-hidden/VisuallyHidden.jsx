export const VisuallyHidden = ({ children, as: As = "span", ...props }) => {
  return (
    <As className="visually-hidden" {...props}>
      {children}
    </As>
  );
};
