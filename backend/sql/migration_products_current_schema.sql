DELIMITER //

DROP PROCEDURE IF EXISTS migrate_products_current_schema//
CREATE PROCEDURE migrate_products_current_schema()
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'PRICE'
    ) THEN
        ALTER TABLE products MODIFY COLUMN PRICE DECIMAL(10,2) NULL;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'STOCK'
    ) THEN
        ALTER TABLE products MODIFY COLUMN STOCK INT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'MEASURING_UNIT_ID'
    ) THEN
        ALTER TABLE products ADD COLUMN MEASURING_UNIT_ID INT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'NEEDS_REFRIGERATION'
    ) THEN
        ALTER TABLE products
            ADD COLUMN NEEDS_REFRIGERATION TINYINT NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'IS_PERISHABLE'
    ) THEN
        ALTER TABLE products
            ADD COLUMN IS_PERISHABLE TINYINT NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'DELETED_AT'
    ) THEN
        ALTER TABLE products ADD COLUMN DELETED_AT DATETIME NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'UPDATED_AT'
    ) THEN
        ALTER TABLE products ADD COLUMN UPDATED_AT DATETIME NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'CREATED_AT'
    ) THEN
        ALTER TABLE products
            ADD COLUMN CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND COLUMN_NAME = 'DESCRIPTION'
    ) THEN
        ALTER TABLE products ADD COLUMN DESCRIPTION VARCHAR(140) NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.REFERENTIAL_CONSTRAINTS
        WHERE CONSTRAINT_SCHEMA = DATABASE()
          AND TABLE_NAME = 'products'
          AND CONSTRAINT_NAME = 'FK_products_MEASURING_UNITS'
    ) THEN
        ALTER TABLE products
            ADD CONSTRAINT FK_products_MEASURING_UNITS
            FOREIGN KEY (MEASURING_UNIT_ID) REFERENCES measuring_units(ID);
    END IF;
END//

CALL migrate_products_current_schema()//
DROP PROCEDURE migrate_products_current_schema//

DELIMITER ;
