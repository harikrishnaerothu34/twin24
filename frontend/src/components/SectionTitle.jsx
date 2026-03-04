const SectionTitle = ({ title, subtitle }) => {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{subtitle}</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
    </div>
  );
};

export default SectionTitle;
