import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/Layouts';
import { useTheme } from '@/utils/themeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      className={`mt-[70px] rounded-xl p-5 shadow-lg md:mt-0 
          ${theme === 'dark' ? 'bg-gray-400 text-black' : 'bg-gray-800 text-white'}`}
    >
      <h1 className="text-2xl font-bold">Anonymous Message</h1>
      <p className="mt-2">Send me a message anonymously!</p>
      <form className="mt-2 flex w-full flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="username (anonymous)"
          className={`w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring focus:ring-green-400 
                ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        />
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="your message"
          className={`h-[230px] w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring focus:ring-green-400 
                ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        ></textarea>

        <button
          onClick={handleSubmitMessage}
          className="ho'ver:bg-blue-600 w-full rounded-md bg-blue-500 py-2 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};

const HaveFunBox = () => {
  return (
    <div className="hidden items-center justify-center rounded-xl bg-[#009999] p-6 shadow-lg md:flex">
      <h1 className="text-5xl text-black">Ongoing</h1>
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
