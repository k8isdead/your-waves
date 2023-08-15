// "use client";
// import useSWR from "swr";

import Image from "next/image";

// const fetcher = (url: URL) => fetch(url).then((res) => res.json());

function getArtistAndAlbum(message: string) {
  const [fullName, artistName] = message.match(
    /<strong>(.*?)<\/strong>/
  ) as Array<string>;
  const [album, albumName, year] = message.match(
    /<i>(.*?)<\/i>\s*\((\d{4})\)/
  ) as Array<string>;

  return { artistName, albumName, year };
}

function getLinks(message: string) {
  const spotifyMatch = message.match(/https:\/\/open\.spotify\.com\/[^\s"<>]+/);
  const spotifyUrl = spotifyMatch ? spotifyMatch[0] : null;

  const appleMusicMatch = message.match(
    /https:\/\/music\.apple\.com\/[^\s"<>]+/
  );
  const appleMusicUrl = appleMusicMatch ? appleMusicMatch[0] : null;

  const yandexMusicMatch = message.match(
    /https:\/\/music\.yandex\.ru\/[^\s"<>]+/
  );
  const yandexMusicUrl = yandexMusicMatch ? yandexMusicMatch[0] : null;

  return { spotifyUrl, appleMusicUrl, yandexMusicUrl };
}

export default async function Index() {
  const revalidatedData = await fetch(
    `https://tg.i-c-a.su/json/showusyourwaves?limit=80`,
    {
      next: { revalidate: 60 },
    }
  );
  const { messages } = await revalidatedData.json();

  const messagesWithAlbums = messages?.filter(
    (message: any) =>
      message &&
      typeof message.message === "string" &&
      message?.message?.includes("#хорошийальбомнадобрать") &&
      message?.message?.includes("<strong>")
  );

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-7 lg:px-11">
      <h1 className="text-5xl mt-16">Show Us Your Waves</h1>
      <div className="grid gap-4 grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3">
        {messagesWithAlbums.map(
          ({
            id,
            message,
            media,
          }: {
            id: number;
            message: string;
            media: any;
          }) => {
            const { artistName, albumName, year } = getArtistAndAlbum(message);
            const { spotifyUrl, appleMusicUrl, yandexMusicUrl } =
              getLinks(message);
            getLinks(message);

            const telegramPostLink = `https://t.me/showusyourwaves/${id}`;
            const imageLink =
              media._ === "messageMediaPhoto" ||
              (media._ === "messageMediaWebPage" &&
                media.webpage.site_name.toLowerCase() !== "youtube")
                ? `https://tg.i-c-a.su/media/showusyourwaves/${id}`
                : null;
            return (
              <article
                className="flex flex-col p-4 border border-black transition-colors duration-200 hover:border-red-600"
                key={id}
              >
                {imageLink ? (
                  <Image
                    src={imageLink}
                    width={300}
                    height={300}
                    alt={albumName}
                  />
                ) : (
                  <div className="bg-red-300 w-[300px] h-[300px]" />
                )}
                <div className="flex flex-col mt-4">
                  <h2 className="text-xl font-bold">{artistName}</h2>
                  <h3 className="text-lg font-medium"> {albumName}</h3>
                  <span className="mt-1"> {year}</span>
                </div>

                <ul className="flex flex-col md:flex-row gap-y-1 md:gap-x-3 mt-3">
                  {spotifyUrl && (
                    <li>
                      <a
                        className="transition-colors duration-200 hover:text-red-600"
                        href={spotifyUrl}
                        target="_blank"
                      >
                        Spotify
                      </a>
                    </li>
                  )}
                  {appleMusicUrl && (
                    <li>
                      <a
                        className="transition-colors duration-200 hover:text-red-600"
                        href={appleMusicUrl}
                        target="_blank"
                      >
                        Apple Music
                      </a>
                    </li>
                  )}
                  {yandexMusicUrl && (
                    <li>
                      <a
                        className="transition-colors duration-200 hover:text-red-600"
                        href={yandexMusicUrl}
                        target="_blank"
                      >
                        Yandex Music
                      </a>
                    </li>
                  )}
                </ul>
                <a
                  className="mt-3 transition-colors duration-200 hover:text-red-400"
                  href={telegramPostLink}
                >
                  View post →
                </a>
              </article>
            );
          }
        )}
      </div>
    </div>
  );
}
