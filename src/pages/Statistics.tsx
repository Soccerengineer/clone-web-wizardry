
import UserLayout from "@/components/ui/user-layout";
import PhysicalStats from "@/components/statistics/PhysicalStats";
import TechnicalStats from "@/components/statistics/TechnicalStats";
import StatisticsCharts from "@/components/statistics/StatisticsCharts";

const Statistics = () => {
  // Sample data for physical statistics
  const physicalStats = {
    distance: "8.5km",
    sprint: "32",
    avgSprint: "24km/h",
    maxSprint: "32km/h",
    activityTime: "85min"
  };

  // Sample data for technical statistics
  const technicalStats = {
    shots: "15",
    avgShotSpeed: "85km/h",
    maxShotSpeed: "105km/h",
    passes: "45",
    possession: "65%"
  };

  // Sample data for sprint speed over time
  const sprintData = [
    { time: "10'", speed: 18 },
    { time: "20'", speed: 24 },
    { time: "30'", speed: 28 },
    { time: "40'", speed: 22 },
    { time: "50'", speed: 26 },
    { time: "60'", speed: 20 },
    { time: "70'", speed: 25 },
    { time: "80'", speed: 19 },
  ];

  // Sample data for shot distribution
  const shotData = [
    { type: "Sol Ayak", count: 8 },
    { type: "Sağ Ayak", count: 5 },
    { type: "Kafa", count: 2 },
  ];

  return (
    <UserLayout>
      <div className="space-y-8">
        <PhysicalStats stats={physicalStats} />
        <TechnicalStats stats={technicalStats} />
        <StatisticsCharts sprintData={sprintData} shotData={shotData} />
      </div>
    </UserLayout>
  );
};

export default Statistics;
