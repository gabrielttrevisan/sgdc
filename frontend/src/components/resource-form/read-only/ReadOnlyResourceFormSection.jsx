export default function ReadOnlyResourceFormSection({ children, ...props }) {
  return (
    <div {...props} className="form-inline--readonly__section">
      {children}
    </div>
  );
}
