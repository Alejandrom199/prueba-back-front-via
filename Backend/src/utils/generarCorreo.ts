
import { prisma } from '../data/postgres/index';

export async function generarCorreo(nombres: string, apellidos: string): Promise<string> {
    const primerLetra = nombres.trim().charAt(0).toLowerCase();
    const apellidoConcat = apellidos.replace(/\s+/g, '').toLowerCase();
    let baseCorreo = `${primerLetra}${apellidoConcat}@mail.com`;

  // Verificar si ya existe el correo y, de ser así, agregar un número
    let correoFinal = baseCorreo;
    let contador = 1;
    while (await prisma.usuario.findUnique({ where: { Mail: correoFinal } })) {
        correoFinal = `${primerLetra}${apellidoConcat}${contador}@mail.com`;
        contador++;
    }
    return correoFinal;
}
