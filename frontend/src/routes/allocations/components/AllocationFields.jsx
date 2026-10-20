import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { InputField } from "../../../components/form/input-field/InputField";
import { InputHidden } from "../../../components/form/input-field/InputHidden";
import { SelectField } from "../../../components/form/input-field/SelectField";
import { TextAreaField } from "../../../components/form/input-field/TextAreaField";
import { useFormController } from "../../../components/form/context/useFormController";
import { useResourceFormContext } from "../../../components/resource-form/context";
import AllocationTypesService from "../../../service/AllocationTypesService";
import VolunteerService from "../../../service/VolunteerService";
import Toast from "../../../components/toast/ToastStorage";

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const TEN_HOURS_IN_MS = 10 * 60 * 60 * 1000;
const NOTES_MAX_LENGTH = 255;

/**
 * Campos compartilhados entre criação, edição e visualização de uma alocação.
 * O voluntário é imutável após a criação (tanto na edição quanto quando o
 * formulário é aberto a partir da tela de voluntários).
 *
 * @param {Object} props
 * @param {boolean} [props.readOnly]
 */
export function AllocationFields({ readOnly = false }) {
  const { id, volunteerId: routeVolunteerId } = useParams();
  const isVolunteerLocked = Boolean(id || routeVolunteerId);

  return (
    <>
      {isVolunteerLocked ? (
        <LockedVolunteerField />
      ) : (
        <VolunteersSelectField readOnly={readOnly} />
      )}

      <AllocationTypesSelectField readOnly={readOnly} />

      <InputField
        name="startAt"
        id="startAt"
        label="Início"
        type="datetime-local"
        variant="half-left"
        required={!readOnly}
        readOnly={readOnly}
        validate={(value) => {
          if (readOnly) return true;
          if (!value) return "Informe a data e hora de início";

          const start = Date.parse(value);

          if (isNaN(start)) return "Data e hora de início inválidas";

          if (start < Date.now() - THIRTY_DAYS_IN_MS)
            return "A data de início não pode ser anterior a 30 dias";

          return true;
        }}
      />

      <InputField
        name="endAt"
        id="endAt"
        label="Término"
        type="datetime-local"
        variant="half-right"
        required={!readOnly}
        readOnly={readOnly}
        validate={(value, state) => {
          if (readOnly) return true;
          if (!value) return "Informe a data e hora de término";

          const end = Date.parse(value);

          if (isNaN(end)) return "Data e hora de término inválidas";

          const start = Date.parse(state.startAt);

          if (isNaN(start)) return true;

          if (end <= start)
            return "A data de término deve ser posterior à data de início";

          if (end - start > TEN_HOURS_IN_MS)
            return "A duração da alocação não pode exceder 10 horas";

          return true;
        }}
      />

      <TextAreaField
        name="notes"
        id="notes"
        label="Observações"
        variant="full"
        readOnly={readOnly}
        maxLength={NOTES_MAX_LENGTH}
        validate={(value) => {
          if (value && value.length > NOTES_MAX_LENGTH)
            return `As observações devem ter no máximo ${NOTES_MAX_LENGTH} caracteres`;

          return true;
        }}
      />
    </>
  );
}

/**
 * Exibe o voluntário de forma imutável, mantendo seu identificador em um campo
 * oculto para envio. Necessário na edição e ao alocar a partir de Voluntários.
 */
function LockedVolunteerField() {
  const { resource } = useResourceFormContext();
  const { volunteerId: routeVolunteerId } = useParams();
  const form = useFormController();

  useEffect(() => {
    if (resource?.volunteerId) {
      form.fill({
        volunteerId: resource.volunteerId,
        volunteerName: resource.volunteerName,
      });

      return;
    }

    if (!routeVolunteerId) return;

    let active = true;

    VolunteerService.getById(routeVolunteerId).then(({ data, error }) => {
      if (!active) return;

      if (error?.message) return Toast.error(error.message);

      if (data)
        form.fill({ volunteerId: data.id, volunteerName: data.name });
    });

    return () => {
      active = false;
    };
  }, [resource?.volunteerId, routeVolunteerId]);

  return (
    <>
      <InputHidden name="volunteerId" id="volunteerId" />

      <InputField
        name="volunteerName"
        id="volunteerName"
        label="Voluntário"
        variant="half-left"
        readOnly
      />
    </>
  );
}

/**
 * @param {Object} props
 * @param {boolean} [props.readOnly]
 */
function VolunteersSelectField({ readOnly = false }) {
  const [options, setOptions] = useState([
    { label: "Selecione um voluntário", value: "" },
  ]);

  useEffect(() => {
    let active = true;

    VolunteerService.list({
      perPage: 500,
      sortKey: "name",
      sortType: "asc",
    }).then(({ data }) => {
      if (!active || !data) return;

      setOptions([
        { label: "Selecione um voluntário", value: "" },
        ...data.items.map((volunteer) => ({
          value: String(volunteer.id),
          label: volunteer.name,
        })),
      ]);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SelectField
      name="volunteerId"
      id="volunteerId"
      label="Voluntário"
      variant="half-left"
      required={!readOnly}
      disabled={readOnly}
      options={options}
      validate={(value) => {
        if (readOnly) return true;
        if (!value) return "Selecione um voluntário";

        return true;
      }}
    />
  );
}

/**
 * @param {Object} props
 * @param {boolean} [props.readOnly]
 */
function AllocationTypesSelectField({ readOnly = false }) {
  const [types, setTypes] = useState([]);
  const { resource } = useResourceFormContext();
  const form = useFormController();

  useEffect(() => {
    let active = true;

    AllocationTypesService.list({
      perPage: 500,
      sortKey: "name",
      sortType: "asc",
    }).then(({ data }) => {
      if (!active || !data) return;

      setTypes(
        data.items.map((type) => ({
          value: String(type.id),
          label: type.name,
        })),
      );
    });

    return () => {
      active = false;
    };
  }, []);

  const isAllocationTypeMissing =
    resource?.allocationTypeId &&
    !types.some(
      (option) => option.value === String(resource.allocationTypeId),
    );

  const options = [
    { label: "Selecione um tipo de alocação", value: "" },
    ...types,
    ...(isAllocationTypeMissing
      ? [
          {
            value: String(resource.allocationTypeId),
            label: resource.allocationTypeName,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (resource?.allocationTypeId && options.length > 1)
      form.fill({ allocationTypeId: resource.allocationTypeId });
  }, [options.length, resource?.allocationTypeId]);

  return (
    <SelectField
      name="allocationTypeId"
      id="allocationTypeId"
      label="Tipo de Alocação"
      variant="half-right"
      required={!readOnly}
      disabled={readOnly}
      options={options}
      validate={(value) => {
        if (readOnly) return true;
        if (!value) return "Selecione um tipo de alocação";

        return true;
      }}
    />
  );
}
