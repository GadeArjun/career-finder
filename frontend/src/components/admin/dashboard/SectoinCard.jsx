export default function SectionCard({
    title,
    subtitle,
    children,
    actions,
    className = "",
  }) {
    return (
      <div
        className={`
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
          shadow-lg
          ${className}
        `}
      >
        {(title || subtitle || actions) && (
          <div className="px-6 py-5 border-b border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-white">
                    {title}
                  </h2>
                )}
  
                {subtitle && (
                  <p className="text-sm text-slate-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
  
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
  
        <div className="p-6">{children}</div>
      </div>
    );
  }