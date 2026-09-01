import React from 'react';
import { WindSpeedUnit } from '@mausam/shared-types';
import { convertWind } from '../../utils/units';

interface WindCompassProps {
  windKph: number;
  windDirDeg: number;
  windSpeedUnit?: WindSpeedUnit;
  size?: number; // e.g. 110
  className?: string;
}

// Convert degrees to cardinal compass string
export function getCardinalDirection(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const idx = Math.round((deg % 360) / 22.5) % 16;
  return directions[idx];
}

export const WindCompass: React.FC<WindCompassProps> = ({
  windKph,
  windDirDeg = 0,
  windSpeedUnit = 'kph',
  size = 114,
  className = '',
}) => {
  const convertedSpeed = convertWind(windKph, windSpeedUnit);
  const formattedSpeed = Number.isInteger(convertedSpeed)
    ? convertedSpeed.toString()
    : convertedSpeed.toFixed(1);

  const unitLabel =
    windSpeedUnit === 'mps'
      ? 'm/s'
      : windSpeedUnit === 'mph'
      ? 'mph'
      : windSpeedUnit === 'knots'
      ? 'kts'
      : 'Km/h';

  const cardinal = getCardinalDirection(windDirDeg);

  // Generate 36 ticks around circumference (every 10 deg)
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const angle = i * 10;
    const isMajor = angle % 90 === 0;
    const isMedium = angle % 30 === 0;
    const length = isMajor ? 6 : isMedium ? 4.5 : 3;
    const strokeWidth = isMajor ? 1.8 : isMedium ? 1.2 : 0.8;
    return { angle, length, strokeWidth };
  });

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      title={`Wind: ${formattedSpeed} ${unitLabel} from ${cardinal} (${windDirDeg}°)`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Subtle Dial Glow */}
          <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.06" />
            <stop offset="90%" stop-color="currentColor" stop-opacity="0.02" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
          </radialGradient>

          {/* Needle Gradient */}
          <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FF453A" />
            <stop offset="100%" stop-color="#FF3B30" />
          </linearGradient>
        </defs>

        {/* Outer Circular Ring */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="url(#compassBg)"
          stroke="currentColor"
          stroke-opacity="0.35"
          stroke-width="1.2"
          stroke-dasharray="2, 3"
        />

        {/* Inner Ticks */}
        {ticks.map(({ angle, length, strokeWidth }) => (
          <line
            key={angle}
            x1="60"
            y1={10}
            x2="60"
            y2={10 + length}
            stroke="currentColor"
            stroke-opacity={angle % 90 === 0 ? '0.85' : '0.4'}
            stroke-width={strokeWidth}
            transform={`rotate(${angle} 60 60)`}
          />
        ))}

        {/* Cardinal Direction Letters */}
        <text
          x="60"
          y="23"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="800"
          fill="currentColor"
          opacity="0.9"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          N
        </text>
        <text
          x="101"
          y="63.5"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="800"
          fill="currentColor"
          opacity="0.9"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          E
        </text>
        <text
          x="60"
          y="104"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="800"
          fill="currentColor"
          opacity="0.9"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          S
        </text>
        <text
          x="19"
          y="63.5"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="800"
          fill="currentColor"
          opacity="0.9"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          W
        </text>

        {/* Compass Needle (Rotates with wind direction) */}
        <g
          transform={`rotate(${windDirDeg} 60 60)`}
          style={{ transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* North Pointing Arrow Head */}
          <polygon
            points="60,26 56.5,37 63.5,37"
            fill="url(#needleRed)"
            filter="drop-shadow(0 1px 2px rgba(255, 59, 48, 0.4))"
          />
          {/* Stem Line */}
          <line
            x1="60"
            y1="37"
            x2="60"
            y2="42"
            stroke="#FF3B30"
            stroke-width="1.8"
            stroke-linecap="round"
          />

          {/* South Tail Marker (Small Ring) */}
          <circle
            cx="60"
            cy="84"
            r="3"
            fill="none"
            stroke="#FF3B30"
            stroke-width="1.5"
            opacity="0.85"
          />
        </g>

        {/* Center Wind Speed Typography */}
        <text
          x="60"
          y="58"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="currentColor"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.03em"
        >
          {formattedSpeed}
        </text>
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill="currentColor"
          opacity="0.75"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {unitLabel}
        </text>
      </svg>
    </div>
  );
};
