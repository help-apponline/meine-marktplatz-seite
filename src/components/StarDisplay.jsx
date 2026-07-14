export default function StarDisplay({ stars, count, size = 16 }) {
  if (!stars || stars === 0) return null;
  const rounded = Math.round(stars * 2) / 2; // round to 0.5

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map(n => {
          const filled = n <= Math.floor(rounded);
          const half = !filled && n - 0.5 === rounded;
          return (
            <svg
              key={n}
              viewBox="0 0 24 24"
              width={size}
              height={size}
              fill={filled ? "#ff8a00" : "none"}
              stroke={filled || half ? "#ff8a00" : "#d1d5db"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {half ? (
                <>
                  <defs>
                    <linearGradient id={`half-${n}`} x1="0" x2="1" y1="0" y2="0">
                      <stop offset="50%" stopColor="#ff8a00" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill={`url(#half-${n})`}
                    stroke="#ff8a00"
                  />
                </>
              ) : (
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              )}
            </svg>
          );
        })}
      </span>
      {count !== undefined && (
        <span className="text-xs text-gray-500 font-medium">
          {stars.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}
