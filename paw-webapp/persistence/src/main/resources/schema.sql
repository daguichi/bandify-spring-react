CREATE TABLE IF NOT EXISTS auditions
(
    id SERIAL PRIMARY KEY,
    bandId INT NOT NULL,
    title VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(512) NOT NULL,
    creationDate DATE NOT NULL,
    location VARCHAR(100) NOT NULL
);
-- TODO : FOREIGN KEY(band_id) REFERENCES Band(band_id) ON DELETE CASCADE

CREATE TABLE IF NOT EXISTS auditionGenres
(
    id INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    PRIMARY KEY(id, genre),
    FOREIGN KEY(id) REFERENCES auditions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auditionRoles
(
    id INT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY(id, role),
    FOREIGN KEY(id) REFERENCES auditions(id) ON DELETE CASCADE
);