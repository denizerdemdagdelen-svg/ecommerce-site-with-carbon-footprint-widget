import { useState } from "react";

interface CarbonFootprintWidgetProps {
  score: number; // 1-10
  label: string; // "Düşük", "Orta", "Yüksek"
  estimatedKgCO2e: number;
  breakdown: {
    production: number;
    shipping: number;
    packaging: number;
    weight: number;
  };
  size?: "small" | "large";
}

export function CarbonFootprintWidget({
  score,
  label,
  estimatedKgCO2e,
  breakdown,
  size = "small"
}: CarbonFootprintWidgetProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getColor = (score: number) => {
    if (score <= 3) return "from-green-400 to-green-600";
    if (score <= 7) return "from-yellow-400 to-orange-500";
    return "from-orange-500 to-red-600";
  };

  const fillPercentage = (score / 10) * 100;

  const isLarge = size === "large";
  const widgetHeight = isLarge ? "h-48" : "h-20";
  const widgetWidth = isLarge ? "w-16" : "w-8";

  return (
    <div className="relative">
      {/* OUTER WRAPPER */}
      <div
        className={`${widgetWidth} ${widgetHeight} relative cursor-pointer`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        role="button"
        tabIndex={0}
        aria-label={`Carbon footprint score ${score} out of 10, ${label}, approximately ${estimatedKgCO2e.toFixed(
          1
        )} kilograms CO2 equivalent`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setShowTooltip(!showTooltip);
          }
        }}
      >
        {/* Background bar */}
        <div className="w-full h-full bg-gray-200 rounded-full border-2 border-black overflow-hidden">
          {/* Fill bar */}
          <div
            className={`w-full bg-gradient-to-t ${getColor(
              score
            )} transition-all duration-500 ease-out`}
            style={{
              height: `${fillPercentage}%`,
              marginTop: `${100 - fillPercentage}%`
            }}
          />
        </div>

        {/* Score overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-black font-bold text-xs">
          <div className={`${isLarge ? "text-lg" : "text-xs"} leading-none`}>
            {score}
          </div>
          {isLarge && (
            <div className="text-xs mt-1 opacity-90">
              /10
            </div>
          )}
        </div>
      </div>

      {/* Label */}
      <div
        className={`text-center mt-2 ${
          isLarge ? "text-sm" : "text-xs"
        } font-medium text-gray-700`}
      >
        {label}
      </div>

      {/* Numeric backup */}
      <div className="text-center text-xs text-gray-500">
        ≈{estimatedKgCO2e.toFixed(1)} kgCO₂e
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
          <div className="font-semibold mb-2">Karbon Ayak İzi Dağılımı</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Üretim:</span>
              <span>{breakdown.production.toFixed(2)} kgCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span>Nakliye:</span>
              <span>{breakdown.shipping.toFixed(2)} kgCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span>Ambalaj:</span>
              <span>{breakdown.packaging.toFixed(2)} kgCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span>Ağırlık Faktörü:</span>
              <span>{breakdown.weight.toFixed(2)} kgCO₂e</span>
            </div>
            <div className="border-t border-gray-600 pt-1 mt-2 flex justify-between font-semibold">
              <span>Toplam:</span>
              <span>{estimatedKgCO2e.toFixed(2)} kgCO₂e</span>
            </div>
          </div>
          <div className="mt-2 text-xs opacity-75">
            Puan: {score}/10 ({label})
          </div>

          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
