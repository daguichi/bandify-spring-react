import { createContext, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import GenreServiceTest from "../services/GenreServiceTest";
import GenreApiTest from "../api/GenreApiTest";

const GenreServiceContext = createContext<GenreServiceTest>(null!);

export const useGenreService = () => useContext(GenreServiceContext);

export const GenreServiceProvider = ( { children }: { children: React.ReactNode }) => {
    const axiosPrivate = useAxiosPrivate();

    const genreApi = new GenreApiTest(axiosPrivate);
    const genreService = new GenreServiceTest(genreApi);

    return (
        <GenreServiceContext.Provider value={genreService} >
            {children}
        </GenreServiceContext.Provider>
    )
}