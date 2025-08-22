CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  userName VARCHAR(255) NOT NULL,
  hash_password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE qr_data(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    scan_count INTEGER,
    package_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id),
    redirect_url VARCHAR(2048) NOT NULL, 
    created_date TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE single_qr(
  id SERIAL PRIMARY KEY,
  qr_id INTEGER REFERENCES qr_data(id),
  single_Ptype VARCHAR (50) NOT NULL,
  scan_count INTEGER NOT NULL,
  sub_data TIMESTAMPTZ DEFAULT NOW(),
  exp_data TIMESTAMPTZ NOT NULL
);


CREATE TABLE all_qr(
  id SERIAL PRIMARY KEY,
  userid UUID REFERENCES users(id),
  all_Ptype VARCHAR (50) NOT NULL,
  scan_count INTEGER NOT NULL,
  sub_data TIMESTAMPTZ DEFAULT NOW(),
  exp_data TIMESTAMPTZ NOT NULL
);


CREATE TABLE pay_log(
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  sub_Package VARCHAR (50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);