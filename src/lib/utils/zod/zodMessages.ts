export const getRequiredMessage = (field: string) => ({
    required_error: `${field} is required`,
});
export const printMessage = (message: string) => ({ message });
