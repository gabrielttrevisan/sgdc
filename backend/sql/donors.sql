CREATE TABLE IF NOT EXISTS donors (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL,
    CPF VARCHAR(20) NOT NULL,
    PHONE VARCHAR(20),
    GENDER VARCHAR(128),
    EMAIL VARCHAR(255),
    AGE INT,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
    DELETED_AT TIMESTAMP
);

ALTER TABLE donors ADD COLUMN IF NOT EXISTS EMAIL VARCHAR(255);
ALTER TABLE donors ADD COLUMN IF NOT EXISTS AGE INT;

INSERT INTO donors (NAME, CPF, PHONE, GENDER, EMAIL, AGE) VALUES
('João Silva', '123.456.789-00', '(11) 98765-4321', 'Masculino', 'joao.silva@example.com', 34),
('Maria Oliveira', '987.654.321-00', '(21) 91234-5678', 'Feminino', 'maria.oliveira@example.com', 29),
('Carlos Souza', '111.222.333-44', '(31) 99876-5432', 'Masculino', 'carlos.souza@example.com', 42),
('Ana Pereira', '555.666.777-88', '(41) 98765-4321', 'Feminino', 'ana.pereira@example.com', 27),
('Pedro Santos', '999.888.777-66', '(51) 91234-5678', 'Masculino', 'pedro.santos@example.com', 38),
('Luciana Costa', '444.333.222-11', '(61) 99876-5432', 'Feminino', 'luciana.costa@example.com', 31),
('Rafael Lima', '222.111.000-99', '(71) 98765-4321', 'Masculino', 'rafael.lima@example.com', 36),
('Fernanda Alves', '777.888.999-00', '(81) 91234-5678', 'Feminino', 'fernanda.alves@example.com', 25),
('Gustavo Rocha', '666.555.444-33', '(91) 99876-5432', 'Masculino', 'gustavo.rocha@example.com', 40);