CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	email VARCHAR(100),
	userName VARCHAR(50),
	hash_password TEXT 
);

