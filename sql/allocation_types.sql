CREATE TABLE allocation_types (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(32) NOT NULL,
    DESCRIPTION VARCHAR(65) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    DELETED_AT TIMESTAMP
);

INSERT INTO
    allocation_types (NAME, DESCRIPTION)
VALUES 
	("Transporte de Doação", "Transporte de doações para beneficiário"),
	("Limpeza de Ambiente da Igreja", "Manutenção e limpeza dos ambientes da Igreja"),
	("Organização de Donativos", "Reorganização de donativos e manutenção dos ambientes");
