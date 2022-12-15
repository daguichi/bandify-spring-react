type Audition = {
    applications: string;
    creationDate: string;
    description: string;
    id: number;
    location: string;
    lookingFor: string;
    musicGenres: string;
    title: string;
    self: string;
}

type AuditionInput = {
    title: string;
    description: string;
    location: string;
    musicGenres: string[];
    lookingFor: string[];
}

export type { Audition, AuditionInput }