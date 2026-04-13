import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// Definição da interface para as propriedades do botão
interface BotaoProps {
  titulo: string;
  corFundo: string;
  corTexto?: string;
  onPress: () => void;
}

// Componente de Botão separado em arquivo próprio
const Botao: React.FC<BotaoProps> = ({ titulo, corFundo = '#333333', corTexto = '#ffffff', onPress }) => (
  <TouchableOpacity
    style={[styles.botao, { backgroundColor: corFundo }]}
    onPress={onPress}
  >
    <Text style={[styles.textoBotao, { color: corTexto }]}>{titulo}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  botao: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 32,
    fontWeight: '400',
  },
});

export default Botao;
