

export interface Entry{
    title:string,
    keywords:string[],
    categories:string[],
    content:string,
    dateCreated:Date,
    id:string
}

export interface EntryCollection{
    collection:Entry[]
}

