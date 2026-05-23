import { useCallback, useEffect, useState } from "react";
import { SelectField } from "../../../../components/form/input-field/SelectField";
import CitiesService from "../../../../service/CitiesService";
import Toaster from "../../../../components/toast/ToastStorage";

export function CitiesSelectInput() {
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
      Toaster.error(error.message);

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
        disabled
        options={[{ label: "São Paulo", value: "sp" }]}
        variant="half-right"
        onChange={(option) => {
          if (option.value !== cities.district) fetchCities(option.value);
        }}
        disabled={cities.loading}
      />

      <SelectField
        name="city"
        id="city"
        required
        label="Cidade"
        disabled
        options={cities.options}
        variant="half-left"
        disabled={cities.loading || cities.options.length === 0}
      />
    </>
  );
}
