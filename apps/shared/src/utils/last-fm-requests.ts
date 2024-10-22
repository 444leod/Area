import axios from "axios";

const domainName = "http://ws.audioscrobbler.com/2.0/";

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

export interface GetWeeklyScobblesResponse {
  weeklytrackchart: {
    track: Track[];
  };
  "@attr": {
    from: string;
    user: string;
    to: string;
  };
}

export async function getWeeklyScobbles(
  username: string,
  apiKey: string
): Promise<GetWeeklyScobblesResponse | null> {
  try {
    const response = await axios.get(
      `${domainName}?method=user.getweeklytrackchart&user=${username}&api_key=${apiKey}&format=json`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error on LastFM Request:", error.response?.statusText);
      return null;
    } else {
      console.error("Error on LastFM Request:", error);
      return null;
    }
  }
}
