
import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = 'your_jwt_secret';

interface DecodedToken {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, secret) as DecodedToken;
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
