
export enum TokenState {
    Blacklisted = 0,
    Active = 1
}

export interface Token {
    id: string,
    userID: string,
    parentID?: string
}