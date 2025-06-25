import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { SECRET_KEY } from '../config/token'
import { Socket } from 'socket.io'

interface IToken {
    iat: number
    exp: number
    id: number
}

export function authTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    
    const authorization = req.headers.authorization

    if (!authorization) {
        console.log("Немає bearer заголовка")
        res.json({status: 'error', message: 'Немає bearer заголовка'})
        return
    }

    const [type, token] = authorization.split(' ')
    if (type !== 'Bearer' || !token) {
        console.log("Некоректний bearer заголовок")
        res.json({status: 'error', message: 'Некоректний bearer заголовок'})
        return
    }
    
    try {
        const decodedToken = verify(token, SECRET_KEY) as IToken
        res.locals.userId = decodedToken.id
        next()
    } catch (error) {
        console.log("Некоректний токен")
        res.json({status: 'error', message: 'Некоректний токен'})
    }
}


export function socketAuthMiddleware(
	socket: Socket,
	next: (error?: any) => void
) {
	const token = socket.handshake.auth.token;

	if (!token) {
        console.log("no token")
		next(new Error("no token"));
		return;
	}
	try {
		const decodedToken = verify(token, SECRET_KEY) as IToken;
		socket.data.userId = decodedToken.id;
		next();
	} catch (error) {
        console.log(error)
		next(error);
	}
}