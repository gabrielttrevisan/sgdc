/**
 * @param {string} value
 * @returns {string}
 */
export function unmaskDigits(value) {
  return value.trim().replace(/[\D]/g, "");
}

/**
 * Mascara o CPF exibindo apenas os dois últimos dígitos
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {string} CPF mascarado (ex: ***.***.**-10)
 */
export function maskCPFWithLastDigits(cpf) {
  if (!cpf) return "";
  
  // Remove tudo que não é dígito
  const digits = cpf.replace(/\D/g, "").slice(0, 11);
  
  if (digits.length < 11) return cpf;
  
  // Pega os 2 últimos dígitos
  const lastDigits = digits.slice(-2);
  
  // Retorna no formato ***.***.**-DD
  return `***.***.**-${lastDigits}`;
}
