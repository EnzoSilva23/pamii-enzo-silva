// =====================================================
// TELA PRINCIPAL: AgendaScreen
// Aqui o useState gerencia o estado e conecta todos
// os componentes: Input, Botao, Tabela e Modal.
// =====================================================

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { Input }                                              from "../components/Input";
import { BotaoAdicionar, BotaoConfirmar, BotaoCancelar,
         BotaoEditar, BotaoExcluir }                          from "../components/Botao";
import { Tabela }                                             from "../components/Tabela";
import { Modal }                                              from "../components/Modal";
import { Toast }                                              from "../components/Toast";
import { Contato, FormContato, Grupo }                        from "../types/contato";

// Dados de exemplo para iniciar o app com conteúdo
const dadosIniciais: Contato[] = [
  { id: 1, nome: "Ana Souza",      email: "ana@email.com",      tel: "(11) 9 9100-0001", grupo: "amigo"    },
  { id: 2, nome: "Carlos Lima",    email: "carlos@empresa.com", tel: "(21) 9 9200-0002", grupo: "trabalho" },
  { id: 3, nome: "Mariana Costa",  email: "mari@email.com",     tel: "(31) 9 9300-0003", grupo: "familia"  },
  { id: 4, nome: "Felipe Ramos",   email: "felipe@empresa.com", tel: "",                 grupo: "trabalho" },
];

// Formulário vazio — usado ao abrir o modal de novo contato
const formVazio: FormContato = { nome: "", email: "", tel: "", grupo: "amigo" };

export function AgendaScreen() {
  // --- Estado principal ---
  const [contatos, setContatos]               = useState<Contato[]>(dadosIniciais);
  const [busca, setBusca]                     = useState("");

  // --- Controle dos modais ---
  const [modalFormVisivel,    setModalFormVisivel]    = useState(false);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);

  // Contato sendo editado/excluído — null = está criando novo
  const [contatoAtivo, setContatoAtivo] = useState<Contato | null>(null);

  // --- Campos do formulário ---
  const [form,  setForm]  = useState<FormContato>(formVazio);
  const [erros, setErros] = useState<Partial<FormContato>>({});

  // --- Toast ---
  const [toast, setToast] = useState({ mensagem: "", visivel: false });

  // Abre modal para CRIAR (zera o formulário)
  function abrirCriar() {
    setContatoAtivo(null);
    setForm(formVazio);
    setErros({});
    setModalFormVisivel(true);
  }

  // Abre modal para EDITAR (preenche com dados do contato)
  function abrirEditar(contato: Contato) {
    setContatoAtivo(contato);
    setForm({ nome: contato.nome, email: contato.email, tel: contato.tel, grupo: contato.grupo });
    setErros({});
    setModalFormVisivel(true);
  }

  // Abre modal de confirmação de EXCLUSÃO
  function abrirExcluir(contato: Contato) {
    setContatoAtivo(contato);
    setModalExcluirVisivel(true);
  }

  // Valida o formulário e salva (cria ou atualiza)
  function salvar() {
    const novosErros: Partial<FormContato> = {};

    if (!form.nome.trim())
      novosErros.nome = "Nome é obrigatório";

    if (!form.email.trim())
      novosErros.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      novosErros.email = "Formato de e-mail inválido";

    // Se houver erros, exibe e para aqui
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    if (contatoAtivo) {
      // EDIÇÃO: substitui o contato no array pelo id
      setContatos((prev) =>
        prev.map((c) => (c.id === contatoAtivo.id ? { ...c, ...form } : c))
      );
      exibirToast("Contato atualizado!");
    } else {
      // CRIAÇÃO: adiciona novo contato com id único
      setContatos((prev) => [...prev, { id: Date.now(), ...form }]);
      exibirToast("Contato adicionado!");
    }

    setModalFormVisivel(false);
  }

  // Remove o contato ativo da lista
  function excluir() {
    if (!contatoAtivo) return;
    setContatos((prev) => prev.filter((c) => c.id !== contatoAtivo.id));
    setModalExcluirVisivel(false);
    exibirToast("Contato removido.");
  }

  // Exibe o toast por 2.5 segundos e some
  function exibirToast(mensagem: string) {
    setToast({ mensagem, visivel: true });
    setTimeout(() => setToast({ mensagem: "", visivel: false }), 2500);
  }

  // Grupos disponíveis para o picker do formulário
  const grupos: { valor: Grupo; label: string }[] = [
    { valor: "amigo",    label: "Amigo"    },
    { valor: "trabalho", label: "Trabalho" },
    { valor: "familia",  label: "Família"  },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <View style={styles.container}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <View>
            <Text style={styles.titulo}>Agenda</Text>
            <Text style={styles.subtitulo}>{contatos.length} contatos</Text>
          </View>
          <BotaoAdicionar texto="+ Novo" onPress={abrirCriar} />
        </View>

        {/* Input de busca */}
        <Input
          placeholder="Buscar por nome, e-mail ou grupo..."
          value={busca}
          onChangeText={setBusca}
          style={styles.busca}
        />

        {/* Card com a lista de contatos */}
        <View style={styles.card}>
          <Tabela
            dados={contatos}
            busca={busca}
            onEditar={abrirEditar}
            onExcluir={abrirExcluir}
          />
        </View>

      </View>

      {/* =====================================================
          MODAL DE FORMULÁRIO — adicionar ou editar contato
          ===================================================== */}
      <Modal
        visivel={modalFormVisivel}
        onFechar={() => setModalFormVisivel(false)}
        titulo={contatoAtivo ? "Editar contato" : "Novo contato"}
        acoes={
          <>
            <BotaoCancelar  texto="Cancelar" onPress={() => setModalFormVisivel(false)} />
            <BotaoConfirmar texto="Salvar"   onPress={salvar} />
          </>
        }
      >
        <Input
          label="Nome completo"
          placeholder="Ex: Ana Souza"
          value={form.nome}
          onChangeText={(v) => setForm({ ...form, nome: v })}
          erro={erros.nome}
          autoCapitalize="words"
        />

        <Input
          label="E-mail"
          placeholder="ana@email.com"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          erro={erros.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Telefone"
          placeholder="(11) 9 9999-9999"
          value={form.tel}
          onChangeText={(v) => setForm({ ...form, tel: v })}
          hint="Opcional"
          keyboardType="phone-pad"
        />

        {/* Seletor de grupo — botões de toggle */}
        <Text style={styles.grupoLabel}>Grupo</Text>
        <View style={styles.grupoRow}>
          {grupos.map((g) => (
            <View
              key={g.valor}
              style={[
                styles.grupoBotao,
                form.grupo === g.valor && styles.grupoBotaoAtivo,
              ]}
            >
              {/* Usa TouchableOpacity direto pois é um toggle, não um Botao semântico */}
              <Text
                style={[
                  styles.grupoBotaoTexto,
                  form.grupo === g.valor && styles.grupoBotaoTextoAtivo,
                ]}
                onPress={() => setForm({ ...form, grupo: g.valor })}
              >
                {g.label}
              </Text>
            </View>
          ))}
        </View>
      </Modal>

      {/* =====================================================
          MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
          ===================================================== */}
      <Modal
        visivel={modalExcluirVisivel}
        onFechar={() => setModalExcluirVisivel(false)}
        titulo="Excluir contato"
        acoes={
          <>
            <BotaoEditar   texto="Cancelar" onPress={() => setModalExcluirVisivel(false)} />
            <BotaoCancelar texto="Excluir"  onPress={excluir} />
          </>
        }
      >
        <Text style={styles.textoExcluir}>
          Tem certeza que deseja excluir{" "}
          <Text style={{ fontWeight: "700" }}>{contatoAtivo?.nome}</Text>?{"\n"}
          Esta ação não pode ser desfeita.
        </Text>
      </Modal>

      {/* Toast de feedback */}
      <Toast mensagem={toast.mensagem} visivel={toast.visivel} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
  },
  subtitulo: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  busca: {
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    overflow: "hidden",
  },
  grupoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 8,
  },
  grupoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  grupoBotao: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    alignItems: "center",
  },
  grupoBotaoAtivo: {
    backgroundColor: "#1e88e5",
    borderColor: "#1e88e5",
  },
  grupoBotaoTexto: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555",
  },
  grupoBotaoTextoAtivo: {
    color: "#fff",
  },
  textoExcluir: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
});