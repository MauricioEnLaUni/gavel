export type Procedure = () => void;
export type AsyncProcedure = () => Promise<void>;

export type Func = (params: unknown) => unknown;
export type AsyncFunc = () => Promise<unknown>;
