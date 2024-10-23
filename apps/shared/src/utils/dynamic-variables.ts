export function replaceField(fieldString: string, data: { [key: string]: string }): string {
    return fieldString.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '');
}
