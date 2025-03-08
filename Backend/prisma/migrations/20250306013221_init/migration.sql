-- CreateTable
CREATE TABLE "usuarios" (
    "idUsuario" SERIAL NOT NULL,
    "UserName" VARCHAR(50) NOT NULL,
    "Password" VARCHAR(50) NOT NULL,
    "Mail" VARCHAR(120) NOT NULL,
    "SessionActive" CHAR(1) NOT NULL,
    "Status" CHAR(20) NOT NULL DEFAULT 'active',
    "Persona_idPersona2" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "roles" (
    "idRol" SERIAL NOT NULL,
    "RolName" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "rolOpciones" (
    "idOpcion" SERIAL NOT NULL,
    "NombreOpciones" VARCHAR(50) NOT NULL,

    CONSTRAINT "rolOpciones_pkey" PRIMARY KEY ("idOpcion")
);

-- CreateTable
CREATE TABLE "personas" (
    "idPersona" SERIAL NOT NULL,
    "Nombres" VARCHAR(60) NOT NULL,
    "Apellidos" VARCHAR(60) NOT NULL,
    "Identificacion" VARCHAR(10) NOT NULL,
    "FechaNacimiento" DATE NOT NULL,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("idPersona")
);

-- CreateTable
CREATE TABLE "sessions" (
    "idSession" SERIAL NOT NULL,
    "FechaIngreso" DATE NOT NULL,
    "FechaCierre" DATE NOT NULL,
    "usuarios_idUsuario" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("idSession")
);

-- CreateTable
CREATE TABLE "usuario_rol" (
    "usuario_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateTable
CREATE TABLE "rol_opciones_rol" (
    "rol_id" INTEGER NOT NULL,
    "opcion_id" INTEGER NOT NULL,

    CONSTRAINT "rol_opciones_rol_pkey" PRIMARY KEY ("rol_id","opcion_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_Mail_key" ON "usuarios"("Mail");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_Persona_idPersona2_fkey" FOREIGN KEY ("Persona_idPersona2") REFERENCES "personas"("idPersona") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_usuarios_idUsuario_fkey" FOREIGN KEY ("usuarios_idUsuario") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_opciones_rol" ADD CONSTRAINT "rol_opciones_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_opciones_rol" ADD CONSTRAINT "rol_opciones_rol_opcion_id_fkey" FOREIGN KEY ("opcion_id") REFERENCES "rolOpciones"("idOpcion") ON DELETE RESTRICT ON UPDATE CASCADE;
