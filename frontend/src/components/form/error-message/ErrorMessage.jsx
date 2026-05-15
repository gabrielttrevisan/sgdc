import { useFieldValidityState } from "../context/useFieldValidityState";

export const ErrorMessage = ({ name }) => {
  const { errorMessage } = useFieldValidityState(name);

  if (!errorMessage) return <></>;

  return <div className="field-error-message">{errorMessage}</div>;
};
