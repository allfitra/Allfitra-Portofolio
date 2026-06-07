import React, { useState } from 'react';
import { MainLayout } from '@/components/Layouts';
import { useTheme } from '@/utils/themeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// fetch api
import { postMessage } from '@/database/fetch-api';

export const AnonymousPage = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  return (
    <MainLayout title="Anonymous Message">
      <div className="flex flex-col py-5 fade-in-up">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto w-full px-4 sm:px-6 z-10">
          <MessageBox
            theme={theme}
            username={username}
            setUsername={setUsername}
            message={message}
            setMessage={setMessage}
          />
          <HaveFunBox onSelectMessage={(text) => setMessage(text)} />
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

const MessageBox = ({ theme, username, setUsername, message, setMessage }) => {
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
// 🎲 IDE PESAN ACAK (ICEBREAKERS & CURHAT)
// ============================================================
const SUGGESTED_MESSAGES = [
  "Kesan pertama kamu pas kenal aku gimana sih? Jujur aja ya!\n>>>\n ",
  "Ada hal manis atau kebaikan yang pernah aku lakuin tapi belum sempat kamu ucapin makasih gak?\n>>>\n ",
  "Kalau boleh jujur, menurut kamu aku tipe orang yang kayak gimana sih pas lagi ngobrol?\n>>>\n ",
  "Ada saran atau masukan gak biar aku bisa jadi teman yang lebih baik lagi buat kamu?\n>>>\n ",
  "Kira-kira apa satu sifat aku yang paling kamu suka, dan mana yang paling bikin sebel?\n>>>\n ",
  "Ada cerita seru atau curhatan kecil yang pengen kamu bagi hari ini? Aku siap dengerin.\n>>>\n ",
  "Hal yang paling random tapi pernah kita lakuin bareng yang bikin kamu ngakak itu apa?\n>>>\n ",
  "Pernah gak kamu ngelakuin sesuatu karena gabut? Cerita dong!\n>>>\n ",
  "Kalau kita bisa tukeran hidup selama sehari, hal pertama yang mau kamu lakuin apa?\n>>>\n ",
  "Apa satu kebiasaan kecilku yang menurut kamu paling nyebelin sekaligus lucu?\n>>>\n ",
  "Kalau aku jadi karakter anime, kira-kira aku cocok jadi apa dan kenapa?\n>>>\n ",
  "Ada hal yang pengen banget kamu lakuin tapi belum kesampaian? Mungkin aku bisa bantu dengan idenya!\n>>>\n ",
  "Kalo aku punya kekuatan super, menurut kamu aku bakal paling berguna buat ngapain?\n>>>\n ",
  "Pernah gak kamu ngerasa bete tapi tiba-tiba jadi seneng gara-gara hal kecil? Ceritain dong!\n>>>\n ",
  "Apa pendapat kamu tentang aku dari sudut pandang yang beda, bukan cuma dari interaksi kita sekarang?\n>>>\n ",
  "Kalau kamu bisa ngasih aku tantangan selama sehari, apa tantangan paling random yang bakal kamu kasih?\n>>>\n ",
  "Ada hal yang pengen kamu tanyain tapi malu mau nanya langsung? Jangan ragu di sini ya!\n>>>\n ",
  "Pernahkah kamu berpikir kalau sifatku ini mirip orang terkenal? Siapa hayo?\n>>>\n ",
  "Menurutmu, apa satu hal yang harus aku perbaiki dari diriku?\n>>>\n ",
  "Pernahkah kamu merasa kesepian terus tiba-tiba ada hal yang bikin kamu senyum? Ceritain dong!\n>>>\n ",
];

const HaveFunBox = ({ onSelectMessage }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleNextMessage = () => {
    setIsSpinning(true);
    setMessageIndex((prev) => (prev + 1) % SUGGESTED_MESSAGES.length);
    setIsCopied(false);
    setTimeout(() => setIsSpinning(false), 300);
  };

  const handleUseMessage = () => {
    onSelectMessage(SUGGESTED_MESSAGES[messageIndex]);
    setIsCopied(true);
    toast.info("Pesan dimasukkan ke kotak input!", {
      autoClose: 1500,
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: true,
    });
    setTimeout(() => setIsCopied(false), 2000);

    // Focus the message input
    const messageInput = document.getElementById('message');
    if (messageInput) {
      messageInput.focus();
    }
  };

  return (
    <div className="flex card-panel relative overflow-hidden w-full h-full min-h-[400px] flex-col justify-between p-6 sm:p-8 group border transition-all duration-300"
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-400" />
            <span
              className="relative inline-flex rounded-full h-3 w-3 bg-green-500"
              style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.7)' }}
            />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-green-400">
            Status: Siap Mendengar
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
          Inspirasi <span style={{ color: 'var(--accent-purple)' }}>Pesan</span>
        </h2>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          Bingung mau kirim pesan apa? Pilih ide pesan di bawah ini untuk memulai obrolan hangat secara anonim!
        </p>
      </div>

      {/* Interactive Message Generator Box */}
      <div className="relative z-10 mb-4 p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 bg-white/5 flex flex-col justify-between min-h-[140px]"
        style={{ borderColor: 'var(--glass-border)' }}>

        {/* Title/Label */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--accent-pink)' }}>
            💡 Ide Pesan #{messageIndex + 1}
          </span>
          {/* <span className="text-[10px] font-mono opacity-50" style={{ color: 'var(--text-tertiary)' }}>
            Interaktif
          </span> */}
        </div>

        {/* Message Content */}
        <p className={`text-sm font-medium leading-relaxed my-2 transition-all duration-300 ${isSpinning ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`} style={{ color: 'var(--text-primary)' }}>
          "{SUGGESTED_MESSAGES[messageIndex]}"
        </p>

        {/* Action Buttons inside Card */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleNextMessage}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 border hover:bg-white/5 active:scale-95"
            style={{ borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' }}
          >
            <span className={`inline-block ${isSpinning ? 'animate-spin' : ''}`}>🎲</span>
            Acak Pesan
          </button>

          <button
            type="button"
            onClick={handleUseMessage}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 text-white"
            style={{
              background: isCopied
                ? 'linear-gradient(90deg, #10B981, #059669)'
                : 'linear-gradient(90deg, var(--accent-purple), var(--accent-pink))',
            }}
          >
            {isCopied ? '✓ Terpilih!' : '✍️ Gunakan Pesan'}
          </button>
        </div>
      </div>

      {/* Cozy Current Vibe Card */}
      <div className="relative z-10 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:bg-white/5 flex flex-col gap-3"
        style={{ background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.04)' }}>

        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <span className="text-base">🍃</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
              Vibe Hari Ini
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            "Menikmati hari ini dengan santai sambil ditemani segelas kopi hangat. Selalu siap buat dengerin cerita atau curhatan seru darimu. Drop a message! ☕✨"
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="text-[9px] font-mono px-2 py-1 rounded-md border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.04)', color: 'var(--text-tertiary)' }}>
              🔋 Survival Mode
            </span>
            <span className="text-[9px] font-mono px-2 py-1 rounded-md border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.04)', color: 'var(--text-tertiary)' }}>
              💬 Open for Curhat
            </span>
            <span className="text-[9px] font-mono px-2 py-1 rounded-md border"
              style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.04)', color: 'var(--text-tertiary)' }}>
              🌱 Social Life
            </span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 mt-5 pt-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-[11px] font-mono leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          <span style={{ color: 'var(--accent-cyan)' }}>&gt;</span> Identitas pengirim 100% anonim. Silakan sampaikan apa saja dengan santai!
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
