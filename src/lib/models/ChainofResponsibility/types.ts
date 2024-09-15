import type { Command } from "$def/Commands";
import { Result } from "$def/Result";

export const breakChain = Symbol("BREAK");
export const undo = Symbol("UNDO");
export const ignore = Symbol("IGNORE");
export const retry = Symbol("RETRY");
export const callback = Symbol("CALLBACK");

export const COR_RESPONSES = {
    [breakChain]: breakChain,
    [undo]: undo,
    [ignore]: ignore,
    [retry]: retry,
    [callback]: callback,
} as const;
export type ChainResponses = (typeof COR_RESPONSES)[keyof typeof COR_RESPONSES];

export type ChainLink<T extends Command> = {
    current: T;
    next: T;
    first?: boolean;
};

export type ResposibilityChainInit<T extends Command> = {
    chain: ChainLink<T>[];
    recursion?: boolean;
    bind?: (link: ChainLink<T>) => Result;
    action?: ChainResponses;
    stack?: ChainLink<T>[];
};
