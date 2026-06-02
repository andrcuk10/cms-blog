import { Request, Response, NextFunction } from 'express'

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler caught:', err); // For immediate server visibility

    const errorDetails = {
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        method: req.method,
        time: new Date(),
    };

    // Log error details to the console for development/debugging
    console.log("Error details from middleware:", JSON.stringify(errorDetails, null, 2));

    // Check if headers have already been sent to avoid "Can't set headers after they are sent" errors
    if (res.headersSent) {
        return next(err); // Pass to default Express error handler if response already started
    }

    // Determine the appropriate status code and message for the client
    const statusCode = 500; // Custom errors might have a statusCode property
    const message = 'Internal Server Error';

    // Send a generic, user-friendly error response to the client
    res.status(statusCode).json({ message });
    // Note: We don't call next() here unless we explicitly want another error handler to run.
};

export default errorHandler;