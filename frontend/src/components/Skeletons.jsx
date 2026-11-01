export function CardSkeletons({ count = 6 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading contacts">
      {Array.from({ length: count }, (_, i) => (
        <div className="card" key={i}>
          <div className="sk-row"><span className="sk sk-circle" /><div className="sk-col">
            <span className="sk sk-line w60" /><span className="sk sk-line w40" /></div></div>
          <span className="sk sk-line w80" /><span className="sk sk-line w50" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeletons({ count = 6 }) {
  return (
    <div className="table-wrap" aria-busy="true" aria-label="Loading contacts">
      {Array.from({ length: count }, (_, i) => (
        <div className="sk-table-row" key={i}>
          <span className="sk sk-circle" /><span className="sk sk-line w30" />
          <span className="sk sk-line w30" /><span className="sk sk-line w20" />
        </div>
      ))}
    </div>
  );
}
