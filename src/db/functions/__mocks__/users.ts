import users from "../users";
const mockedUsers = jest.createMockFromModule<typeof users>("../users");

async function getUserDataFromId(user_id: number) {
    if (user_id == 1) {
        return { username: "abc", email: "abc@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 1, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false};
    }
    if (user_id == 2) {
        return { username: "abc2", email: "abc2@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 2, lastChanged: new Date(2020, 11, 10), twoFactor: true };
    }
    if (user_id == 3) {
        return { username: "abc3", email: "abc3@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 3, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false };
    }
    if (user_id == 5) {
        return { username: "abc5", email: "abc5@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 5, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false }
    }
    return null;
}

async function getUserDataFromUsername(username: string) {
    if (username == "abc") {
        return { username: "abc", email: "abc@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 1, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false };
    }
    if (username == "abc2") {
        return { username: "abc2", email: "abc2@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 2, lastChanged: new Date(2020, 11, 10), twoFactor: true };
    }
    if (username == "abc3") {
        return { username: "abc3", email: "abc3@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 3, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false };
    }
    if (username == "abc5") {

        return { username: "abc5", email: "abc5@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 5, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false }
    }
    return null;
}

async function getUserDataFromEmail(email: string) {
    if (email == "abc@gmail.com") {
        return { username: "abc", email: "abc@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 1, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false };
    }
    if (email == "abc2@gmail.com") {
        return { username: "abc2", email: "abc2@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: true, id: 2, lastChanged: new Date(2020, 11, 10), twoFactor: true };
    }
    if (email == "abc3@gmail.com") {
        return { username: "abc3", email: "abc3@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 3, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false };
    }
    if (email == "abc5@gmail.com") {

        return { username: "abc5", email: "abc5@gmail.com", password: "$2a$10$mJl02H7asaShG10zYWZx9ekMf16/Y6DsIebg4Dwueezk2HU2CCZZ.", verified: false, id: 5, lastChanged: new Date(Date.now() - (new Date().getTimezoneOffset()+1)*60000), twoFactor: false }
    }
    return null;
}

async function setEmailVerified(email: string) {
    if (!(await getUserDataFromEmail(email))) return false;
    return true;
}

async function addUser(username: string, email: string, passwordHash: string, verified?: boolean) {
    if (username == "abc1") return 4;
    return 1;
}

async function changePassword(user_id: number, passwordHash: string) {
    return true;
}

async function setTwoFactorEnabled(user_id: number, twoFactor: boolean) {
    return true;
}

mockedUsers.changePassword = jest.fn(changePassword);
mockedUsers.addUser = jest.fn(addUser);
mockedUsers.setEmailVerified = jest.fn(setEmailVerified);
mockedUsers.getUserDataFromEmail = jest.fn(getUserDataFromEmail);
mockedUsers.getUserDataFromId = jest.fn(getUserDataFromId);
mockedUsers.getUserDataFromUsername = jest.fn(getUserDataFromUsername);
mockedUsers.setTwoFactorEnabled = jest.fn(setTwoFactorEnabled);

export default mockedUsers;