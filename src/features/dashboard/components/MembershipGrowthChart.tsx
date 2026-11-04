import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { GrowthPoint } from '../data/dashboardDemoData';
import { DEMO_GROWTH_DATA } from '../data/dashboardDemoData';

export const MembershipGrowthChart: React.FC = () => {
  const [range, setRange] = useState<'7d' | '30d' | '6m' | '1y'>('6m');
  const [hoveredPoint, setHoveredPoint] = useState<GrowthPoint | null>(null);

  const points = DEMO_GROWTH_DATA[range] || DEMO_GROWTH_DATA['6m'];
  const minVal = Math.min(...points.map((p) => p.members));
  const maxVal = Math.max(...points.map((p) => p.members));
  const paddingY = (maxVal - minVal) * 0.15 || 20;
  const floorVal = Math.floor(minVal - paddingY);
  const ceilVal = Math.ceil(maxVal + paddingY);

  const width = 640;
  const height = 240;
  const padLeft = 46;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 34;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const getX = (index: number) => padLeft + (index / (points.length - 1)) * chartW;
  const getY = (val: number) => padTop + chartH - ((val - floorVal) / (ceilVal - floorVal)) * chartH;

  const coordinates = points.map((p, idx) => ({
    x: getX(idx),
    y: getY(p.members),
    ...p,
  }));

  // Construct SVG Path
  const linePath = coordinates.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${
    padTop + chartH
  } L ${coordinates[0].x} ${padTop + chartH} Z`;

  const latestVal = points[points.length - 1].members;

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

        {/* Range Selector Pill Group */}
        <div style={styles.rangeGroup}>
          {(['7d', '30d', '6m', '1y'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              style={{
                ...styles.rangeBtn,
                ...(range === r ? styles.rangeBtnActive : {}),
              }}
            >
              {r.toUpperCase()}
            </button>
          ))}
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
          <path d={areaPath} fill="url(#growthAreaGrad)" />

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
              <circle
                cx={pt.x}
                cy={pt.y}
                r={2}
                fill="#FAD465"
              />

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
    padding: '24px',
    boxShadow: '0 2px 8px -2px rgba(1, 31, 57, 0.05)',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
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
    backgroundColor: '#EDF2F7',
    padding: '3px 10px',
    borderRadius: '999px',
    width: 'fit-content',
  },
  badgeLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#06294D',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: '4px 0 0 0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#34516D',
    margin: 0,
  },
  rangeGroup: {
    display: 'flex',
    gap: '4px',
    backgroundColor: '#FAF7F0',
    border: '1px solid #DCE4EC',
    padding: '3px',
    borderRadius: '8px',
  },
  rangeBtn: {
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 600,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#718096',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  rangeBtnActive: {
    backgroundColor: '#06294D',
    color: '#FAD465',
    boxShadow: '0 1px 3px rgba(1, 31, 57, 0.2)',
  },
  svgContainer: {
    position: 'relative',
    width: '100%',
  },
  tooltip: {
    position: 'absolute',
    top: '12px',
    right: '24px',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    boxShadow: '0 4px 12px rgba(1, 31, 57, 0.25)',
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    border: '1px solid #FAD465',
  },
  tooltipLabel: {
    color: '#FAD465',
    fontWeight: 600,
  },
  tooltipVal: {
    color: '#FFFFFF',
    fontWeight: 700,
  },
};
