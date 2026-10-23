import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { config } from '../config';

export interface IJwtPayload {
    exp: number;
    iat: number;
    login: string;
    role: string;
    sub: string;
}

export interface ISignTokenInput {
    id: string;
    login: string;
    role: string;
}

export function signToken(input: ISignTokenInput): string {
    return jwt.sign(
        { login: input.login,
            role: input.role,
            sub: input.id },
        config.jwtSecret,
        { algorithm: 'HS256',
            expiresIn: `${config.jwtTtlDays}d` }
    );
}

export function verifyToken(token: string): IJwtPayload {
    return jwt.verify(token, config.jwtSecret, { algorithms: [ 'HS256' ] }) as IJwtPayload;
}

export { TokenExpiredError };
