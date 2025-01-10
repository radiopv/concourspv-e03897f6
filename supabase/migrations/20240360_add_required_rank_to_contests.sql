ALTER TABLE contests
ADD COLUMN required_rank text CHECK (required_rank IN ('PIONERO', 'GUAJIRO', 'HABANERO', 'CUBANO', 'MAXIMO')) DEFAULT 'PIONERO';