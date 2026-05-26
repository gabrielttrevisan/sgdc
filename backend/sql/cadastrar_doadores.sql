CREATE TABLE IF NOT EXISTS donors (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    CPF VARCHAR(20) NOT NULL,
    PHONE VARCHAR(20),
    GENDER VARCHAR(128),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    DELETED_AT TIMESTAMP
);

INSERT INTO donors (NAME, CPF, PHONE, GENDER) VALUES
('João Silva', '123.456.789-00', '(11) 98765-4321', 'Masculino'),
('Maria Oliveira', '987.654.321-00', '(21) 91234-5678', 'Feminino'),
('Carlos Souza', '111.222.333-44', '(31) 99876-5432', 'Masculino'),
('Ana Pereira', '555.666.777-88', '(41) 98765-4321', 'Feminino'),
('Pedro Santos', '999.888.777-66', '(51) 91234-5678', 'Masculino'),
('Luciana Costa', '444.333.222-11', '(61) 99876-5432', 'Feminino'),
('Rafael Lima', '222.111.000-99', '(71) 98765-4321', 'Masculino'),
('Fernanda Alves', '777.888.999-00', '(81) 91234-5678', 'Feminino'),
('Gustavo Rocha', '666.555.444-33', '(91) 99876-5432', 'Masculino');