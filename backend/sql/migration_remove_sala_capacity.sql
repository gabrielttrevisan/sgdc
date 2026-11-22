DELIMITER //

DROP PROCEDURE IF EXISTS migrate_remove_sala_capacity//
CREATE PROCEDURE migrate_remove_sala_capacity()
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND LOWER(TABLE_NAME) = 'salas'
          AND LOWER(COLUMN_NAME) = 'capacidade'
    ) THEN
        ALTER TABLE SALAS DROP COLUMN CAPACIDADE;
    END IF;
END//

CALL migrate_remove_sala_capacity()//
DROP PROCEDURE migrate_remove_sala_capacity//

DELIMITER ;
