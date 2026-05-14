-- Tabela dla formularza join_us
CREATE TABLE IF NOT EXISTS form_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    age INT NULL,
    topic VARCHAR(100) NOT NULL,
    referral_source VARCHAR(50) NULL,
    referral_code VARCHAR(100) NULL,
    referral_other TEXT NULL,
    accept_rodo BOOLEAN NOT NULL DEFAULT FALSE,
    accept_privacy BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Opcjonalnie: tabela dla logów błędów
CREATE TABLE IF NOT EXISTS form_errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_data JSON,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
