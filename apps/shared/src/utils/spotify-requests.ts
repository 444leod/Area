import SpotifyWebApi from "spotify-web-api-node";

export class Playlist {
  id: string;
  name: string;
  description: string | null;
  external_urls: { spotify: string };
  followers: { total: number };
  images: { url: string }[];
  owner: { id: string; display_name?: string; uri: string };
  public: boolean;
  tracks: { total: number };
  uri: string;
}

export class SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string, images: { url: string }[], album_type: string, artists: { name: string }[] };
  uri: string;
}

export class PlayingTrack {
  timestamp: number;
  progress_ms: number;
  item: SpotifyTrack;
  is_playing: boolean;
  currently_playing_type: string;
}

export class PlaylistTrack extends SpotifyTrack {
  added_at: string;
  added_by: { id: string; display_name: string; uri: string };
  type?: string;
}

export class SpotifyAPI {
  private spotify: SpotifyWebApi;
  private me: SpotifyApi.UserObjectPrivate | null = null;

  constructor(token: string) {
    this.spotify = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    this.spotify.setAccessToken(token);
  }

  async init() {
    await this.getUserInformations();
  }

  async getUserInformations() {
    if (this.me) {
      return this.me;
    }
    this.me = (await this.spotify.getMe()).body;
    return this.me;
  }

  async getPlaylist(playlistId: string): Promise<Playlist> {
    const playlist = (await this.spotify.getPlaylist(playlistId)).body;
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      external_urls: playlist.external_urls,
      followers: playlist.followers,
      images: playlist.images,
      owner: playlist.owner,
      public: playlist.public,
      tracks: playlist.tracks,
      uri: playlist.uri,
    };
  }

  async getLikedTrackPlaylist(): Promise<Playlist> {
    console.log("fetching me");
    const me = await this.getUserInformations();
    console.log("fetching me");

    return {
      id: "",
      name: "Liked tracks",
      description: null,
      external_urls: { spotify: "" },
      followers: { total: 0 },
      images: [],
      owner: { id: me.id, display_name: me.display_name, uri: me.uri },
      public: false,
      tracks: { total: 0 },
      uri: me.uri,
    };
  }

  async getTrack(trackId: string): Promise<PlaylistTrack> {
    const track = (await this.spotify.getTrack(trackId)).body;

    const added_by = {
      id: this.me.id,
      display_name: this.me.display_name,
      uri: this.me.uri,
    };
    return {
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: { id: any; name: any; uri: any }) => {
        return {
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
        };
      }),
      album: {
        name: track.album.name,
        images: track.album.images as { url: string }[],
        album_type: track.album.album_type,
        artists: track.album.artists as { name: string }[],
      },
      uri: track.uri,
      added_at: "",
      added_by: {
        id: added_by.id,
        display_name: added_by.display_name,
        uri: added_by.uri,
      },
      type: "track",
    };
  }

  async getPlaylistTracks(
    playlistId: string,
    limit: number | null = 10,
  ): Promise<PlaylistTrack[]> {
    let total = 0;
    let tracks = [];
    do {
      const response = await this.spotify.getPlaylistTracks(playlistId, {
        offset: tracks.length,
      });
      tracks = tracks.concat(response.body.items);
      total = response.body.total;
    } while (
      total > tracks.length &&
      (limit === null || tracks.length < limit)
    );

    return await Promise.all(
      tracks.map(async (item) => {
        const added_by = item.added_by || {
          id: this.me.id,
          display_name: this.me.display_name,
          uri: this.me.uri,
        };
        const fullAddedBy = (await this.spotify.getUser(added_by.id)).body;
        return {
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists as { id: any; name: any; uri: any }[],
          album: {
            name: item.track.album.name,
            album_type: item.track.album.album_type,
            images: item.track.album.images as { url: string }[],
            artists: item.track.album.artists as { name: string }[],
          },
          uri: item.track.uri,
          added_at: item.added_at,
          added_by: {
            id: added_by.id,
            display_name: fullAddedBy.display_name,
            uri: added_by.uri,
          },
          type: item.track.type,
        };
      }),
    );
  }

  async getUserPlaylists(): Promise<SpotifyApi.PlaylistObjectSimplified[]> {
    let total = 0;
    let playlists = [];
    do {
      const response = await this.spotify.getUserPlaylists({
        offset: playlists.length,
      });
      playlists = playlists.concat(response.body.items);
      total = response.body.total;
    } while (total > playlists.length);

    return playlists;
  }

  async getLikedTracks(limit: number | null = 10): Promise<PlaylistTrack[]> {
    let total = 0;
    let tracks = [];
    const me = await this.getUserInformations();
    do {
      const response = await this.spotify.getMySavedTracks({
        offset: tracks.length,
        limit: limit === null ? 50 : Math.min(50, limit - tracks.length),
      });
      tracks = tracks.concat(response.body.items);
      total = response.body.total;
    } while (
      total > tracks.length &&
      (limit === null || tracks.length < limit)
    );
    return tracks.map((item) => {
      return {
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists as { id: any; name: any; uri: any }[],
        album: {
          name: item.track.album.name,
          album_type: item.track.album.album_type,
          images: item.track.album.images as { url: string }[],
          artists: item.track.album.artists as { name: string }[],
        },
        uri: item.track.uri,
        added_at: item.added_at,
        added_by: { id: me.id, display_name: me.display_name, uri: me.uri },
        type: "track",
      };
    });
  }

  async likeTrack(trackId: string) {
    await this.spotify.addToMySavedTracks([trackId]);
  }

  async addTrackToPlaylist(playlistId: string, trackId: string) {
    await this.spotify.addTracksToPlaylist(playlistId, [trackId]);
  }

  async getArtistReleases(
    artistId: string,
    limit: number | null = 10,
  ): Promise<SpotifyApi.AlbumObjectSimplified[]> {
    let total = 0;
    let releases = [];
    do {
      const response = await this.spotify.getArtistAlbums(artistId, {
        offset: releases.length,
      });
      releases = releases.concat(response.body.items);
      total = response.body.total;
    } while (
      total > releases.length &&
      (limit === null || releases.length < limit)
    );
    return releases;
  }

  async getArtistReleasesSortedByDateReducedByType(
    artistId: string,
    limit: number | null = 10,
  ): Promise<{ [key: string]: SpotifyApi.AlbumObjectSimplified[] }> {
    const releases = await this.getArtistReleases(artistId, limit);
    return releases
      .sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      )
      .reduce((result, item) => {
        (result[item["album_type"]] = result[item["album_type"]] || []).push(
          item,
        );
        return result;
      }, {});
  }

  async getArtistByName(
    artistName: string,
  ): Promise<SpotifyApi.ArtistObjectFull> {
    const response = await this.spotify.searchArtists(artistName);
    return response.body.artists.items[0];
  }

  async getCurrentlyPlaying(): Promise<PlayingTrack | null> {
    const response = await this.spotify.getMyCurrentPlayingTrack();
    return response.body as PlayingTrack;
  }

  async playRandomLikedTrack() {
    const devices = (await this.spotify.getMyDevices()).body.devices;

    const activeDevice = devices.find(device => device.is_active);
    if (!activeDevice) throw new Error("No active Spotify device found.");

    const likedTracks = await this.getLikedTracks(200);
    if (likedTracks.length === 0) throw new Error("No liked tracks available.");

    const randomTrack = likedTracks[Math.floor(Math.random() * likedTracks.length)];

    await this.spotify.play({
      device_id: activeDevice.id,
      uris: [randomTrack.uri]
    });
  }
}
