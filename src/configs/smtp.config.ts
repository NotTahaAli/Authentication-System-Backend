export const getSMTPService = ()=>{
    if (!process.env.SMTP_SERVICE) {
        return undefined;
    }
    return process.env.SMTP_SERVICE;
}

export const getSMTPHost = ()=>{
    if (!process.env.SMTP_HOST) {
        throw new Error("SMTP Host not Configured.");
    }
    return process.env.SMTP_HOST;
}

export const getSMTPPort = ()=>{
    if (!process.env.SMTP_PORT) {
        throw new Error("SMTP Port not Configured.");
    }
    if (isNaN(parseInt(process.env.SMTP_PORT))) {
        throw new Error("SMTP Port incorrect.")
    }
    return parseInt(process.env.SMTP_PORT);
}

export const getSMTPSecure = ()=>{
    if (!process.env.SMTP_SECURE) {
        throw new Error("SMTP Secure not Configured.");
    }
    const isSecure = process.env.SMTP_SECURE.toUpperCase();
    switch (isSecure) {
        case "TRUE":
            return true;
        case "FALSE":
            return false;
        default:
            throw new Error("SMTP Secure incorrect.")
    }
}

export const getSMTPUser = ()=>{
    if (!process.env.SMTP_USER) {
        throw new Error("SMTP User not Configured.");
    }
    return process.env.SMTP_USER;
}

export const getSMTPPass = ()=>{
    if (!process.env.SMTP_PASS) {
        throw new Error("SMTP Pass not Configured.");
    }
    return process.env.SMTP_PASS;
}