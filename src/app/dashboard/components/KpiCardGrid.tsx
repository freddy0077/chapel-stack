"use client";

import { KpiCard as KpiCardType } from "@/hooks/useDashboardData";

interface KpiCardProps {
  card: KpiCardType;
}

// Individual KPI card component
const KpiCard = ({ card }: KpiCardProps) => {
  // Safe handling of optional fields
  const getChangeColor = () => {
    if (!card.changeType) return "text-gray-500";
    return card.changeType === "increase"
      ? "text-green-500"
      : card.changeType === "decrease"
      ? "text-red-500"
      : "text-gray-500";
  };

  const getChangeIcon = () => {
    if (!card.changeType) return null;
    return card.changeType === "increase" ? (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    ) : card.changeType === "decrease" ? (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    ) : null;
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200"
      style={card.color ? { borderLeft: `4px solid ${card.color}` } : {}}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-500 font-medium mb-1">{card.title}</h3>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
        {card.icon && (
          <div 
            className="rounded-full p-3 bg-gray-100 flex items-center justify-center"
            style={card.color ? { backgroundColor: `${card.color}20` } : {}}
          >
            <span className="text-xl" dangerouslySetInnerHTML={{ __html: card.icon }}></span>
          </div>
        )}
      </div>
      
      {card.change !== undefined && (
        <div className="flex items-center mt-4">
          <span className={`flex items-center ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="ml-1 text-sm font-medium">
              {Math.abs(card.change)}%
            </span>
          </span>
          <span className="ml-2 text-xs text-gray-500">{card.description || 'vs previous period'}</span>
        </div>
      )}
      
      {card.trend && Array.isArray(card.trend) && card.trend.length > 0 && (
        <div className="mt-4 h-10">
          {/* Mini sparkline chart would go here - using a placeholder for now */}
          <div className="flex h-full items-end">
            {card.trend.map((value, i) => (
              <div
                key={i}
                className="w-1 mx-0.5 rounded-t"
                style={{ 
                  height: `${(value / Math.max(...card.trend)) * 100}%`,
                  backgroundColor: card.color || '#6366F1'
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Grid of KPI cards
export default function KpiCardGrid({ 
  cards 
}: { 
  cards: KpiCardType[] 
}) {
  if (!cards || cards.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <KpiCard key={card.id || `kpi-card-${index}`} card={card} />
      ))}
    </div>
  );
}
