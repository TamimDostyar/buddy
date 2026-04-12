
class PortSystem extends Error {
    port: number;
    details?;

    constructor(port: number, details?: string) {
        super(`Port ${port} is already in use.`);
        this.port = port;
        this.details = details;
    }
}


// function isError(err: unknown): err is NodeJS.ErrnoException {
//     return (
//         typeof err === "object" &&
//         err !== null &&
//         "code" in err
//     );
// }