const numberRegex = /((,|\.|\d)+)/;

export function currencyToNumber(
  value?: string | number,
  defaultValue: number = 0
): number {
  if (!value) return defaultValue;
  if (typeof value === "number") return value;
  const [, number] = value.match(numberRegex) ?? [];
  return number ? parseFloat(number.replace(",", ".")) : 0;
}

export function toCurrencyWithSymbol(value?: string | number): string {
  value = value ?? 0;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function toCurrency(value?: number | string): string {
  value = value || 0;
  return currencyToNumber(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function fromCurrency(value?: number | string): number {
  if (!value) return 0;
  if (typeof value === "number") return value;

  return resolveCurrencyOperation(value);
}

export function resolveCurrencyOperation(value: string): number {
  const hasOperator = value.match(/[+\-*\/]/);
  if (!hasOperator) return currencyToNumber(value);

  const [, pre, , operator, post] =
    value.match(/((,|\.|\d)+)\s*([+\-*\/])\s*((%|,|\.|\d)+)/) ?? [];

  if (!pre || !operator || !post) return currencyToNumber(value);

  const operations: Record<string, Function> = {
    "+": (a: number, b: number) => a + b,
    "-": (a: number, b: number) => a - b,
    "*": (a: number, b: number) => a * b,
    "/": (a: number, b: number) => a / b,
  };

  const postNumber = post.includes("%")
    ? currencyToNumber(pre) * (currencyToNumber(post.replace("%", "")) / 100)
    : currencyToNumber(post);

  const result = operations[operator](currencyToNumber(pre), postNumber);
  return result < 0 ? 0 : result;
}
