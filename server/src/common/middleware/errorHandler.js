export const errorHandler = (err, req, res, next) => {
    const errorStatus = err.statusCode || 500;
    const errorMessage = err.message || "Something went wrong";
    console.error(err);
    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage
    });
}