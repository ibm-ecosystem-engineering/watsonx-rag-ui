export const leftOuter = <T extends {id: string}>(a: T[], b: T[]): T[] => {
    const ids = b.map(val => val.id);

    return a.filter(val => !ids.includes(val.id));
}

export const rightOuter = <T extends {id: string}>(a: T[], b: T[]): T[] => {
    const ids = a.map(val => val.id);

    return b.filter(val => !ids.includes(val.id));
}

export const inner = <T extends {id: string}>(a: T[], b: T[]): T[] => {
    const ids = a.map(val => val.id);

    return b.filter(val => ids.includes(val.id));
}
