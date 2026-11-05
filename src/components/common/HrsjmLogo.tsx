import type React from 'react';
import hrsjmLogo from '../../assets/hrsjm_logo.png';

export interface HrsjmLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'light' | 'dark'; // 'light' on navy backgrounds, 'dark' on light backgrounds
  showWordmark?: boolean;
  showSubtitle?: boolean;
  title?: string;
  subtitle?: string;
  layout?: 'horizontal' | 'vertical';
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
}

const SIZES = {
  xs: 28,
  sm: 34,
  md: 44,
  lg: 56,
  xl: 72,
} as const;

export const HrsjmLogo: React.FC<HrsjmLogoProps> = ({
  size = 'md',
  variant = 'light',
  showWordmark = true,
  showSubtitle = true,
  title = 'HRSJM',
  subtitle,
  layout = 'horizontal',
  className = '',
  imgClassName = '',
  style,
}) => {
  const dim = typeof size === 'number' ? size : SIZES[size] || 44;
  const isLight = variant === 'light';
  const isVertical = layout === 'vertical';

  return (
    <div
      style={style}
      className={`flex ${
        isVertical ? 'flex-col text-center' : 'flex-row text-left'
      } items-center gap-2.5 ${className}`}
    >
      <img
        src={hrsjmLogo}
        alt="HRSJM Logo"
        width={dim}
        height={Math.round(dim * (825 / 813))}
        className={`object-contain shrink-0 drop-shadow-sm ${imgClassName}`}
        style={{ width: `${dim}px`, height: 'auto' }}
      />
      {showWordmark && (
        <div
          className={`flex flex-col ${
            isVertical ? 'items-center mt-2' : ''
          } leading-tight select-none`}
        >
          <span
            className={`font-serif font-black tracking-wider ${
              isLight ? 'text-white' : 'text-[#011F39]'
            }`}
            style={{ fontSize: `${Math.max(13, dim * 0.42)}px` }}
          >
            {title}
          </span>
          {subtitle ? (
            <span
              className={`font-semibold tracking-wider mt-0.5 ${
                isLight ? 'text-[#FAD465]' : 'text-[#174A78]'
              }`}
              style={{ fontSize: `${Math.max(10, dim * 0.22)}px` }}
            >
              {subtitle}
            </span>
          ) : (
            showSubtitle && (
              <>
                <span
                  className={`font-bold uppercase tracking-widest mt-0.5 ${
                    isLight ? 'text-[#FAD465]' : 'text-[#06294D]'
                  }`}
                  style={{ fontSize: `${Math.max(8.5, dim * 0.2)}px` }}
                >
                  HUMAN RIGHTS &amp; SOCIAL JUSTICE MISSION
                </span>
                <span
                  className={`tracking-wide font-medium mt-0.5 ${
                    isLight ? 'text-slate-300' : 'text-slate-500'
                  }`}
                  style={{ fontSize: `${Math.max(8, dim * 0.18)}px` }}
                >
                  मानव अधिकार • सामाजिक न्याय
                </span>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};
