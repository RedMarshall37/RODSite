export interface DeveloperAnswer {
    ID: number;
    Text: string;
    DateTime: string;
    UserID: number;
    user?: User;
}

export interface Message {
    ID: number;
    Text: string;
    DateTime: string;
    UserID: number;
    user?: User;
    developerAnswers: DeveloperAnswer[];
}

export interface User {
    ID: number;
    Nickname: string;
}
