type LeaveMeAloneTypeScript = Record<string, any>;

function unhandleError(place: string) {
    return ({ error, event }: LeaveMeAloneTypeScript) => {
        console.error(`An error occurred on the ${place} side:`, error, event);
    };
}

export const serverErrorUnHandler = unhandleError("server");
export const clientErrorUnHandler = unhandleError("server");
