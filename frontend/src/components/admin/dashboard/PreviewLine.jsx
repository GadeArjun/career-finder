export default function PreviewLine({
    label,
    value,
    badge = false,
    className = "",
  }) {
    return (
      <div className={`flex justify-between gap-4 py-3 border-b border-slate-800 last:border-b-0 ${className}`}>
        <span className="text-slate-400 text-sm font-medium">
          {label}
        </span>
  
        {badge ? (
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-semibold
              ${
                value === "active"
                  ? "bg-green-500/20 text-green-400"
                  : value === "inactive"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : value === "banned"
                  ? "bg-red-500/20 text-red-400"
                  : value === true
                  ? "bg-green-500/20 text-green-400"
                  : value === false
                  ? "bg-red-500/20 text-red-400"
                  : "bg-slate-700 text-slate-300"
              }
            `}
          >
            {typeof value === "boolean"
              ? value
                ? "Yes"
                : "No"
              : value}
          </span>
        ) : (
          <span className="text-white text-sm text-right break-all">
            {value || "-"}
          </span>
        )}
      </div>
    );
  }