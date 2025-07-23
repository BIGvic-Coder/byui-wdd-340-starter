-- 1. Create custom ENUM type for account_type
CREATE TYPE account_type_enum AS ENUM ('Client', 'Admin');

-- 2. Create classification table
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

-- 3. Create inventory table
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50) NOT NULL,
  inv_model VARCHAR(50) NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image TEXT,
  inv_thumbnail TEXT,
  classification_id INT REFERENCES classification(classification_id)
);

-- 4. Create account tablea
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname VARCHAR(50) NOT NULL,
  account_email VARCHAR(100) UNIQUE NOT NULL,
  account_password TEXT NOT NULL,
  account_type account_type_enum DEFAULT 'Client'
);

-- 5. Populate classification table
INSERT INTO classification (classification_name)
VALUES ('Sport'), ('SUV'), ('Truck');

-- 6. Populate inventory table
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id)
VALUES 
  ('GM', 'Hummer', 'The GM Hummer has small interiors', '/images/gm-hummer.jpg', '/images/gm-hummer-thumb.jpg', 1),
  ('Toyota', 'Supra', 'A legendary sports car', '/images/toyota-supra.jpg', '/images/toyota-supra-thumb.jpg', 1),
  ('Ford', 'F-150', 'A reliable truck', '/images/ford-f150.jpg', '/images/ford-f150-thumb.jpg', 3);

-- 7. Populate account table (Optional)
-- You can skip this if the account insert is in assignment2.sql only

-- 8. COPY Queries 4 & 6 from assignment2.sql and put them at the bottom:

-- 4th Query: Update GM Hummer description using REPLACE
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 6th Query: Update image and thumbnail paths to include "/vehicles"
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
