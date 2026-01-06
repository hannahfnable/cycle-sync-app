
class User  {
    id: string;
    cycleId : string | undefined;
    favorites: string[] | undefined;
    moods: string[] | undefined;

    constructor(id: string, cycleId?: string) {
        this.id = id;
        this.cycleId = cycleId;
        this.favorites = [];
        this.moods = [];
    }
}

export {User};