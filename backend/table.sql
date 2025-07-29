CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  userName VARCHAR(255) NOT NULL,
  hash_password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE qr_data(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_count INTEGER,
    package_type VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    redirect_url VARCHAR(2048) NOT NULL, 
    created_url VARCHAR(2048) NOT NULL,
    created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE all_url(
          id SERIAL PRIMARY KEY,
          email VARCHAR(100) NOT NULL,
          ascan_count INTEGER
);