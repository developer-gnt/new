import type React from 'react';
import hrsjmLogoImg from '../../assets/logo/logo.png';

interface HrsjmLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // 'light' on navy backgrounds, 'dark' on light backgrounds
  showWordmark?: boolean;
  subtitle?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const HrsjmLogo: React.FC<HrsjmLogoProps> = ({
  size = 'md',
  variant = 'light',
  showWordmark = true,
  subtitle = 'DIGITAL PLATFORM ADMIN',
  className,
  style,
}) => {
  const iconSizes = {
    sm: 34,
    md: 44,
    lg: 56,
    xl: 72,
  };

  const dim = iconSizes[size];
  const isLight = variant === 'light';

  return (
    <div style={{ ...styles.container, ...style }} className={className}>
      {/* Official High-Resolution HRSJM Emblem */}
      <img
        src={hrsjmLogoImg}
        alt="HRSJM Official Crest"
        width={dim}
        height={dim}
        style={{
          width: `${dim}px`,
          height: `${dim}px`,
          objectFit: 'contain',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.18))',
        }}
      />

      {showWordmark && (
        <div style={styles.textWrap}>
          <div
            style={{
              ...styles.title,
              color: isLight ? '#FFFFFF' : '#0B2F52',
              fontSize: size === 'sm' ? '15px' : size === 'md' ? '18px' : '22px',
            }}
          >
            HRSJM
          </div>
          <div
            style={{
              ...styles.subtitle,
              color: isLight ? '#FAD465' : '#174A78',
              fontSize: size === 'sm' ? '10px' : '11px',
            }}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    userSelect: 'none',
  },
  textWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  title: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 700,
    letterSpacing: '0.04em',
  },
  subtitle: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
};
