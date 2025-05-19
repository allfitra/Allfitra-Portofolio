import { MainLayout } from '@/components/Layouts';
import { getMessages } from '@/database/fetch-api';
import { useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';

export const MessagesListPage = () => {
  const [messagesData, setMessagesData] = useState([]);

  useEffect(() => {
    getMessages()
      .then((data) => {
        // Mapping data setelah diambil
        const mappedMessages = data.map(({ id, username, message }) => ({
          id,
          username: username, // Asumsi sender adalah nama
          message: message, // Asumsi content adalah pesan
        }));
        setMessagesData(mappedMessages); // Menyimpan data yang sudah dipetakan

        // setLoading(false); // Mengubah status loading
      })
      .catch((error) => {
        // setError(error); // Menangani error jika terjadi
        // setLoading(false); // Mengubah status loading meskipun ada error
      });
  }, []);

  return (
    <MainLayout title="Messages List">
      <div className="overflow-x-hidden">
        <Fade direction="down">
          <h1 className="text-center font-serif text-4xl font-bold">Messages List</h1>
        </Fade>
        <div className="mt-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="w-5 px-6 py-3">
                    No.
                  </th>
                  <th scope="col" className="w-[200px] px-6 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {messagesData.map((message, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{message.username}</td>
                    <td className="px-6 py-4">{message.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
