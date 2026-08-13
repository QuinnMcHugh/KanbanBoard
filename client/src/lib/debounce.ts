export function debounce<Args extends unknown[], T>(
    fn: (...args: Args) => T,
    timeInMs: number,
) {
    let timeoutId: number | undefined;

    return (...args: Args): Promise<T> => {
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
        }
        return new Promise((resolve) => {
            timeoutId = window.setTimeout(() => {
                resolve(fn(...args));
            }, timeInMs);
        });
    };
}
