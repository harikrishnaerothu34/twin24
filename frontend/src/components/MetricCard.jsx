const MetricCard = ({ title, value, unit, change, icon }) => {
  return (
    <div className="card p-5 transition-all hover:border-blue-500/30 hover:bg-white/[0.03] hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-white">
              {value}
              <span className="ml-1 text-lg font-normal text-slate-400">{unit}</span>
            </p>
            {change && (
              <p className="mt-1 text-xs text-slate-500">{change}</p>
            )}
          </div>
        </div>
        <div className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
          Live
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
