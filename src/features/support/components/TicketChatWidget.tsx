import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, User, ShieldCheck } from 'lucide-react';
import type { SupportTicket, SupportTicketMessage } from '../types/support.types';
import { supportStore } from '../store/supportStore';

interface TicketChatWidgetProps {
  ticket: SupportTicket;
  messages: SupportTicketMessage[];
}

export const TicketChatWidget: React.FC<TicketChatWidgetProps> = ({
  ticket,
  messages,
}) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;

    const text = replyText.trim();
    setReplyText('');
    setSending(true);

    try {
      await supportStore.addMessage(ticket.id, text);
    } catch (err) {
      console.error('Failed to post reply:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const formatMsgTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div style={styles.container}>
      {/* Messages Scroll Area */}
      <div style={styles.messagesArea}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <h4 style={styles.emptyTitle}>No messages yet</h4>
            <p style={styles.emptySubtitle}>
              Start a conversation with the citizen complainant regarding this ticket.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isAdmin =
              m.author?.roles?.includes('ADMIN') ||
              m.author_id.includes('admin') ||
              m.body.startsWith('[Status Updated');
            const isSystemAudit = m.body.startsWith('[Status Updated');

            if (isSystemAudit) {
              return (
                <div key={m.id} style={styles.systemAuditRow}>
                  <div style={styles.systemAuditBadge}>
                    <ShieldCheck size={12} color="#0284C7" />
                    <span>{m.body}</span>
                    <span style={styles.systemAuditTime}>{formatMsgTime(m.created_at)}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={m.id}
                style={{
                  ...styles.bubbleRow,
                  justifyContent: isAdmin ? 'flex-end' : 'flex-start',
                }}
              >
                {!isAdmin && (
                  <div style={styles.avatarComplainant}>
                    <User size={14} color="#011F39" />
                  </div>
                )}

                <div
                  style={{
                    ...styles.bubble,
                    backgroundColor: isAdmin ? '#011F39' : '#FFFFFF',
                    color: isAdmin ? '#FFFFFF' : '#011F39',
                    border: isAdmin ? 'none' : '1px solid #DCE4EC',
                    borderBottomRightRadius: isAdmin ? '4px' : '16px',
                    borderBottomLeftRadius: !isAdmin ? '4px' : '16px',
                  }}
                >
                  <div style={styles.senderHeader}>
                    <span
                      style={{
                        ...styles.senderName,
                        color: isAdmin ? '#FAD465' : '#174A78',
                      }}
                    >
                      {isAdmin
                        ? `${m.author?.full_name || 'Admin Officer'} · Support Team`
                        : m.author?.full_name || ticket.user?.full_name || 'Complainant'}
                    </span>
                    <span
                      style={{
                        ...styles.msgTime,
                        color: isAdmin ? 'rgba(255, 255, 255, 0.7)' : '#718096',
                      }}
                    >
                      {formatMsgTime(m.created_at)}
                    </span>
                  </div>
                  <div style={styles.msgBody}>{m.body}</div>
                </div>

                {isAdmin && (
                  <div style={styles.avatarAdmin}>
                    <ShieldCheck size={14} color="#011F39" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input Bar */}
      <form onSubmit={handleSend} style={styles.inputBar}>
        <textarea
          rows={2}
          placeholder="Type an administrative response to complainant (Press Ctrl + Enter to send)..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.inputArea}
        />
        <button
          type="submit"
          disabled={!replyText.trim() || sending}
          style={{
            ...styles.sendBtn,
            opacity: !replyText.trim() || sending ? 0.5 : 1,
            cursor: !replyText.trim() || sending ? 'not-allowed' : 'pointer',
          }}
          title="Send reply message"
        >
          <Send size={16} />
          <span>{sending ? 'Sending...' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FAF7F0',
    borderRadius: '12px',
    border: '1px solid #DCE4EC',
    overflow: 'hidden',
    height: '520px',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  emptyState: {
    margin: 'auto',
    textAlign: 'center',
    padding: '32px',
  },
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  emptyTitle: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: '18px',
    fontWeight: 700,
    color: '#011F39',
    margin: '0 0 6px 0',
  },
  emptySubtitle: {
    fontSize: '13px',
    color: '#718096',
    margin: 0,
  },
  systemAuditRow: {
    display: 'flex',
    justifyContent: 'center',
    margin: '4px 0',
  },
  systemAuditBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#EFF6FF',
    border: '1px solid #BAE6FD',
    color: '#0369A1',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: 600,
  },
  systemAuditTime: {
    color: '#718096',
    fontWeight: 400,
  },
  bubbleRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
  },
  avatarComplainant: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#EDF2F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarAdmin: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#FAD465',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '16px',
    boxShadow: '0 2px 6px rgba(1, 31, 57, 0.04)',
  },
  senderHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '6px',
  },
  senderName: {
    fontSize: '12px',
    fontWeight: 700,
  },
  msgTime: {
    fontSize: '10px',
  },
  msgBody: {
    fontSize: '13px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #DCE4EC',
  },
  inputArea: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #DCE4EC',
    fontSize: '13px',
    color: '#011F39',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none',
  },
  sendBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#011F39',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '13px',
    height: '42px',
  },
};
