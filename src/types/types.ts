
export interface IError{
    status: "error",
    message: string
}

export interface ISuccess<T>{
    status: "success",
    data: T
}