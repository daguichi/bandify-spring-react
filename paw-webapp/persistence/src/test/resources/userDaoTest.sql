TRUNCATE TABLE users RESTART IDENTITY AND COMMIT NO CHECK;

--ARTIST
INSERT INTO users(id, email, password, name, surname, isband, isenabled, description)
VALUES (1, 'artist@mail.com', '12345678', 'name', 'surname', false, false, 'description');

--ARTIST EDIT
INSERT INTO users(id, email, password, name, surname, isband, isenabled, description)
VALUES (2, 'artist2@mail.com', '12345678', 'name', 'surname', false, false, 'description');