import type { QueryResult } from "pg";

export const getRows = ({ rows }: QueryResult) => rows;
