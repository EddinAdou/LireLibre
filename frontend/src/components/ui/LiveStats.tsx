/**
 * LiveStats - Composant d'affichage des statistiques en temps réel
 * Simule des données dynamiques pour rendre le footer plus vivant
 */

import React, { useState, useEffect } from 'react';
import { Users, Heart, Star } from 'lucide-react';

interface Stat {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
  increment: number;
}

const LiveStats: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([
    { icon: Users, value: 1247, label: 'auteurs', color: 'text-blue-400', increment: 1 },
    { icon: Heart, value: 5832, label: 'histoires', color: 'text-purple-400', increment: 2 },
    { icon: Star, value: 4.8, label: '/5 ⭐', color: 'text-yellow-400', increment: 0 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          if (stat.increment > 0 && Math.random() > 0.7) {
            return {
              ...stat,
              value: stat.value + stat.increment
            };
          }
          return stat;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, label: string): string => {
    if (label.includes('/5')) {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  return (
    <div className="flex items-center space-x-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`flex items-center space-x-2 ${stat.color}`}>
            <IconComponent className="h-5 w-5" />
            <span className="text-sm font-medium">
              {formatValue(stat.value, stat.label)}+ {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LiveStats;
