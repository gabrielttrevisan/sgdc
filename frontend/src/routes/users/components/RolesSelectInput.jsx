import { useCallback, useEffect, useState } from "react";
import Toast from "../../../components/toast/ToastStorage";
import RolesService from "../../../service/RolesService";
import { SelectField } from "../../../components/form/input-field/SelectField";

export function RolesSelectInput() {
  const [roles, setRoles] = useState({
    options: [],
    loading: false,
    state: "initial",
  });

  const fetchRoles = useCallback(async () => {
    setRoles((prev) => ({ ...prev, loading: true }));

    const { data, error } = await RolesService.list();

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
  }, []);

  useEffect(() => {
    fetchRoles(null);
  }, [fetchRoles]);

  return (
    <>
      <SelectField
        name="role"
        id="role"
        required
        label="Nível de Acesso"
        options={roles.options}
        variant="half-right"
        disabled={roles.loading || roles.options.length === 0}
      />
    </>
  );
}
