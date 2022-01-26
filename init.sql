CREATE TABLE `User` (
    `Firstname` VARCHAR(40) NOT NULL,
    `Lastname` VARCHAR(40) NOT NULL,
    `Email` VARCHAR(45) NOT NULL,
    `Password` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`Email`)
);


CREATE TABLE `File` (
    `Filename` VARCHAR(100) NOT NULL,
    `Publickey` VARCHAR(500) NOT NULL,
    `Email` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`Email`, `Filename`),
    FOREIGN KEY (`Email`) REFERENCES User(`Email`)
);