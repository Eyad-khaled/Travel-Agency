
const StatsCard = ({
  headerTitle,
  total,
  currentMonthCount,
  lastMonthCount,
}) => {
  function calculateTrendPercentage(current, previous) {
    const difference = current - previous;

    // Determine trend
    let trend = "no-change";
    if (difference > 0) trend = "increasing";
    else if (difference < 0) trend = "decreasing";

    // Percentage calculation: when previous is 0 handle specially
    let percentage;
    if (previous === 0) {
      percentage = current === 0 ? 0 : 100; // treat as 100% when going from 0 -> positive
    } else {
      percentage = Math.abs((difference / previous) * 100);
    }

    // round to 1 decimal
    percentage = Math.round(percentage * 10) / 10;

    return { trend, percentage };
  }
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount
  );
  const isDecreasing = trend === "decreasing";

  return (
    <article className="stats-card">
      <h3 className="text-base font-medium">{headerTitle}</h3>
      <div className="content" style={{ animation: 'opacity 1s ease forwards' }}>
        <div className="flex flex-col gap-4 ">
          <h2 className="text-4xl font-semibold">{total}</h2>
          <div className="flex items-center gap-2">
            <figure className="flex items-center gap-1">
              <img
                src={`../public/assets/icons/${isDecreasing ? `arrow-down-red.svg` : `arrow-up-green.svg`
                  }`}
                alt="arrow"
                className="size-5"
              />
              <figcaption className={`text-sm font-medium ${isDecreasing ? 'text-red-500' : 'text-success-500'}`}>
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className="text-gray-100 text-sm font-medium truncate">vs last month</p>
          </div>
        </div>
        <div className="img relative overflow-hidden">

          <img src={`../public/assets/icons/${isDecreasing ? `decrement.svg` : `increment.svg`}`} alt="trend graph" className="xl:w-32 w-full md:h-32 xl:h-full animated-chart" />
          <div className="absolute inset-0 bg-white w-full h-full" style={{ animation: "reveal 1s ease forwards" }}></div>
        </div>
      </div>
    </article>
  );
};

export default StatsCard;
