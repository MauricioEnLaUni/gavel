import type { Command } from "$def/Commands";
import { Result } from "$def/Result";
import {
    breakChain,
    type ChainLink,
    type ResposibilityChainInit,
    undo,
} from "$lib/models";

export class ChainofResponsibility {
    constructor() {}

    chain(cmd: Command[]): ChainLink<Command>[] {
        return cmd.map((current, index) => ({
            first: index === 0,
            current: current,
            next: cmd[index + 1],
        }));
    }

    run<T extends Command>({
        chain,
        recursion = false,
        bind = (cmd: ChainLink<T>) => {
            return cmd.current.execute();
        },
        action = breakChain,
        stack = [],
    }: ResposibilityChainInit<T>) {
        if (recursion) {
            return Result.failure(0x0f03);
        }
        if (action === undo && !stack) {
            return Result.failure(0x0f04);
        }

        let result: Result;
        for (const i in chain) {
            const index = Number(i);
            const current = bind(chain[i]);

            stack.push({
                current: chain[i].current,
                next: chain[index - 1].current,
            });

            if (current.isSuccess) {
                result = current;
                continue;
            }

            if (action === breakChain) {
                result = current;
                break;
            }

            if (action === undo) {
                chain.splice(0);
                result = this.run({
                    chain: stack,
                    recursion: true,
                    bind: (link: ChainLink<T>) => {
                        return link.current.undo();
                    },
                    action: breakChain,
                });
            }
        }
        return result;
    }
}

/**
 * class ResponsibilityChain
 * {
 *     async run({
 *         chain,
 *         recursion = false,
 *         bind = (cmd: ChainLink) => { return cmd.current.execute() },
 *         action = "BREAK",
 *         stack = [],
 *     }: RCProps) {
 *         if (recursion) {
 *             return TResult.Failure(ERRORS.INFINITE_LOOP);
 *         }
 *         if (action === "UNDO" && !stack) {
 *             return TResult.Failure(ERRORS.NOT_IMPLEMENTED);
 *         }
 *
 *         let result: TResult;
 *         for (const i in chain)
 *         {
 *             const index = Number(i);
 *             const current = await bind(chain[i]);
 *
 *             if (index === 0) {
 *                 stack.push({
 *                     current: chain[i].current,
 *                     next: new EmptyCommand(),
 *                 });
 *             } else {
 *                 stack.push({
 *                     current: chain[i].current,
 *                     next: chain[index - 1].current,
 *                 });
 *             }
 *
 *             if (current.isSuccess()) {
 *                 result = current;
 *                 continue;
 *             }
 *
 *             if (action === "BREAK") {
 *                 result = current;
 *                 break;
 *             }
 *             if (action === "UNDO") {
 *                 chain.splice(0);
 *                 this.run({
 *                     chain: stack,
 *                     recursion: true,
 *                     bind: (link: ChainLink) => { return link.current.undo(); },
 *                     action: "BREAK",
 *                 });
 *             }
 *         }
 *
 *         return result;
 *     }
 *
 *
 *
 * }
 */
