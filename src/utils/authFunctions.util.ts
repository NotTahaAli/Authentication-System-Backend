import users from "../db/functions/users";

export function checkPasswordRequirements(password: any) {
    if (typeof (password) != "string")
        throw { status: 400, message: "Password is Missing or Invalid." };
    if (password.length < 8)
        throw { status: 400, message: "Length of Password can not be less than 8 characters." };
    if (!(password.match(/([A-Z])/)))
        throw { status: 400, message: "Password must contain atleast 1 uppercase letter." };
    if (!(password.match(/([a-z])/)))
        throw { status: 400, message: "Password must contain atleast 1 lowercase letter." };
    if (!(password.match(/([0-9])/)))
        throw { status: 400, message: "Password must contain atleast 1 digit." };
    if (!(password.match(/([^A-Za-z0-9])/)))
        throw { status: 400, message: "Password must contain atleast 1 special character." };
}

export function checkUsernameRequirements(username: string) {
    if (typeof (username) != "string")
        throw { status: 400, message: "Username is Missing or Invalid." };
    if (username.length < 3)
        throw { status: 400, message: "Length of Username can not be less than 3 characters." };
}

export async function checkUsernameDoesntExist(username: string) {
    if (await users.getUserDataFromUsername(username)) {
        throw { status: 400, message: "Username already used." }
    }
}