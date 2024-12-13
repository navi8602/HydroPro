
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'USER',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "System" (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  description TEXT,
  capacity INTEGER,
  dimensions JSONB,
  features TEXT[],
  "monthlyPrice" INTEGER,
  "imageUrl" TEXT,
  specifications JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RentedSystem" (
  id SERIAL PRIMARY KEY,
  "systemId" VARCHAR(255) REFERENCES "System"(id),
  "userId" INTEGER REFERENCES "User"(id),
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insert test rented systems for users
INSERT INTO "RentedSystem" ("systemId", "userId", "startDate", "endDate", "status")
SELECT 
  s.id as "systemId",
  u.id as "userId",
  CURRENT_TIMESTAMP as "startDate",
  CURRENT_TIMESTAMP + INTERVAL '6 months' as "endDate",
  'ACTIVE' as status
FROM "User" u
CROSS JOIN (
  SELECT id FROM "System" ORDER BY RANDOM() LIMIT 1
) s
WHERE NOT EXISTS (
  SELECT 1 
  FROM "RentedSystem" 
  WHERE "RentedSystem"."userId" = u.id
);
