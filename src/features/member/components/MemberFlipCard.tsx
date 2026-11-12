import React, { useState } from 'react';
import { RefreshCw, Printer, Download } from 'lucide-react';
import type { MemberProfile } from '../types/member.types';
import {
  downloadMemberCardPdf,
  printMemberCardHtml,
} from '../utils/memberDocumentGenerator';
import { ApkMemberIdCard } from './ApkMemberIdCard';

interface MemberFlipCardProps {
  member: MemberProfile;
  interactive?: boolean;
}

export const MemberFlipCard: React.FC<MemberFlipCardProps> = ({
  member,
  interactive = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    printMemberCardHtml(member);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadMemberCardPdf(member);
  };

  return (
    <div style={styles.outerContainer}>
      {/* Control Action Bar */}
      {interactive && (
        <div style={styles.actionBar}>
          <div style={styles.cardSideBadge}>
            <span style={styles.badgeDot} />
            <span>{isFlipped ? 'Back Face: Terms & QR Verification' : 'Front Face: Identification'}</span>
          </div>

          <div style={styles.actionsRow}>
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              style={styles.actionBtnOutline}
              title="Flip Card View"
            >
              <RefreshCw size={14} color="#06294D" />
              <span>Flip Card ({isFlipped ? 'Show Front' : 'Show Back'})</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={styles.actionBtnOutline}
              title="Print Card"
            >
              <Printer size={14} color="#06294D" />
              <span>Print Badge</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              style={styles.actionBtnSolid}
              title="Download CR80 PDF"
            >
              <Download size={14} color="#06294D" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D Flip Perspective ID Card Container */}
      <div style={styles.cardContainer}>
        <ApkMemberIdCard
          member={member}
          isFlipped={isFlipped}
          onFlip={() => interactive && setIsFlipped((prev) => !prev)}
          interactive={interactive}
          className="w-full"
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '460px',
    margin: '0 auto',
  },
  actionBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  cardSideBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#0B2F52',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#E9B82E',
  },
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  actionBtnOutline: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DCE4EC',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '11.5px',
    fontWeight: 600,
    color: '#06294D',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  actionBtnSolid: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#FAD465',
    border: '1px solid #E9B82E',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '11.5px',
    fontWeight: 700,
    color: '#06294D',
    cursor: 'pointer',
  },
  cardContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
};
