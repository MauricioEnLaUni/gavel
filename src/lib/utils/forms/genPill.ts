import type { FormFieldCatalog } from "$cmp/superforms/types";
import { formatHTMLTag } from "./formatHTML";

export function genPill(
    children: string,
    container: any = {},
    etiqueta: any = {},
    input: any = {},
    toggled: boolean = true,
    tag?: string,
) {
    const name = tag ?? formatHTMLTag(children);

    return {
        name,
        selection: "GROUP-INPUT" as FormFieldCatalog,
        variant: "PILL",
        rest: {
            container,
            etiqueta: { ...etiqueta, children },
            input,
            toggled,
        },
    };
}
