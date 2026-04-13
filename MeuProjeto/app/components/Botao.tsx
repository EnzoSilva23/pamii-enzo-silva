// =====================================================
// COMPONENTE: Botão
// Botão reutilizável com variantes semânticas.
//
// Props:
//   variante    → define a cor e o visual do botão
//   texto       → texto exibido no botão
//   onPress     → função chamada ao pressionar
//   desabilitado→ bloqueia a interação
//   tamanho     → "normal" ou "pequeno" (para tabelas)
// =====================================================

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

// Todas as variantes semânticas disponíveis
type Variante = "confirmar" | "cancelar" | "adicionar" | "editar" | "excluir";

interface BotaoProps {
  variante?: Variante;
  texto: string;
  onPress: () => void;
  desabilitado?: boolean;
  tamanho?: "normal" | "pequeno";
}

// Cores de fundo e texto para cada variante
const estilosPorVariante: Record<Variante, { bg: string; cor: string; borda?: string }> = {
  confirmar: { bg: "#43a047", cor: "#fff" },
  cancelar:  { bg: "#e53935", cor: "#fff" },
  adicionar: { bg: "#1e88e5", cor: "#fff" },
  editar:    { bg: "#f5f5f5", cor: "#444", borda: "#d0d0d0" },
  excluir:   { bg: "transparent", cor: "#e53935", borda: "#e53935" },
};

// Componente base — todas as variantes usam este
function Botao({
  variante = "editar",
  texto,
  onPress,
  desabilitado = false,
  tamanho = "normal",
}: BotaoProps) {
  const visual = estilosPorVariante[variante];

  const estiloContainer: ViewStyle = {
    backgroundColor: visual.bg,
    borderWidth: visual.borda ? 1.5 : 0,
    borderColor: visual.borda ?? "transparent",
    paddingHorizontal: tamanho === "pequeno" ? 12 : 18,
    paddingVertical: tamanho === "pequeno" ? 6 : 10,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    opacity: desabilitado ? 0.4 : 1,
  };

  const estiloTexto: TextStyle = {
    color: visual.cor,
    fontSize: tamanho === "pequeno" ? 12 : 13,
    fontWeight: "600",
  };

  return (
    <TouchableOpacity
      style={estiloContainer}
      onPress={onPress}
      disabled={desabilitado}
      activeOpacity={0.75}
    >
      <Text style={estiloTexto}>{texto}</Text>
    </TouchableOpacity>
  );
}

// =====================================================
// VARIANTES SEMÂNTICAS EXPORTADAS
// O nome do componente diz exatamente o que ele faz.
// Ex: <BotaoConfirmar> é mais claro que <Botao variante="confirmar">
// =====================================================
export const BotaoConfirmar  = (p: Omit<BotaoProps, "variante">) => <Botao variante="confirmar"  {...p} />;
export const BotaoCancelar   = (p: Omit<BotaoProps, "variante">) => <Botao variante="cancelar"   {...p} />;
export const BotaoAdicionar  = (p: Omit<BotaoProps, "variante">) => <Botao variante="adicionar"  {...p} />;
export const BotaoEditar     = (p: Omit<BotaoProps, "variante">) => <Botao variante="editar"     {...p} />;
export const BotaoExcluir    = (p: Omit<BotaoProps, "variante">) => <Botao variante="excluir"    {...p} />;