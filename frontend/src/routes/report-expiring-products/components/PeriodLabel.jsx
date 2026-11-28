export default function PeriodLabel({ days }) {
  if (!days || days === 0) return <></>;

  const isPlural = days > 1;
  const label = isPlural ? `nos próximos ${days} dias` : "amanhã";

  return (
    <span style={{ display: "flex", flexDirection: "column" }}>
      <span>Produtos a Vencer</span>
      <span style={{ fontSize: "16px", opacity: 0.8, textTransform: "none" }}>
        {label}
      </span>
    </span>
  );
}
