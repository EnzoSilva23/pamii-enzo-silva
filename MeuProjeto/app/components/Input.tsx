// =====================================================
// COMPONENTE: Input
// Campo de texto reutilizável para formulários.
//
// Props:
//   label      → texto acima do campo
//   erro       → mensagem de erro (deixa borda vermelha)
//   hint       → dica embaixo do campo
//   ...rest    → qualquer prop do TextInput do React Native
//                (value, onChangeText, placeholder, etc.)
// =====================================================

import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

// Extende as props do TextInput nativo e adiciona as nossas
interface InputProps extends TextInputProps {
  label?: string;
  erro?: string;
  hint?: string;
}

export function Input({ label, erro, hint, style, ...rest }: InputProps) {
  return (
    <View style={styles.wrapper}>
      {/* Mostra o label somente se foi passado */}
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.campo,
          erro ? styles.campoErro : null, // borda vermelha se houver erro
          style,
        ]}
        placeholderTextColor="#aaa"
        {...rest} // repassa todas as outras props (value, onChangeText, etc.)
      />

      {/* Prioridade: erro aparece antes do hint */}
      {erro && <Text style={styles.erroMsg}>{erro}</Text>}
      {!erro && hint && <Text style={styles.hintMsg}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 5,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  campo: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    borderRadius: 10,
    fontSize: 14,
    color: "#222",
    backgroundColor: "#fff",
  },
  campoErro: {
    borderColor: "#e53935",
  },
  erroMsg: {
    fontSize: 12,
    color: "#e53935",
  },
  hintMsg: {
    fontSize: 12,
    color: "#aaa",
  },
});