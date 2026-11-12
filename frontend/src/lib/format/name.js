export default function formatName(name) {
  if (!name || typeof name !== "string" || name.trim() === "")
    return "Usuário Desconhecido";

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.pop();
  const middleNames = rest.length
    ? " " +
      rest
        .map((n) => {
          if (n.length <= 3) return n;

          return `${n[0]}.`;
        })
        .join(" ")
    : "";

  return `${firstName}${middleNames} ${lastName}`.trim();
}