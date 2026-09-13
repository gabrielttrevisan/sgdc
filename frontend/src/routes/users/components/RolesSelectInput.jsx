import { useCallback, useEffect, useState } from "react";
import Toast from "../../../components/toast/ToastStorage";
import RolesService from "../../../service/RolesService";
import { SelectField } from "../../../components/form/input-field/SelectField";

export function RolesSelectInput({ readOnly = false }) {
  const [roles, setRoles] = useState({
    options: [],
    loading: false,
    state: "initial",
  });

  const fetchRoles = useCallback(async () => {
    setRoles((prev) => ({ ...prev, loading: true }));

    const { data, error } = await RolesService.list({
      filter: readOnly ? "inactive" : undefined,
    });

    if (error) {
      Toast.error(error.message);

      setRoles((prev) => ({
        ...prev,
        state: "failure",
        options: [],
        loading: false,
      }));
    } else if (data) {
      setRoles((prev) => ({
        ...prev,
        state: "loaded",
        options: data.items.map((item) => ({
          value: item.id,
          label: item.name,
        })),
        loading: false,
      }));
    }
  }, [readOnly]);

  useEffect(() => {
    fetchRoles(null);
  }, [fetchRoles]);

  return (
    <>
      <SelectField
        name="roleId"
        id="roleId"
        required={!readOnly}
        label="Nível de Acesso"
        options={roles.options}
        variant="half-right"
        disabled={readOnly || roles.loading || roles.options.length === 0}
      />
    </>
  );
}
