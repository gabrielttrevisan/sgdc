import formatDate from "../../../lib/format/date";

export function BillTimelineCard({ title, at, preffix, byUser, children }) {
  console.log(at, byUser);

  return (
    <div className="bill-timeline-card">
      <p className="bill-timeline-card__title">{title}</p>

      <p className="bill-timeline-card__date">
        {preffix}&nbsp;em:&nbsp;{formatDate(at)}
      </p>

      {byUser && byUser.name && (
        <p className="bill-timeline-card__user">
          {preffix}&nbsp;por:&nbsp;{byUser.name}
        </p>
      )}

      {children && <div className="bill-timeline-card__extra">{children}</div>}

      <div className="bill-timeline-card__line" />
    </div>
  );
}
