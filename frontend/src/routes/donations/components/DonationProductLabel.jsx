export default function DonationProductLabel({ name, expiresAt }) {
  return (
    <span>
      {name} - {expiresAt}
    </span>
  );
}
