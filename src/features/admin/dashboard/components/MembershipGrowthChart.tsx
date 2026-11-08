import type React from 'react';
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export interface GrowthPoint {
  label: string;
  members: number;
}

interface MembershipGrowthChartProps {
  growthData?: { month: string; total: number }[];
  currentCount?: number;
}

export const MembershipGrowthChart: React.FC<MembershipGrowthChartProps> = ({
  growthData,
  currentCount = 0,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<GrowthPoint | null>(null);

  const formatMonthLabel = (m: string) => {
    try {
      const parts = m.split('-');
      if (parts.length === 2) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
        return d.toLocaleString('en-US', { month: 'short' });
      }
    } catch {
      // Ignore
    }
    return m;
  };

  const points: GrowthPoint[] =
    growthData && growthData.length > 0
      ? growthData.map((d) => ({
          label: formatMonthLabel(d.month),
          members: d.total,
        }))
      : [
          { label: 'Q1', members: 0 },
          { label: 'Q2', members: 0 },
          { label: 'Q3', members: 0 },
          { label: 'Current', members: currentCount },
        ];

  const minVal = points.length > 0 ? Math.min(...points.map((p) => p.members)) : 0;
  const maxVal = points.length > 0 ? Math.max(...points.map((p) => p.members)) : 0;
  const paddingY = Math.max((maxVal - minVal) * 0.15, 5);
  const floorVal = Math.max(0, Math.floor(minVal - paddingY));
  const ceilVal = Math.ceil(maxVal + paddingY);
  const valRange = ceilVal - floorVal || 1;

  const width = 640;
  const height = 240;
  const padLeft = 46;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 34;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getX = (index: number) => {
    if (points.length <= 1) return padLeft + chartW / 2;
    return padLeft + (index / (points.length - 1)) * chartW;
  };
  const getY = (val: number) => padTop + chartH - ((val - floorVal) / valRange) * chartH;

  const coordinates = points.map((p, idx) => ({
    x: getX(idx),
    y: getY(p.members),
    ...p,
  }));

  // Construct SVG Path
  const linePath = coordinates.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const lastCoord = coordinates[coordinates.length - 1];
  const firstCoord = coordinates[0];
  const areaPath =
    coordinates.length > 1
      ? `${linePath} L ${lastCoord.x} ${padTop + chartH} L ${firstCoord.x} ${padTop + chartH} Z`
      : '';

  const latestVal = coordinates.length > 0 ? coordinates[coordinates.length - 1].members : currentCount;

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <div style={styles.titleWrap}>
          <div style={styles.badge}>
            <TrendingUp size={16} color="#06294D" />
            <span style={styles.badgeLabel}>Growth Trajectory</span>
          </div>
          <h3 style={styles.title}>Membership Expansion Trend</h3>
          <p style={styles.subtitle}>
            Verified membership roster: <strong>{latestVal.toLocaleString()}</strong> active members
          </p>
        </div>
      </div>

      {/* SVG Chart Viewport */}
      <div style={styles.svgContainer}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="growthAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAD465" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#123F68" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#06294D" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = padTop + chartH * ratio;
            const val = Math.round(ceilVal - (ceilVal - floorVal) * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#718096"
                  fontFamily="Inter, sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Fill Area Under Curve */}
          {areaPath && <path d={areaPath} fill="url(#growthAreaGrad)" />}

          {/* Trendline */}
          <path
            d={linePath}
            fill="none"
            stroke="#06294D"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Accent Gold Trendline Glow */}
          <path
            d={linePath}
            fill="none"
            stroke="#FAD465"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {coordinates.map((pt) => (
            <g
              key={pt.label}
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.label === pt.label ? 7 : 4.5}
                fill="#FFFFFF"
                stroke="#06294D"
                strokeWidth="2.5"
                style={{ transition: 'r 0.15s ease' }}
              />
              <circle cx={pt.x} cy={pt.y} r={2} fill="#FAD465" />

              {/* X Axis Labels */}
              <text
                x={pt.x}
                y={height - 12}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight={hoveredPoint?.label === pt.label ? 700 : 500}
                fill={hoveredPoint?.label === pt.label ? '#06294D' : '#718096'}
                fontFamily="Inter, sans-serif"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div style={styles.tooltip}>
            <span style={styles.tooltipLabel}>{hoveredPoint.label}:</span>
            <span style={styles.tooltipVal}>{hoveredPoint.members} members</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '12px',
    padding: '22px',
    boxShadow: '0 2px 8px -2px rgba(1, 31, 57, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '18px',
    gap: '12px',
  },
  titleWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#F0F5FA',
    padding: '4px 10px',
    borderRadius: '6px',
    width: 'fit-content',
    marginBottom: '4px',
  },
  badgeLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
  },
  subtitle: {
    fontSize: '12.5px',
    color: '#718096',
    margin: 0,
  },
  svgContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 'auto',
  },
  tooltip: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '11.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    pointerEvents: 'none',
  },
  tooltipLabel: {
    color: '#FAD465',
    fontWeight: 600,
  },
  tooltipVal: {
    fontWeight: 700,
  },
};
