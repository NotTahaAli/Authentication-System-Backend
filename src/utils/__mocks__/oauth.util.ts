
export async function verify(token: string) {
    switch (token) {
        case "ABC":
            return { googleId: 1, email: "abc@gmail.com" }
        case "ABC3":
            return { googleId: 2, email: "abc3@gmail.com" }
        case "ABC1":
            return { googleId: 3, email: "abc1@gmail.com" }
        case "ABC2":
            return { googleId: 4, email: "abc2@gmail.com" }
        default:
            return null;
    }
}