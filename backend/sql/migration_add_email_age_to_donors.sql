-- Migration: adiciona campos de email e idade à tabela donors

ALTER TABLE donors
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS age INT;

-- Caso necessário, atualize registros existentes com valores padrão.
-- UPDATE donors SET email = 'sem-email@exemplo.com' WHERE email IS NULL;
-- UPDATE donors SET age = 0 WHERE age IS NULL;
