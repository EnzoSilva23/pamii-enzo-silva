// =====================================================
// COMPONENTE: Modal
// Janela sobreposta com título, conteúdo e ações.
//
// Props:
//   visivel   → boolean que controla se aparece ou some
//   onFechar  → função para fechar (botão X ou fundo)
//   titulo    → texto do cabeçalho
//   children  → conteúdo interno (qualquer JSX)
//   acoes     → botões no rodapé
// =====================================================

import React from "react";
import {
  Modal as RNModal,   // renomeia o Modal nativo para não conflitar
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

interface ModalProps {
  visivel: boolean;
  onFechar: () => void;
  titulo: string;
  children: React.ReactNode;
  acoes?: React.ReactNode;
}

export function Modal({ visivel, onFechar, titulo, children, acoes }: ModalProps) {
  return (
    // Modal nativo do React Native — cuida da animação e do overlay
    <RNModal
      visible={visivel}
      transparent       // fundo transparente (fazemos o escuro manualmente)
      animationType="fade"
      onRequestClose={onFechar} // botão "voltar" do Android fecha o modal
    >
      {/* Fundo escuro — pressionar fora fecha o modal */}
      <TouchableOpacity
        style={styles.fundo}
        activeOpacity={1}
        onPress={onFechar}
      >
        {/*
          KeyboardAvoidingView: sobe o modal quando o teclado abre
          (importante para formulários no mobile)
        */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* stopPropagation: toca dentro sem fechar o modal */}
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.caixa}>

              {/* Cabeçalho: título + botão X */}
              <View style={styles.cabecalho}>
                <Text style={styles.titulo}>{titulo}</Text>
                <TouchableOpacity onPress={onFechar} style={styles.btnFechar}>
                  <Text style={styles.btnFecharTexto}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Corpo: rolável se o conteúdo for grande */}
              <ScrollView style={styles.corpo} showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>

              {/* Rodapé com botões de ação */}
              {acoes && <View style={styles.rodape}>{acoes}</View>}

            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  caixa: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 440,
    maxHeight: "85%",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    flex: 1,
  },
  btnFechar: {
    padding: 4,
    marginLeft: 8,
  },
  btnFecharTexto: {
    fontSize: 24,
    color: "#aaa",
    lineHeight: 26,
  },
  corpo: {
    marginBottom: 4,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
});