const StatusBadge = ({ status, variant = "default" }) => {
  const variants = {
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    default: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${variants[variant]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
