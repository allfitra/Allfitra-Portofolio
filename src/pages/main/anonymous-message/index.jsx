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

          <p className="text-xs text-center font-medium mt-2" style={{ color: 'var(--text-tertiary)' }}>
            <span className="text-[var(--accent-pink)]">🔒</span> Identitas pengirim sepenuhnya anonim.
          </p>
        </div>
      </form>
    </div>
  );
};

const HaveFunBox = () => {
  return (
    <div className="hidden lg:flex card-panel relative overflow-hidden w-full h-full min-h-[400px] items-center justify-center p-6 group">

      {/* Dynamic Background Overlay */}
      <div
        className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-cover bg-center"
        style={{ backgroundImage: `url(${comingSoonBackground})` }}
      />
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, var(--card-bg) 10%, transparent 90%)' }}></div>
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, var(--card-bg) 5%, transparent 50%)' }}></div>

      <div className="relative z-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black mb-2 opacity-50 transition-opacity duration-300 group-hover:opacity-100" style={{ color: 'var(--text-primary)' }}>
          Coming Soon
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>More interactive features are on the way.</p>
      </div>

      <div className="absolute bottom-0 left-4 z-20 transition-transform duration-500 group-hover:-translate-y-2">
        <img className="w-[140px] md:w-[170px] drop-shadow-2xl" src={catKnitting} alt="Meoww" />
      </div>

      <div className="absolute bottom-0 right-[-1rem] z-20 transition-transform duration-500 group-hover:-translate-x-4">
        <img className="w-[160px] md:w-[200px] drop-shadow-2xl" src={waitingAvatar} alt="Help me" />
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
