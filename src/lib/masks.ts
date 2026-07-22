// lib/masks.ts — Máscaras de input e validadores de documentos brasileiros

// ── Máscaras de formatação ──────────────────────────────────────────

/** Remove tudo que não é dígito */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Aplica máscara de CPF: 000.000.000-00 */
export function maskCPF(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/** Aplica máscara de CNPJ: 00.000.000/0000-00 */
export function maskCNPJ(value: string): string {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

/** Aplica máscara de telefone: (00) 00000-0000 ou (00) 0000-0000 */
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

/** Aplica máscara de documento baseado no tipo */
export function maskDocument(value: string, type: "cpf" | "cnpj"): string {
  return type === "cnpj" ? maskCNPJ(value) : maskCPF(value);
}

/** Aplica máscara de número de cartão: 0000 0000 0000 0000 */
export function maskCardNumber(value: string): string {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Aplica máscara de validade do cartão: MM/AA */
export function maskCardExpiry(value: string): string {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

/** Aplica máscara de CVC: 000 ou 0000 */
export function maskCVC(value: string): string {
  return onlyDigits(value).slice(0, 4);
}

// ── Validadores de documentos ───────────────────────────────────────

/** Valida CPF com dígitos verificadores (algoritmo oficial Receita Federal) */
export function isValidCPF(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11) return false;

  // Rejeita sequências repetidas (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/** Valida CNPJ com dígitos verificadores (algoritmo oficial Receita Federal) */
export function isValidCNPJ(raw: string): boolean {
  const cnpj = onlyDigits(raw);
  if (cnpj.length !== 14) return false;

  // Rejeita sequências repetidas
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  // Primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;

  // Segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;

  return true;
}

/** Valida documento baseado no tipo */
export function isValidDocument(raw: string, type: "cpf" | "cnpj"): boolean {
  return type === "cnpj" ? isValidCNPJ(raw) : isValidCPF(raw);
}
