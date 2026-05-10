import React, { useState } from 'react';
import { MainLayout } from '@/components/Layouts';
import { useTheme } from '@/utils/themeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import images
import {
  anonymousBackground,
  catKnitting,
  comingSoonBackground,
  waitingAvatar,
} from '@/assets/Other';

// fetch api
import { postMessage } from '@/database/fetch-api';

export const AnonymousPage = () => {
  const { theme } = useTheme();

  return (
    <MainLayout title="Anonymous Message">
      <div className="flex flex-col py-5 fade-in-up">

        {/* Header Section */}
        {/* <div className="text-center mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[var(--accent-purple)] opacity-10 blur-[80px] rounded-full pointer-events-none"></div>
          <h1 className="text-5xl md:text-6xl font-black mb-3 relative z-10">
            Anonymous <span className="text-gradient">Message</span>.
          </h1>
          <p className="text-lg relative z-10 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Feel free to vent, share advice, thoughts, or even rant about me here!
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto w-full px-4 sm:px-6 z-10">
          <MessageBox theme={theme} />
          <HaveFunBox />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme={theme}
          className="mt-[-100px] md:mt-[-100px] md:mr-[-150px]"
        />
      </div>
    </MainLayout>
  );
};

const MessageBox = ({ theme }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    const words = message.trim().split(/\s+/);

    if (!message || message.trim() === '') {
      return toast.error('Jangan kirim pesan kosong', {
        theme: theme,
        draggable: true,
      });
    }
    if (words.length < 3) {
      return toast.warn('Pesan anda terlalu pendek', { theme });
    }

    const itemData = {
      username: username.trim() === '' ? 'anonymous' : username,
      message: message,
      createdAt: new Date().toISOString(),
    };

    postMessage(itemData)
      .then(() => {
        toast.success(
          <div className="text-sm">
            <p className="font-bold">Pesan berhasil dikirim!</p>
            <p>Terima kasih :)</p>
          </div>,
          {
            theme: theme,
            draggable: true,
            icon: <SuccessSendIcon />,
          }
        );
      })
      .finally(() => {
        setUsername('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        toast.error(
          <div className="text-sm">
            <p className="font-bold">Pesan gagal dikirim!</p>
            <p>Harap lapor developer.</p>
          </div>,
          {
            theme: theme,
            draggable: true,
          }
        );
      });
  };

  return (
    <div className="card-panel hover-glow p-6 sm:p-8 w-full flex flex-col h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-cyan)] opacity-10 blur-3xl pointer-events-none rounded-full"></div>

      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send a Message</h2>

      <form className="flex flex-col gap-5 flex-grow z-10" onSubmit={handleSubmitMessage}>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider pl-1" style={{ color: 'var(--text-tertiary)' }}>Username (Optional)</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="anonymous"
            className="w-full rounded-xl p-3 focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>

        <div className="flex flex-col gap-1 flex-grow">
          <label className="text-xs font-semibold uppercase tracking-wider pl-1" style={{ color: 'var(--text-tertiary)' }}>Message</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message here... (minimal 3 kata)"
            className="w-full h-full min-h-[160px] rounded-xl p-4 focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          ></textarea>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            className="w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,240,255,0.3)] flex justify-center items-center gap-2"
            style={{
              background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
              color: '#ffffff'
            }}
          >
            Send Message
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>

          <p className="text-xs text-center font-medium mt-2 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            <span className="text-[var(--accent-pink)]">🔒</span> Identitas pengirim sepenuhnya anonim.
            <br />
            <span className="opacity-60 italic">
              Masukkan nomor/email jika ada pertanyaan yang butuh untuk dijawab.
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

// ============================================================
// ✏️ EDIT STATUS SAYA DI SINI — ubah sesuai mood/aktivitas mu!
// ============================================================
const myStatus = {
  isOnline: true,
  activity: 'Vibe coding bareng lagu kesukaan 🎵',
  vibe: 'Butuh Support Sistem',
  battery: {
    label: 'Social Battery',
    level: 23,
    icon: '🔋',
    text: 'Survival Mode',
  },
  note: 'Isi pesannya siapa tau bisa ngebantu — dihujat pun tak masalah. 🙌',
};
// ============================================================

const HaveFunBox = () => {
  const { battery } = myStatus;
  return (
    <div className="hidden lg:flex card-panel relative overflow-hidden w-full h-full min-h-[400px] flex-col justify-between p-8 group">

      {/* Decorative glow blobs */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none opacity-10"
        style={{ background: 'var(--accent-cyan)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none opacity-10"
        style={{ background: 'var(--accent-purple)', filter: 'blur(60px)' }} />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          {/* Live indicator */}
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${myStatus.isOnline ? 'bg-emerald-400' : 'bg-gray-500'}`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${myStatus.isOnline ? 'bg-emerald-500' : 'bg-gray-600'}`}
            />
          </span>
          <span className="text-xs font-mono font-bold tracking-wider uppercase"
            style={{ color: myStatus.isOnline ? '#34d399' : 'var(--text-tertiary)' }}>
            {myStatus.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          Status <span style={{ color: 'var(--accent-cyan)' }}>Saya</span>
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Diupdate secara manual — tergantung mood
        </p>
      </div>

      {/* Status cards */}
      <div className="relative z-10 flex flex-col gap-3">

        {/* Activity */}
        <div className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ background: 'rgba(0,240,255,0.04)', borderColor: 'rgba(0,240,255,0.15)' }}>
          <span className="text-xl mt-0.5">🎧</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--accent-cyan)' }}>
              Lagi ngapain
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {myStatus.activity}
            </p>
          </div>
        </div>

        {/* Vibe */}
        <div className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ background: 'rgba(167,139,250,0.04)', borderColor: 'rgba(167,139,250,0.15)' }}>
          <span className="text-xl mt-0.5">✨</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--accent-purple)' }}>
              Vibe hari ini
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {myStatus.vibe}
            </p>
          </div>
        </div>

        {/* Social Battery */}
        <div className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ background: 'rgba(236,72,153,0.04)', borderColor: 'rgba(236,72,153,0.15)' }}>
          <span className="text-xl mt-0.5">{battery.icon}</span>
          <div className="flex flex-col flex-1 gap-1">
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--accent-pink)' }}>
              {battery.label}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${battery.level}%`,
                    background: battery.level <= 20
                      ? 'var(--accent-pink)'
                      : battery.level <= 50
                        ? '#f59e0b'
                        : 'var(--accent-cyan)',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-pink)' }}>
                {battery.level}%
              </span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {battery.text}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {battery.sub}
            </p>
          </div>
        </div>

      </div>

      {/* Footer note */}
      <div className="relative z-10 p-4 rounded-xl text-center border border-dashed"
        style={{ borderColor: 'var(--glass-border)' }}>
        <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
          "{myStatus.note}"
        </p>
      </div>

    </div>
  );
};

const SuccessSendIcon = () => {
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500">
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
};
