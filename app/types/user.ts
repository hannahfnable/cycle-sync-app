
class User  {
    id: string;
    favorites: string[] | undefined;
    moods: string[] | undefined;

    constructor(id: string, cycleId?: string) {
        this.id = id;
        this.favorites = [];
        this.moods = [];
    }
}

export {User};