const toneMap = {
  Low: "bg-[color:var(--success)]/20 text-[color:var(--success)]",
  Medium: "bg-[color:var(--warning)]/20 text-[color:var(--warning)]",
  High: "bg-[color:var(--danger)]/20 text-[color:var(--danger)]"
};

const HealthBadge = ({ level }) => {
  return (
    <span className={`rounded-full px-4 py-2 text-xs font-semibold ${toneMap[level]}`}>
      {level} Risk
    </span>
  );
};

export default HealthBadge;
