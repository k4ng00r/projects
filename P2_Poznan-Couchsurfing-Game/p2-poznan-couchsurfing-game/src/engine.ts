export type Params = {
    charisma: number;
    openess?: number;
    openness?: number;
    adventure: number;
    comfort: number;
    budget: number;
    cold: boolean;
};

export type Choice = {
    id?: string;
    labelKey: string;
    nextNodeId?: string;
    effects?: Partial<Record<keyof Params, number | boolean>>;
};

export type Node = {
    id: string;
    textKey?: string;
    placeId?: string;
    choices?: Choice[];
};

function migrateParams(p: Params): Params {
    const out = { ...p };

    if (out.openness == null && typeof out.openess === "number") {
        out.openness = out.openess;
    }

    if (out.openess == null && typeof out.openness === "number") {
        out.openess = out.openness;
    }

    return out;
}

export class Engine {
    private nodes: Node[];
    private currentNodeId: string;
    private params: Params;

    constructor(nodes: Node[], initialParams: Params, startNodeId?: string) {
        this.nodes = nodes;
        this.currentNodeId = startNodeId ?? nodes[0]?.id;
        this.params = migrateParams(initialParams);
    }

    getCurrentNode() {
        return this.nodes.find((n) => n.id === this.currentNodeId)!;
    }

    getParams() {
        return this.params;
    }

    moveTo(nodeId: string) {
        this.currentNodeId = nodeId;
    }

    apply(choice: Choice) {
        const eff = choice.effects ?? {};
        for (const [rawKey, val] of Object.entries(eff) as [
            keyof Params,
            number | boolean
        ][]) {
            const keys: (keyof Params)[] =
                rawKey === "openess" || rawKey === "openness"
                    ? ["openness", "openess"]
                    : [rawKey];

            for (const k of keys) {
                if (k === "cold") {
                    if (typeof val === "boolean") this.params.cold = val;
                    continue;
                }

                if (typeof val === "number") {
                    const current = (this.params as any)[k];
                    const next =
                        (typeof current === "number" ? current : 0) + val;
                    (this.params as any)[k] = next;
                }
            }
        }
        this.params = migrateParams(this.params);
    }
}
