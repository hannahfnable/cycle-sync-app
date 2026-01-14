
export enum MessageResult {
    Success = 'Success',
    Failure = 'Failure',
}

export type Message = {
    result: MessageResult;
    message: string;
};
