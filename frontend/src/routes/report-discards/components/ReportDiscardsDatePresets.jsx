import { useFormController } from "../../../components/form/context/useFormController.js";
import { toDateInputValue } from "../utils/toDateInputValue.js";
import { getDateTimestamp } from "../utils/getDateTimestamp.js";

export function ReportDiscardsDatePresets({
  currentMonthProps,
  next30DaysProps,
}) {
  const form = useFormController();

  const setFieldValue = (name, value) => {
    const field = form.getFieldRef(name);
    if (!field) return;

    field.value = value;
    field.element.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const fillCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFieldValue("startAt", toDateInputValue(firstDay));
    setFieldValue("endAt", toDateInputValue(lastDay));
  };

  const fillNext30Days = () => {
    const currentStartAt = form.getFieldRef("startAt")?.value;
    let startAt;

    if (
      typeof currentStartAt === "string" &&
      !Number.isNaN(getDateTimestamp(currentStartAt))
    ) {
      const [year, month, day] = currentStartAt.split("-").map(Number);
      startAt = new Date(year, month - 1, day);
    } else {
      startAt = new Date();
    }

    const endAt = new Date(startAt);
    endAt.setDate(endAt.getDate() + 30);

    setFieldValue("startAt", toDateInputValue(startAt));
    setFieldValue("endAt", toDateInputValue(endAt));
  };

  return (
    <div
      style={{
        gridColumn: "1 / 3",
        display: "flex",
        gap: "0.5rem",
        flexWrap: "wrap",
      }}
    >
      <button
        type="button"
        className="button-block --outline --primary"
        onClick={fillCurrentMonth}
        {...currentMonthProps}
      >
        Mês Atual
      </button>

      <button
        type="button"
        className="button-block --outline --primary"
        onClick={fillNext30Days}
        {...next30DaysProps}
      >
        Próximos 30 dias
      </button>
    </div>
  );
}
