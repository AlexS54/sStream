export interface IHeaders {
    authorization: string;
    [key: string]: string;
}

export interface SongStreamQueryParams {
    id: string;
}

export interface Song {
    title: string;
    fileId: string;
    email: string;
    likes: number;
    dislikes: number;
    isLiked: boolean;
    isDisliked: boolean;
}

export interface UploadSongRequest {
    title: string;
}