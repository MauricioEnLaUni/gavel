const lettersAndNumbers = /[^A-z0-9]/g;
const usernameAllowedChars = /[^A-z0-9_]/g;
const emailAllowedChars = /[^A-z0-9_.]/g;

export function sanitize(
    value: unknown,
    regex: RegExp = lettersAndNumbers,
    form: string = "NFC",
) {
    return String(value).normalize(form).replace(regex, "");
}

export function sanitizeUsername(username: unknown) {
    return sanitize(username, usernameAllowedChars);
}

export function sanitizeEmail(email: unknown) {
    const [name, server] = String(email).split("@");

    if (!name || !server || name.length < 2 || server.length < 4) {
        return null;
    }
    const firstPart = sanitize(name, emailAllowedChars);
    const [serv, suffix] = server.split(/\./);

    const sanitizedServer = serv
        .normalize("NFC")
        .replace(emailAllowedChars, "");
    const sf = sanitize(suffix, /[^A-z]/g);

    if (firstPart !== name || sanitizedServer !== serv || sf !== suffix) {
        return null;
    }

    return `${name}@${serv}.${sf}`;
}
