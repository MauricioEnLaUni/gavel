export class Result {
    private constructor(
        public readonly code: number | null = null,
        public readonly value: unknown = null,
    ) {}

    public get isSuccess() {
        return this.code === 0x1000;
    }
    public get isError() {
        return this.code !== 0x1000;
    }

    public static success(value: unknown = null) {
        return new Result(0x1000, value);
    }

    public static failure(error: number = 0x0f02) {
        return new Result(error);
    }
}
