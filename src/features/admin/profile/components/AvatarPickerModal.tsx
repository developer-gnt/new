import React, { useState } from 'react';
import { X, Camera, Upload, Trash2, Check } from 'lucide-react';
import { AVATAR_PRESETS } from '../data/profileFixtures';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  onSelectAvatar: (url: string | null) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onSelectAvatar,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentAvatar || null);
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSelectedUrl(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      setSelectedUrl(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleSave = () => {
    onSelectAvatar(selectedUrl);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <Camera size={18} color="#06294D" />
            <h3 style={styles.headerTitle}>Change Profile Photo</h3>
          </div>
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={styles.body}>
          {/* Active Preview */}
          <div style={styles.previewSection}>
            <div style={styles.previewCircle}>
              {selectedUrl ? (
                <img src={selectedUrl} alt="Selected avatar" style={styles.previewImg} />
              ) : (
                <span style={styles.previewFallback}>AD</span>
              )}
            </div>
            <div style={styles.previewInfo}>
              <span style={styles.previewLabel}>Active Selection</span>
              <span style={styles.previewSub}>
                {selectedUrl ? 'Official identity image loaded' : 'Default initials avatar'}
              </span>
              {selectedUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedUrl(null)}
                  style={styles.removeBtn}
                >
                  <Trash2 size={13} color="#DC2626" />
                  <span>Remove Avatar</span>
                </button>
              )}
            </div>
          </div>

          {/* Preset Choices */}
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>Choose from Presets</span>
          </div>

          <div style={styles.presetsGrid}>
            {AVATAR_PRESETS.map((preset) => {
              const isChosen = selectedUrl === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedUrl(preset.url)}
                  style={{
                    ...styles.presetItem,
                    borderColor: isChosen ? '#06294D' : '#E2E8F0',
                    boxShadow: isChosen ? '0 0 0 2px #FAD465' : 'none',
                  }}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} style={styles.presetImg} />
                  {isChosen && (
                    <div style={styles.presetCheck}>
                      <Check size={11} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upload File / External URL */}
          <div style={styles.uploadSection}>
            <label style={styles.fileUploadBtn}>
              <Upload size={14} color="#06294D" />
              <span>Upload Local Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <div style={styles.urlInputRow}>
              <input
                type="text"
                placeholder="Or paste image URL (https://...)"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                style={styles.urlInput}
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                style={styles.urlApplyBtn}
                disabled={!customUrl.trim()}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} style={styles.submitBtn}>
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 31, 57, 0.65)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '18px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#011F39',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  previewSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#F8FAFC',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  previewCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#06294D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #FAD465',
    flexShrink: 0,
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  previewFallback: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#FAD465',
  },
  previewInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  previewLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#011F39',
  },
  previewSub: {
    fontSize: '11px',
    color: '#64748B',
  },
  removeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    color: '#DC2626',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    marginTop: '4px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  presetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '10px',
  },
  presetItem: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '2px solid #E2E8F0',
    transition: 'all 0.2s',
  },
  presetImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  presetCheck: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#06294D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingTop: '6px',
  },
  fileUploadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#F1F5F9',
    border: '1px dashed #CBD5E1',
    color: '#06294D',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  urlInputRow: {
    display: 'flex',
    gap: '8px',
  },
  urlInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '12px',
    outline: 'none',
  },
  urlApplyBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    backgroundColor: '#06294D',
    color: '#FFFFFF',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#F8FAFC',
  },
  cancelBtn: {
    padding: '9px 18px',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '9px 22px',
    borderRadius: '8px',
    backgroundColor: '#06294D',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    color: '#FFFFFF',
    cursor: 'pointer',
  },
};

