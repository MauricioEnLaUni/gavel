import type { QueryResult } from "pg";

export type QueryParams = {
    query: string;
    params: unknown[];
};

export type QueryBaseParams = {
    db: number;
    err: (e: unknown) => void;
    process: (rows: QueryResult) => unknown;
};

export type SequenceParams = QueryParams &
    QueryBaseParams & {
        next: SequenceParams | null;
    };
