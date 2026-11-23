import formatDate from "../../../lib/format/date";

export default function DonationProductLabel({ name, expiresAt }) {
  return (
    <span>
      {name} - {formatDate(expiresAt)}
    </span>
  );
}
