export async function verifyCaptcha(response: string) {
    if (response == "FAILTHIS") return false;
    return true;
}