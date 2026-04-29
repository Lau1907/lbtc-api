-- Crear tabla Role
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- Insertar roles base
INSERT INTO "Role" (id, name) VALUES (1, 'user');
INSERT INTO "Role" (id, name) VALUES (2, 'admin');

-- Crear unique index
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- Agregar role_id a User con valor por defecto 1
ALTER TABLE "User" ADD COLUMN "role_id" INTEGER NOT NULL DEFAULT 1;

-- Agregar foreign key
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" 
FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;