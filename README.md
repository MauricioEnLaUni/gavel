# koolectr

The coolesta page to check and track the state of your collection as well as all the money you've poured down a drain.

Developed by an engineering student who really wishes he was on crack right now rather than working on this shit.

## Requirements

You should have at minimum docker and bun.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Success

---

-   0x1000 - General Success
-   0x1001 - Successful Login

### Errors

---

#### 0x1000 - Concrete messages

---

-   0x1001 - Malformed Request, missing code

#### 0x0300 - Standard HTTP Errors

---

-   0x0300 - Bad Request
-   0x0301 - Authorization Failure
-   0x0302 - Payment
-   0x0303 - Forbidden
-   0x0304 - Not Found

#### 0x0200 - Initialization Errors

---

-   0x0200 - Failed to initialize auth cache
-   0x0201 -

### 0x0400 Authentication Errors

---

-   0x0401 - User is disabled
-   0x0402 - Wrong email authorization code
-   0x0403 - Expired email authorization code
-   0x0404 - Username not found
-   0x0405 - Username not found
-   0x0406 - Wrong Password
-   0x0407 - Expired Code
-   0x0408 - Successful Login
-   0x0409 - Username Conflict
-   0x040A - Email Conflict

#### 0x0100 - Database Errors

---

-   0x0100: Connection unavailable
-   0x0101: Requested database is out of range
-   0x0102: Operation Failed at the database layer
-   0x0103:

#### 0x00F00000 - FUBAR

---

-   0x0F01: The backend died, user gets nothing
-   0x0F02: Something's wrong but I don't know what
-   0x0F03: Mishandled Recursion
-   0x0F04: Chain wasn't provided with an action
