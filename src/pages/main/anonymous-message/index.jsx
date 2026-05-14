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
            placeholder="Type your message here..."
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
// 🚀 SYSTEM CORE STATUS — real-time telemetry
// ============================================================
const myStatus = {
  isOnline: true,
  mission: 'Chasing new vibes.',
  orbit: 'Need Support system',
  energy: {
    label: 'Warp Core Energy',
    level: 18,
    icon: '⚡',
    text: 'Survival mode',
  },
  note: 'Isi pesannya siapa tau bisa ngebantu — dihujat pun tak masalah. 🙌',
};
// ============================================================

const HaveFunBox = () => {
  const { energy } = myStatus;
  return (
    <div className="hidden lg:flex card-panel relative overflow-hidden w-full h-full min-h-[400px] flex-col justify-between p-8 group border"
      style={{ borderColor: 'var(--glass-border)', background: 'var(--glass-panel)' }}>

      {/* Decorative glow blobs */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'var(--accent-cyan)', filter: 'blur(80px)' }} />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'var(--accent-purple)', filter: 'blur(80px)' }} />

      {/* Header */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center gap-2 mb-2">
          {/* Live indicator */}
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${myStatus.isOnline ? 'bg-cyan-400' : 'bg-gray-500'}`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${myStatus.isOnline ? 'bg-cyan-500' : 'bg-gray-600'}`}
              style={{ boxShadow: myStatus.isOnline ? '0 0 10px var(--accent-cyan)' : 'none' }}
            />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest uppercase"
            style={{ color: myStatus.isOnline ? 'var(--accent-cyan)' : 'var(--text-tertiary)' }}>
            {myStatus.isOnline ? 'System Online' : 'System Offline'}
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
          Available <span style={{ color: 'var(--accent-cyan)' }}>Status</span>
        </h2>
        {/* <p className="text-xs mt-1 font-mono opacity-60" style={{ color: 'var(--text-tertiary)' }}>
          &gt; real_time_telemetry_v1.0
        </p> */}
      </div>

      {/* Status cards */}
      <div className="relative z-10 flex flex-col gap-3 font-mono">

        {/* Mission */}
        <div className="flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:bg-white/5"
          style={{ background: 'linear-gradient(90deg, rgba(0,240,255,0.05) 0%, transparent 100%)', borderColor: 'rgba(0,240,255,0.1)' }}>
          <span className="text-2xl mt-0.5 grayscale group-hover:grayscale-0 transition-all duration-300">🎯</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent-cyan)' }}>
              Current Directive
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {myStatus.mission}
            </p>
          </div>
        </div>

        {/* Distress Beacon */}
        <div className="flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:bg-white/5"
          style={{ background: 'linear-gradient(90deg, rgba(167,139,250,0.05) 0%, transparent 100%)', borderColor: 'rgba(167,139,250,0.1)' }}>
          <span className="text-2xl mt-0.5 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:animate-pulse">🛟</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent-purple)' }}>
              Distress Beacon
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {myStatus.orbit}
            </p>
          </div>
        </div>

        {/* Energy */}
        <div className="flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:bg-white/5"
          style={{ background: 'linear-gradient(90deg, rgba(236,72,153,0.05) 0%, transparent 100%)', borderColor: 'rgba(236,72,153,0.1)' }}>
          <span className="text-2xl mt-0.5 grayscale group-hover:grayscale-0 transition-all duration-300">{energy.icon}</span>
          <div className="flex flex-col flex-1 gap-1.5">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-pink)' }}>
                {energy.label}
              </p>
              <span className="text-[10px] font-bold" style={{ color: 'var(--accent-pink)' }}>
                {energy.level}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${energy.level}%`,
                  background: energy.level <= 20
                    ? 'var(--accent-pink)'
                    : energy.level <= 50
                      ? '#f59e0b'
                      : 'var(--accent-cyan)',
                  boxShadow: `0 0 10px ${energy.level <= 20 ? 'var(--accent-pink)' : 'var(--accent-cyan)'}`
                }}
              />
            </div>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {energy.text}
            </p>
          </div>
        </div>

      </div>

      {/* Footer note */}
      <div className="relative z-10 mt-6 pt-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>&gt;</span> {myStatus.note}
          <span className="animate-pulse inline-block w-1.5 h-3 ml-1 align-middle" style={{ background: 'var(--accent-cyan)' }}></span>
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
