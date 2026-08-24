

export default function extraer (regex: RegExp,textoCompleto: string): string | null {
    const match = textoCompleto.match(regex);
    if (!match || !match[1]) return null;
    
    // Limpia saltos de línea, pestañas y múltiples espacios consecutivos
    return match[1].replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
};