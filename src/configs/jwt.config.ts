export const getJWTSecret = ()=>{
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length == 0) {
        throw new Error("JWT Secret Not Configured.");
    }
    if (process.env.JWT_SECRET.length < 10)
        throw new Error("JWT Secret must be atleast 10 characters.")
    return process.env.JWT_SECRET;
}