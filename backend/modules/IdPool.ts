export class IdPool {
    public maxId: number;
    public currentId: number;
    public ids: Set<number>;

    constructor(startId: number, length: number) {
        this.maxId = startId + length;
        this.currentId = startId;
        this.ids = new Set<number>();
    }

    public createId(): number {
        if (this.currentId >= this.maxId) {
            return 0;
        }
        let id = this.currentId;
        while (this.ids.has(id)) {
            id++;
            if (id >= this.maxId) {
                id = 0;
            }
            if (id === this.currentId) {
                return 0;
            }
        }
        this.ids.add(id);
        return id;
    }

    public deleteId(id: number): void {
        this.ids.delete(id);
    }
}