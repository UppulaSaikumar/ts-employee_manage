CREATE TABLE IF NOT EXISTS admemps (
    empid      INT PRIMARY KEY,
    fullname   VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL CHECK (email <> ''),
    password   VARCHAR(255) NOT NULL CHECK (password <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_emp FOREIGN KEY (empid) REFERENCES employees(empid) ON DELETE CASCADE
);

INSERT INTO admemps (empid, fullname, email, password)
SELECT * FROM (
    SELECT 1, 'Devi', 'devi@gmail.com', 'devi@123'
    UNION ALL
    SELECT 2, 'Siva', 'siva@gmail.com', 'siva@123'
) AS new_admemps
WHERE NOT EXISTS (
    SELECT 1 FROM admemps
);

