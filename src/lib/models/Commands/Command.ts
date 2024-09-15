import { Result } from "$def/Result";

export type Command = {
    execute(): Result;

    undo(): Result;
};
