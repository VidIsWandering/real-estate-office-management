-- Migration: Update seed passwords from password123 to Password123
-- New password meets validation requirements: 6+ chars, uppercase, lowercase, number

UPDATE account 
SET password = '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC'
WHERE username IN ('admin', 'manager1', 'agent1', 'legal1', 'accountant1');

-- Verification: Check updated passwords
SELECT username, 
       CASE 
           WHEN password = '$2a$10$71VDs1FutQqWIekh8mNhVeCvEdBsMZAfHwe35OY9EIXLI3NVAQbQC' 
           THEN 'Password123' 
           ELSE 'OLD PASSWORD' 
       END as password_status
FROM account 
WHERE username IN ('admin', 'manager1', 'agent1', 'legal1', 'accountant1');
