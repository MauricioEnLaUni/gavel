import type { FormFieldCatalog } from "$cmp/superforms/types";
import { cn } from "$utl/cn";
import { formatHTMLTag } from "./formatHTML";

export function genTag(
    nombre: string,
    name: string = "",
    container: any = {},
    etiqueta: any = {},
    input: any = {},
) {
    const n = name !== "" ? name : formatHTMLTag(nombre);

    return {
        name: n,
        selection: "TEXT-INPUT" as FormFieldCatalog,
        variant: "ETIQUETA",
        rest: {
            container: { ...container },
            etiqueta: {
                ...etiqueta,
                classes: cn("text-xs", etiqueta.classes),
                children: nombre,
            },
            input: { ...input, classes: cn("input-xs text-xs", input.classes) },
        },
    };
}
