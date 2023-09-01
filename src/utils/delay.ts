
export const delay = async <T> (timeout: number, fn: () => T | Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(fn());
            } catch (err) {
                reject(err);
            }
        }, timeout);
    })
};
