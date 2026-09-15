import { useCallback, useEffect, useState } from "react";
import { SelectField } from "../../../../components/form/input-field/SelectField";
import CitiesService from "../../../../service/CitiesService";
import Toast from "../../../../components/toast/ToastStorage";

export function CitiesSelectInput({ readOnly = false }) {
  const [cities, setCities] = useState({
    options: [],
    loading: false,
    state: "initial",
    district: null,
  });

  const fetchCities = useCallback(async (district) => {
    setCities((prev) => ({ ...prev, loading: true }));

    const { data, error } = await CitiesService.list(district);

    if (error) {
      Toast.error(error.message);

      setCities((prev) => ({
        ...prev,
        state: "failure",
        options: [],
        loading: false,
        district,
      }));
    } else if (data) {
      setCities((prev) => ({
        ...prev,
        state: "loaded",
        options: data.items.map((item) => ({
          value: item.id,
          label: item.name,
        })),
        loading: false,
        district,
      }));
    }
  }, []);

  useEffect(() => {
    fetchCities(null);
  }, [fetchCities]);

  return (
    <>
      <SelectField
        name="state"
        id="state"
        required
        label="Estado"
        options={[{ label: "São Paulo", value: "sp" }]}
        variant="half-left"
        onChange={(option) => {
          if (option.value !== cities.district) fetchCities(option.value);
        }}
        disabled={readOnly || cities.loading}
      />

      <SelectField
        name="city"
        id="city"
        required
        label="Cidade"
        options={cities.options}
        variant="half-right"
        disabled={
          readOnly || cities.loading || cities.options.length === 0
        }
      />
    </>
  );
}
