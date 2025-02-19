

export interface Entry{
    title:string,
    keywords:string[],
    categories:string[],
    content:string,
    dateMMDDYYYY:string,
    _id:string
}

export interface EntryCollection{
    collection:Entry[]
}

