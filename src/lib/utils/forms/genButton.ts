import type { FormFieldCatalog } from "$cmp/superforms/types";

export function genButton(name: string, button: any = {}) {
    return {
        name,
        selection: "ACTIONS" as FormFieldCatalog,
        variant: "SEARCH",
        rest: {
            button: { ...button },
        },
    };
}
