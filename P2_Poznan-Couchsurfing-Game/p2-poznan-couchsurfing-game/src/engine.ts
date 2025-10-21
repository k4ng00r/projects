export type Params = {
    charisma: number;
    openess: number;
    adventure: number;
    comfort: number;
    budget: number;
    cold: boolean;
};

export type Choice = {
    to: string;
    labelKey: string;
    effects?: Partial<Params>;
    areYouSureKey?: string;
};

export type Node = {
    id: string;
    textKey?: string;
    placeId?: string;
    choices?: Choice[];
};

export class Engine {
    private nodes!: Node[];
    private params!: Params;
    private currentNode!: Node;

    constructor(nodes: Node[], params: Params) {
        this.nodes = nodes;
        this.params = params;
        this.currentNode = nodes[0];
    }

    getNode(id: string) {
        return this.nodes.find((n) => n.id === id)!;
    }

    getParams() {
        return this.params;
    }

    apply(choice: Choice) {
        if (choice.effects) {
            for (const [key, val] of Object.entries(choice.effects)) {
                const k = key as keyof Params;
                // @ts-ignore
                this.params[k] = (this.params[k] || 0) + (val as number);
            }
        }
    }

    moveTo(id: string) {
        this.currentNode = this.getNode(id);
        return this.currentNode;
    }

    getCurrentNode() {
        return this.currentNode;
    }
}
