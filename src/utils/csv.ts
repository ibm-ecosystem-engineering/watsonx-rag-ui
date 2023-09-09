
export const parseCsv = (text: string): any[] => {
    return (text.match( /\s*("[^"]*"|'[^']*'|[^,]*)\s*(,|$)/g ) || [])
        .map((text: string) => {
            let m;
            if (text.match(/^\s*,?$/)) return null; // null value
            if (m = text.match(/^\s*"([^"]*)"\s*,?$/)) return m[1]; // Double Quoted Text
            if (m = text.match(/^\s*'([^']*)'\s*,?$/)) return m[1]; // Single Quoted Text
            if (m = text.match(/^\s*(true|false)\s*,?$/)) return m[1] === "true"; // Boolean
            if (m = text.match(/^\s*((?:\+|-)?\d+)\s*,?$/)) return parseInt(m[1]); // Integer Number
            if (m = text.match(/^\s*((?:\+|-)?\d*\.\d*)\s*,?$/)) return parseFloat(m[1]); // Floating Number
            if (m = text.match(/^\s*(.*?)\s*,?$/)) return m[1]; // Unquoted Text
            return text;
        } )
}
