const ChartCard = ({ title, children, summary, icon }) => {
  return (
    <div className="card p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>
          {summary && <p className="mt-1 text-xs text-slate-500">{summary}</p>}
        </div>
        <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
          Last hour
        </span>
      </div>
      <div className="h-60">{children}</div>
    </div>
  );
};

export default ChartCard;
