import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        const firstErr = err.issues[0];
        return res.status(400).json({
            success: false,
            message: firstErr.message,
        });
    }

    const errorStatus = err.statusCode || 500;
    const errorMessage = err.message || "Something went wrong";
    console.error(err);
    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage
    });
}