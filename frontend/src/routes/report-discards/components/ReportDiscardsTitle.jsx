import formatDate from "../../../lib/format/date";

export default function ReportDiscardsTitle({ startAt, endAt }) {
  const label = startAt
    ? endAt
      ? `realizados entre ${formatDate(startAt)} e ${formatDate(endAt)}`
      : `realizados nos 30 dias após ${formatDate(startAt)}`
    : "";

  return (
    <span style={{ display: "flex", flexDirection: "column" }}>
      <span>Descartes</span>
      {label && (
        <span style={{ fontSize: "16px", opacity: 0.8, textTransform: "none" }}>
          {label}
        </span>
      )}
    </span>
  );
}
