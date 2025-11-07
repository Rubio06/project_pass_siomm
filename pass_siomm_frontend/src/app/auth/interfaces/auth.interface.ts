

export interface LogResponse {
    success: boolean;
    message: string;
    data: DataToken
}

export interface DataToken {

    username: string;
    token: string;

}
