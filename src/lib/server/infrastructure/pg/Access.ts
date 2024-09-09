import pg from "pg";

import {
    // Auth
    PRIVATE_PG_AUTH_HOST as pgAuthHost,
    PRIVATE_PG_AUTH_PORT as pgAuthPort,
    PRIVATE_PG_AUTH_USER as pgAuthUser,
    PRIVATE_PG_AUTH_PASSWORD as pgAuthPassword,
    PRIVATE_PG_AUTH_DB as pgAuthDatabase,

    // Application
    PRIVATE_PG_APP_HOST as pgAppHost,
    PRIVATE_PG_APP_PORT as pgAppPort,
    PRIVATE_PG_APP_USER as pgAppUser,
    PRIVATE_PG_APP_PASSWORD as pgAppPassword,
    PRIVATE_PG_APP_DB as pgAppDatabase,

    // Static variables
    PRIVATE_PG_STATIC_HOST as pgStaticsHost,
    PRIVATE_PG_STATIC_PORT as pgStaticsPort,
    PRIVATE_PG_STATIC_USER as pgStaticsUser,
    PRIVATE_PG_STATIC_PASSWORD as pgStaticsPassword,
    PRIVATE_PG_STATIC_DB as pgStaticsDatabase,
} from "$env/static/private";
import { onError } from "$utl/defaults/onError";
import { getRows } from "$utl/pg/getRows";
import type { QueryBaseParams, QueryParams, SequenceParams } from "$infra/pg/types";

export class Access {
    public static readonly baseParams = {
        db: 0,
        err: onError,
        process: getRows,
    }

    private static readonly credentials: {
        user: string;
        password: string;
        database: string;
        port: number;
        host: string;
    }[] = [
        [pgAppUser,pgAppPassword,pgAppDatabase,pgAppPort,pgAppHost],
        [pgStaticsUser,pgStaticsPassword,pgStaticsDatabase,pgStaticsPort,pgStaticsHost,],
        [pgAuthUser,pgAuthPassword,pgAuthDatabase,pgAuthPort,pgAuthHost],
    ].map(([user,password,database,port,host]) => ({
        user,
        password,
        database,
        port: Number(port),
        host: host,
    }));

    public static readonly APP_DB = 0;
    public static readonly APP_STATIC = 1;
    public static readonly APP_AUTH = 2;

    public static async getPool(db: number = 0) {
        if (db < 0 || db > this.credentials.length) {
            throw new Error("An error has occurred in the database\n.Error code: 0x00100001");
        }
        return await new pg.Pool(
            this.credentials[db]
        ).connect();
    }

    public static async singleQuery(
        query_params: QueryParams,
        rest: QueryBaseParams = this.baseParams,
    ) {
        const { query, params } = query_params;
        const { db, err, process } = rest;

        const pool = await this.getPool(db);
        try {
            return process(
                await pool.query(query, params),
            );
        } catch(e) {
            err(e);
        } finally {
            pool.release();
        }
    }

    public static async all(
        each:QueryParams[],
        rest: QueryBaseParams = this.baseParams,
    ) {
        const { db, err, process } = rest;

        const pool = await this.getPool(db);
        try {
            return (await Promise.all(
                each.map(({ query, params }) => pool.query(query,params))
            )).map(process);
        } catch(e) {
            err(e);
        } finally {
            pool.release();
        }
    }

    public static async sequence(
        { query, params, db, err, process, next }: SequenceParams
    ): Promise<unknown> {
        const pool = await Access.getPool(db);

        try {
            await pool.query("BEGIN;");
            const current = process(
                await pool.query(query, params)
            );
            const recurse = next === null;
            if (!recurse) {
                await pool.query("COMMIT;");
                return current;
            }
            return await this.sequence({ ...next, params: [current] });
        } catch (e) {
            await pool.query("ROLLBACK;");
            err(e);
        } finally {
            pool.release();
        }
    }
}
