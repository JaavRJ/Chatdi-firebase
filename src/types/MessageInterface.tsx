
export interface MessageInterface {
    msg: {
        reactions: JSX.Element[]
        msg: any,
        type: string,
        sendDate: number
    },
    author: any,
    key: string,
    idmsg: string,
    chatId: string,
    showUsername: boolean
}