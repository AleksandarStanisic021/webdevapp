/**
 * Type definitions for better IDE autocomplete support
 */

declare namespace Express {
  interface Request {
    user?: {
      _id: string;
      username: string;
      email: string;
    };
  }
}

export {};
