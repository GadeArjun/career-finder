import {
    Users,
    ClipboardList,
    ShieldCheck,
    Activity,
  } from "lucide-react";
  
  export default function StatsCards({ stats }) {
    const cards = [
      {
        title: "Total Users",
        value: stats.totalUsers,
        icon: Users,
      },
      {
        title: "Verified Users",
        value: stats.verifiedUsers,
        icon: ShieldCheck,
      },
      {
        title: "Total Tests",
        value: stats.totalTests,
        icon: ClipboardList,
      },
      {
        title: "Active Users",
        value: stats.activeUsers,
        icon: Activity,
      },
    ];
  
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
  
          return (
            <div
              key={card.title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-slate-400 text-sm">
                    {card.title}
                  </p>
  
                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>
  
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }