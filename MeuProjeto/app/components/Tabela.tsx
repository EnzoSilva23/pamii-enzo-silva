// =====================================================
// COMPONENTE: Tabela
// Exibe uma lista de contatos com avatar, badge e ações.
//
// Props:
//   dados     → array de Contato para exibir
//   busca     → texto de filtro (filtra dentro do componente)
//   onEditar  → função chamada ao pressionar "Editar"
//   onExcluir → função chamada ao pressionar "Excluir"
// =====================================================

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Contato, Grupo } from "../types/contato";
import { BotaoEditar, BotaoExcluir } from "./Botao";

interface TabelaProps {
  dados: Contato[];
  busca: string;
  onEditar: (contato: Contato) => void;
  onExcluir: (contato: Contato) => void;
}

// Cores do avatar e do badge por grupo
const coresGrupo: Record<Grupo, { bg: string; cor: string }> = {
  amigo:    { bg: "#c8e6c9", cor: "#1b5e20" },
  trabalho: { bg: "#bbdefb", cor: "#0d47a1" },
  familia:  { bg: "#fce4ec", cor: "#880e4f" },
};

const labelGrupo: Record<Grupo, string> = {
  amigo:    "Amigo",
  trabalho: "Trabalho",
  familia:  "Família",
};

export function Tabela({ dados, busca, onEditar, onExcluir }: TabelaProps) {
  // Filtra os dados pelo texto da busca (nome, email ou grupo)
  const filtrados = dados.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())   ||
    c.email.toLowerCase().includes(busca.toLowerCase())  ||
    c.grupo.toLowerCase().includes(busca.toLowerCase())
  );

  if (filtrados.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.vazioTexto}>Nenhum contato encontrado.</Text>
      </View>
    );
  }

  return (
    // ScrollView permite rolar a lista se tiver muitos contatos
    <ScrollView>
      {filtrados.map((contato) => {
        // Pega as duas primeiras iniciais do nome para o avatar
        const iniciais = contato.nome
          .split(" ")
          .slice(0, 2)
          .map((p) => p[0])
          .join("")
          .toUpperCase();

        const cor = coresGrupo[contato.grupo];

        return (
          <View key={contato.id} style={styles.linha}>
            {/* Lado esquerdo: avatar + nome + email */}
            <View style={styles.info}>
              <View style={[styles.avatar, { backgroundColor: cor.bg }]}>
                <Text style={[styles.avatarTexto, { color: cor.cor }]}>
                  {iniciais}
                </Text>
              </View>
              <View style={styles.textos}>
                <Text style={styles.nome}>{contato.nome}</Text>
                <Text style={styles.email}>{contato.email}</Text>
              </View>
            </View>

            {/* Lado direito: badge do grupo + botões de ação */}
            <View style={styles.direita}>
              <View style={[styles.badge, { backgroundColor: cor.bg }]}>
                <Text style={[styles.badgeTexto, { color: cor.cor }]}>
                  {labelGrupo[contato.grupo]}
                </Text>
              </View>
              <View style={styles.acoes}>
                <BotaoEditar
                  texto="Editar"
                  tamanho="pequeno"
                  onPress={() => onEditar(contato)}
                />
                <BotaoExcluir
                  texto="Excluir"
                  tamanho="pequeno"
                  onPress={() => onExcluir(contato)}
                />
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    gap: 8,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: {
    fontSize: 12,
    fontWeight: "700",
  },
  textos: {
    flex: 1,
  },
  nome: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  email: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  direita: {
    alignItems: "flex-end",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: "600",
  },
  acoes: {
    flexDirection: "row",
    gap: 6,
  },
  vazio: {
    paddingVertical: 40,
    alignItems: "center",
  },
  vazioTexto: {
    fontSize: 14,
    color: "#bbb",
  },
});