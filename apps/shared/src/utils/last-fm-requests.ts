import axios from "axios";

const domainName = "http://ws.audioscrobbler.com/2.0/";

export interface BaseAttr {
  from: string;
  user: string;
  to: string;
}

export interface Track {
  artist: {
    mbid: string;
    "#text": string;
  };
  image: [
    {
      size: string;
      "#text": string;
    },
  ];
  mbid: string;
  url: string;
  name: string;
  "@attr": {
    rank: string;
  };
  playcount: string;
}

export interface GetWeeklyScrobblesResponse {
  weeklytrackchart: {
    track: Track[];
    "@attr": BaseAttr;
  };
}

export interface Album {
  artist: {
    mbid: string;
    "#text": string;
  };
  mbid: string;
  url: string;
  name: string;
  "@attr": {
    rank: string;
  };
  playcount: string;
}

export interface GetWeeklyAlbumsResponse {
  weeklyalbumchart: {
    album: Album[];
    "@attr": BaseAttr;
  };
}

export interface Artist {
  mbid: string;
  url: string;
  name: string;
  "@attr": {
    rank: string;
  };
  playcount: string;
}

export interface GetWeeklyArtistsResponse {
  weeklyartistchart: {
    artist: Artist[];
    "@attr": BaseAttr;
  };
}

type ChartMethod =
  | "user.getweeklytrackchart"
  | "user.getweeklyalbumchart"
  | "user.getweeklyartistchart";

async function makeLastFMRequest<T>(
  username: string,
  apiKey: string,
  method: ChartMethod
): Promise<T | null> {
  try {
    const response = await axios.get<T>(`${domainName}`, {
      params: {
        method,
        user: username,
        api_key: apiKey,
        format: "json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error on LastFM ${method} Request:`,
        error.response?.statusText
      );
    } else {
      console.error(`Error on LastFM ${method} Request:`, error);
    }
    return null;
  }
}

export async function getWeeklyScrobbles(
  username: string,
  apiKey: string
): Promise<GetWeeklyScrobblesResponse | null> {
  return makeLastFMRequest<GetWeeklyScrobblesResponse>(
    username,
    apiKey,
    "user.getweeklytrackchart"
  );
}

export async function getWeeklyAlbums(
  username: string,
  apiKey: string
): Promise<GetWeeklyAlbumsResponse | null> {
  return makeLastFMRequest<GetWeeklyAlbumsResponse>(
    username,
    apiKey,
    "user.getweeklyalbumchart"
  );
}

export async function getWeeklyArtists(
  username: string,
  apiKey: string
): Promise<GetWeeklyArtistsResponse | null> {
  return makeLastFMRequest<GetWeeklyArtistsResponse>(
    username,
    apiKey,
    "user.getweeklyartistchart"
  );
}
