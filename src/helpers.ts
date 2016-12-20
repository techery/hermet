/**
 * Get parameter from env
 *
 * @param {string} key
 * @param {T} def
 * @returns {T}
 */
export function env<T>(key: string, def?: T): T {
    let value: any = process.env[key];

    switch (value) {
        case 'true':
            value = true;
            break;
        case 'false':
            value = false;
            break;
        default:
            // Hack to convert numbers
            if (!isNaN(+value)) {
                value = +value;
            }

            value = value || def;
    }

    return value;
}
