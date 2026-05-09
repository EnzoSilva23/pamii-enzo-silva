import React from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; // Certifique-se de que instalou @hookform/resolvers
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { Fornecedor, Entregador, schema } from '../types/entrega';

// Unimos os tipos para o formulário
type FormData = Fornecedor & Entregador;

export default function FormularioEntrega() {
  // Ajuste: Adicionado o tipo FormData no useForm e garantido o schema
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any 
  });

  // O dado que vem do formulário
  const handleCadastro = async (data: FormData) => {
    try {
      // 1. Criar Fornecedor
      const fornecedorRef = await addDoc(collection(db, "fornecedores"), {
        nome_empresa: data.nome_empresa,
        nome_produto: data.nome_produto,
        num_pedido: Number(data.num_pedido), // Garante que vai como número
        quantidade_produto: Number(data.quantidade_produto), // Garante que vai como número
        assinatura: ""
      });

      // 2. Criar Entregador (Subcoleção)
      await addDoc(collection(db, "fornecedores", fornecedorRef.id, "entregadores"), {
        nome_completo: data.nome_completo,
        empresa_representante: data.nome_empresa,
        documento: data.documento || "Não informado", // Evita erro de undefined
        placa_veiculo: data.placa_veiculo
      });

      Alert.alert("Sucesso!", "Dados salvos no Firebase.");
      reset();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao cadastrar no banco.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📦 Atividade: Cadastro</Text>
      
      <View style={styles.card}>
        <Text style={styles.title}>Fornecedor</Text>
        <CustomInput name="nome_empresa" label="Empresa" control={control} error={errors.nome_empresa?.message} />
        <CustomInput name="nome_produto" label="Produto" control={control} error={errors.nome_produto?.message} />
        <CustomInput name="num_pedido" label="Nº Pedido" control={control} error={errors.num_pedido?.message} keyboard="numeric" />
        <CustomInput name="quantidade_produto" label="Qtd" control={control} error={errors.quantidade_produto?.message} keyboard="numeric" />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Entregador</Text>
        <CustomInput name="nome_completo" label="Nome do Entregador" control={control} error={errors.nome_completo?.message} />
        <CustomInput name="placa_veiculo" label="Placa" control={control} error={errors.placa_veiculo?.message} />
        <CustomInput name="documento" label="Documento" control={control} error={errors.documento?.message} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(handleCadastro)}>
        <Text style={styles.buttonText}>CADASTRAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Componente de Input com tipagem corrigida
const CustomInput = ({ name, label, control, error, keyboard = "default" }: any) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontWeight: 'bold', color: '#555' }}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextInput 
          style={[styles.input, error ? { borderColor: 'red' } : {}]} 
          onChangeText={onChange} 
          value={value !== undefined ? String(value) : ""} 
          keyboardType={keyboard}
        />
      )}
    />
    {error && <Text style={{ color: 'red', fontSize: 10 }}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 4 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginBottom: 10, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 5 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 5, fontSize: 16 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});