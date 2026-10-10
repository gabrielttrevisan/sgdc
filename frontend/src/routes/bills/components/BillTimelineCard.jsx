export function BillTimelineCard({ title, at, userPreffix, byUser, children }) {
  console.log(at, byUser);

  return (
    <div className="bill-timeline-card">
      <p className="bill-timeline-card__tile">{title}</p>

      <p className="bill-timeline-card__date">
        {new Date(Date.parse(at)).toLocaleDateString("pt-br", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>

      {byUser && byUser.name && (
        <p className="bill-timeline-card__user">
          {userPreffix}&nbsp;{byUser.name}
        </p>
      )}

      {children && <div className="bill-timeline-card__extra">{children}</div>}
    </div>
  );
}
