export function validarUserName(userName: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    return regex.test(userName);
}

export function validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=\S+$).{8,}$/;
    return regex.test(password);
}

export function validarIdentificacion(identificacion: string): boolean {
    if (!/^\d{10}$/.test(identificacion)) return false;
    if (/(\d)\1\1\1/.test(identificacion)) return false;
    return true;
}
