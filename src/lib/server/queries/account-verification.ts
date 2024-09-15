export const USERNAME_EMAIL_CONFLICT =
    "SELECT user_id,created FROM auth.email_authorization WHERE used IS NULL AND email_authorization_id = $1 LIMIT 1;";
export const CREATE_SESSION =
    "INSERT INTO auth.session(user_id,ip,user_agent) VALUES($1,$2,$3) RETURNING session_id, expires, (period).starting created, (period).ending expired;";
export const DISABLE_EMAIL_AUTHORIZATION =
    "UPDATE auth.email_authorization SET used = now() WHERE user_id = $1;";
export const ENABLE_USER_ACCOUNT =
    "INSERT INTO auth.user_log(user_id,action,data) VALUES($1,'ENABLE',NULL);";
export const GRANT_USER_PERMISSIONS =
    "UPDATE auth.user SET type = 'USER' WHERE username = $1;";
