export function formatHTMLTag(tag: unknown) {
    return String(tag)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "-");
}
