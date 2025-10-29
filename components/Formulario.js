import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [marcaCigarro, setMarcaCigarro] = useState('');
  const [quantidadeDias, setQuantidadeDias] = useState('');
  const [quantidadeUso, setQuantidadeUso] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setMarcaCigarro(registroEmEdicao.marca);
      setQuantidadeDias(String(registroEmEdicao.dias));
      setQuantidadeUso(String(registroEmEdicao.uso));
    } else {
      setMarcaCigarro('');
      setQuantidadeDias('');
      setQuantidadeUso('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(marcaCigarro, quantidadeDias, quantidadeUso);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro' : 'Novo Registro'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Marca do cigarro eletrônico"
        value={marcaCigarro}
        onChangeText={setMarcaCigarro}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade de dias"
        keyboardType="numeric"
        value={quantidadeDias}
        onChangeText={setQuantidadeDias}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade usada"
        keyboardType="numeric"
        value={quantidadeUso}
        onChangeText={setQuantidadeUso}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
  input: { borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, padding: 12, fontSize: 16, marginBottom: 10 },
  botao: { backgroundColor: '#3498db', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  botaoCancelar: { backgroundColor: '#7f8c8d', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
});
