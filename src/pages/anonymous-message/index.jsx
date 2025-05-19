import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layouts';
import { useTheme } from '@/utils/themeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import images
import { anonymousBackground, waitingAvatar } from '@/assets/Other';

// fetch api
import { postMessage } from '@/database/fetch-api';

export const AnonymousPage = () => {
  return (
    <MainLayout title="Anonymous Message">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <MessageBox />
        <HaveFunBox />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </MainLayout>
  );
};

const MessageBox = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    const words = message.trim().split(/\s+/);

    if (!message || message.trim() === '') {
      return toast.error('Jangan kirim pesan kosong', {
        theme: theme,
        draggable: true,
      });
    }
    if (words.length < 4) {
      return toast.warn('Pesan anda terlalu pendek');
    }

    // console.log(
    //   `Username: ${username.trim() === '' ? 'anonymous' : username}, Message: ${message}`
    // );
    const itemData = {
      username: username.trim() === '' ? 'anonymous' : username,
      message: message,
    };
    postMessage(itemData)
      .then(() => {
        toast.success(
          <p>
            Pesan berhasil dikirim!! <br />
            Terima kasih :)
          </p>,
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
        console.log(itemData);

        console.error('Error sending message:', error);
        toast.error(
          <p>
            Mohon maaf pesan anda tidak terkirim!! <br />
            Harap lapor developer -_-
          </p>,
          {
            theme: theme,
            draggable: true,
          }
        );
      });
  };
  return (
    <div
      className="relative mt-[70px] rounded-xl bg-cover bg-center p-5 shadow-lg md:mt-0"
      style={{ backgroundImage: `url(${anonymousBackground})` }}
    >
      <div className="absolute inset-0 z-0 rounded-xl bg-black/40" />
      <h1 className="bg-slate-50 bg-opacity-50 text-center text-2xl font-bold text-black">
        Anonymous Message
      </h1>
      <p className="mt-1 bg-slate-50 bg-opacity-50 text-center italic text-black">
        Send me a message anonymously!
      </p>
      <form className="mt-2 flex w-full flex-col gap-4 opacity-95">
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="username (anonymous)"
          className={`w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring focus:ring-green-500 
                ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}
        />
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="your message"
          className={`h-[230px] w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring focus:ring-green-500
                ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}
        ></textarea>

        <button
          onClick={handleSubmitMessage}
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-800"
        >
          Send
        </button>
      </form>
    </div>
  );
};

const HaveFunBox = () => {
  return (
    <div className="relative hidden items-center justify-center rounded-xl bg-[#009999] p-6 shadow-lg md:flex">
      <h1 className="text-6xl text-black">Coming Soon!!</h1>
      <div className="absolute -right-5 bottom-0">
        <img className="w-[200px]" src={waitingAvatar} alt="Waiting Avatar" />
      </div>
    </div>
  );
};

const SuccessSendIcon = () => {
  return (
    <div className="-mt-2">
      <svg
        className="h-5 w-5 rotate-45 text-green-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
        />
      </svg>
    </div>
  );
};
