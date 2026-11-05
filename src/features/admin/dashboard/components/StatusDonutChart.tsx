import type React from 'react';
import type { DonutSegment } from '../data/dashboardDemoData';

interface StatusDonutChartProps {
  title: string;
  subtitle?: string;
  segments: DonutSegment[];
  centerLabel?: string;
}

interface ComputedSegment extends DonutSegment {
  percent: number;
  strokeDasharray: string;
  strokeDashoffset: number;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  title,
  subtitle,
  segments,
  centerLabel = 'Total',
}) => {
  const total = segments.reduce((sum, s) => sum + s.count, 0);

  // SVG Donut geometry
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Pure functional computation of segment offsets (no mutated variables in render)
  const computedSegments = segments.reduce<ComputedSegment[]>((acc, seg) => {
    const prevOffset = acc.reduce((sum, item) => sum + item.percent, 0);
    const percent = total > 0 ? seg.count / total : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -(prevOffset * circumference);
    return [
      ...acc,
      {
        ...seg,
        percent,
        strokeDasharray,
        strokeDashoffset,
      },
    ];
  }, []);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.title}>{title}</h4>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>

      <div style={styles.content}>
        {/* SVG Donut */}
        <div style={styles.donutWrapper}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ transform: 'rotate(-90deg)', display: 'block' }}
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Precomputed Segments */}
            {computedSegments.map((seg) => (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                fill="none"
                strokeLinecap="butt"
              />
            ))}
          </svg>

          {/* Donut Center Count */}
          <div style={styles.centerText}>
            <span style={styles.totalNumber}>{total}</span>
            <span style={styles.centerLabel}>{centerLabel}</span>
          </div>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          {computedSegments.map((seg) => {
            const displayPercent = total > 0 ? Math.round(seg.percent * 100) : 0;
            return (
              <div key={seg.label} style={styles.legendRow}>
                <div style={styles.legendLeft}>
                  <span style={{ ...styles.dot, backgroundColor: seg.color }} />
                  <span style={styles.legendLabel}>{seg.label}</span>
                </div>
                <div style={styles.legendRight}>
                  <span style={styles.legendCount}>{seg.count}</span>
                  <span style={styles.legendPercent}>({displayPercent}%)</span>
                </div>
              </div>
            );
          })}
        </div>
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
    height: '100%',
  },
  header: {
    marginBottom: '16px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0B2F52',
    margin: 0,
  },
  subtitle: {
    fontSize: '12px',
    color: '#718096',
    margin: '3px 0 0 0',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    flex: 1,
  },
  donutWrapper: {
    position: 'relative',
    width: '160px',
    height: '160px',
    flexShrink: 0,
  },
  centerText: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  totalNumber: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0B2F52',
    lineHeight: 1,
  },
  centerLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: '#718096',
    textTransform: 'uppercase',
    marginTop: '3px',
  },
  legend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
    minWidth: '150px',
  },
  legendRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12.5px',
    padding: '4px 0',
    borderBottom: '1px solid #F8FAFC',
  },
  legendLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendLabel: {
    color: '#34516D',
    fontWeight: 500,
  },
  legendRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendCount: {
    color: '#0B2F52',
    fontWeight: 700,
  },
  legendPercent: {
    color: '#94A3B8',
    fontSize: '11.5px',
  },
};
