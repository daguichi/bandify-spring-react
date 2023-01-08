type UserCreateInput = {
    email: string;
    password: string;
    passwordConfirmation: string;
    name: string;
    surname: string;
    band: boolean;
}

type UserUpdateInput = {
    name: string;
    surname: string;
    description: string;
    location: string;
    genres: string[];
    roles: string[];
}

type User = {
    applications: string;
    available: boolean;
    band: boolean;
    email: string;
    enabled: boolean;
    genres: string;
    id: number;
    location: string;
    name: string;
    roles: string;
    self: string;
    socialMedia: string;
};

// TODO: campos para banda ?


export type { UserCreateInput, UserUpdateInput, User }