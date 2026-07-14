// Sistema de cores e tipografia da identidade visual do Simulador do Leopoldo'H.
// Para alterar as cores do sistema todo, mude apenas os valores aqui.
export const BRAND = {
  navy: "#0B2E59",
  navyDark: "#071F3D",
  red: "#D62828",
  gold: "#C9A227",
  goldLight: "#E4C766",
  paper: "#F4F5F7",
  ink: "#101820",
};

export const CATEGORIES = [
  "História de Angola",
  "Organização Política e Administrativa",
  "Administração Pública",
  "Ministério do Interior",
  "Patriotismo",
  "Aptidão Física",
  "Atualidades",
  "Português",
  "Informática",
  "Raciocínio Lógico",
  "Direitos Humanos",
];

export function fmtTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
