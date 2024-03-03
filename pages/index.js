import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  const [hashtag, setHashtag] = useState();

  const getData = async (tag) => {
    if (tag) {
      const response1 = await fetch('/api/getNews', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response1.json();

      setHashtag(data);
    }
  };

  return (
    <>
      <Head>
        <title>AI NEWS Generator</title>
      </Head>
      <div className="m-auto h-screen  bg-gradient-to-t from-white via-blue-200 to-white">
        <main className="m-auto flex h-screen max-w-5xl flex-col">
          <div className="flex h-full flex-col items-center justify-between gap-6 p-4 py-24">
            <div className="flex w-full flex-col items-center gap-10">
              <div className="line flex flex-col items-center text-center text-2xl font-extrabold sdm:text-4xl sm:gap-3 md:text-5xl mdx:text-6xl ">
                <span>Generate AI Article</span>
              </div>

              <button
                onClick={getData}
                className="flex items-center gap-2 rounded-full border border-gray-700 bg-white px-3 py-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-1 "
              >
                <svg
                  dataSlot="icon"
                  fill="none"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>
                <span className=" font-medium text-gray-700">Generate</span>
              </button>

              {hashtag && (
                <div className=" mb-24 flex max-w-2xl flex-col gap-6 text-xs text-gray-600 ">
                  <div>{hashtag?.title}</div>
                  <div>{hashtag?.publishedAt}</div>
                  <img src={hashtag.urlToImage && hashtag.urlToImage} />
                  <div className="text-justify">{hashtag?.content}</div>
                  <a
                    className="underline"
                    target="_blank"
                    href={hashtag?.source?.url && hashtag?.source?.url}
                  >
                    {hashtag?.source?.url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
