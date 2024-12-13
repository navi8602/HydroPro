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

CREATE TABLE "Plant" (
    id SERIAL PRIMARY KEY,
    "systemId" INTEGER REFERENCES "System"(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    status VARCHAR(50),
    "plantedAt" TIMESTAMP,
    "harvestedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Monitoring" (
    id SERIAL PRIMARY KEY,
    "systemId" INTEGER REFERENCES "System"(id),
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    "lightLevel" INTEGER,
    "phLevel" DECIMAL(4,2),
    "nutrientLevel" DECIMAL(5,2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MaintenanceTask" (
    id SERIAL PRIMARY KEY,
    "systemId" INTEGER REFERENCES "System"(id),
    "plantId" INTEGER REFERENCES "Plant"(id),
    type VARCHAR(50),
    description TEXT,
    "dueDate" TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    "completedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Alert" (
    id SERIAL PRIMARY KEY,
    "systemId" INTEGER REFERENCES "System"(id),
    "plantId" INTEGER REFERENCES "Plant"(id),
    type VARCHAR(50),
    message TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    "resolvedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);