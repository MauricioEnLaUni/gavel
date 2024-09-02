import type { FormFieldCatalog } from "$cmp/superforms/types";
import { formatHTMLTag } from "./formatHTML";
import type { SelectOptions } from "$cmp/superforms/select/types";
import { cn } from "$utl/cn";

export function genSelect(
    children: string,
    opciones: SelectOptions[],
    tag: string = "",
    container: any = {},
    etiqueta: any = {},
    select: any = {},
    firstOption?: SelectOptions[],
) {
    const name = tag === "" ? formatHTMLTag(children) : formatHTMLTag(tag);

    return {
        name,
        selection: "SELECT" as FormFieldCatalog,
        variant: "SIMPLE",
        rest: {
            container: {
                ...container,
                classes: cn("text-xs", container.classes),
            },
            etiqueta: { ...etiqueta, children },
            select: {
                ...select,
                classes: cn(
                    "pl-3 select-xs select-bordered select-primary",
                    select.classes,
                ),
            },
            opciones,
            firstOption,
        },
    };
}
