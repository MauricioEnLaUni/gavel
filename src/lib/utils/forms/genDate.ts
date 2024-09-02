import type { FormFieldCatalog } from "$cmp/superforms/types";
import { formatHTMLTag } from "./formatHTML";

export function genDate(
    children: string,
    tag: string,
    container: any = {},
    etiqueta: any = {},
    input: any = {},
) {
    const name = tag !== "" ? tag : formatHTMLTag(children);

    return {
        name,
        selection: "TEXT-INPUT" as FormFieldCatalog,
        variant: "FECHA",
        rest: {
            container: { ...container },
            etiqueta: { ...etiqueta, children },
            input: {
                format: "dd/MM/yyyy",
                ...input,
            },
        },
    };
}
