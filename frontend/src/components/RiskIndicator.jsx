const RiskIndicator = ({ score, level }) => {
  const levelColors = {
    low: "text-green-400",
    medium: "text-amber-400",
    high: "text-red-400",
    optimal: "text-green-400"
  };

  const levelBg = {
    low: "from-green-500/20 to-green-500/5",
    medium: "from-amber-500/20 to-amber-500/5",
    high: "from-red-500/20 to-red-500/5",
    optimal: "from-green-500/20 to-green-500/5"
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${levelBg[level?.toLowerCase()] || levelBg.optimal} border-4 border-white/10`}>
        <div className="text-center">
          <div className={`text-4xl font-bold ${levelColors[level?.toLowerCase()] || levelColors.optimal}`}>
            {score}
          </div>
          {level && (
            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              {level}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskIndicator;
