export interface SendEmailDTO {
    to: string;
    subject: string;
    body: string;
}

export interface PlaySongDTO {
    deviceId: string;
    songId: string;
}

export interface PlayPlaylistDTO {
    deviceId: string;
    playlistId: string;
    shuffle: boolean;
}

export type ActionDTO = PlaySongDTO | PlayPlaylistDTO | SendEmailDTO;