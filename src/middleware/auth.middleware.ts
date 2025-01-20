import { Request, Response, NextFunction } from 'express';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    // Here you would typically verify the JWT token
    // For now, we'll just check if the header exists
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};