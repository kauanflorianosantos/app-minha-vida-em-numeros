import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Button, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import Grafico from './components/Grafico';
import * as Database from './services/Database';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [registroEmEdicao, setRegistroEmEdicao] = useState(null);
  const [ordenacao, setOrdenacao] = useState('recentes');

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados || []);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) Database.salvarDados(registros);
  }, [registros, carregando]);

  const handleSave = (marca, dias, uso) => {
    if (!marca || !dias || !uso) return Alert.alert('Erro', 'Preencha todos os campos');
    const diasNum = parseFloat(dias), usoNum = parseFloat(uso);
    if (isNaN(diasNum) || isNaN(usoNum) || diasNum < 0 || usoNum < 0) return Alert.alert('Erro', 'Valores inválidos');

    if (registroEmEdicao) {
      setRegistros(registros.map(r => r.id === registroEmEdicao.id ? { ...r, marca, dias: diasNum, uso: usoNum } : r));
      Alert.alert('Sucesso', 'Registro atualizado!');
    } else {
      setRegistros([...registros, { id: new Date().getTime(), marca, dias: diasNum, uso: usoNum }]);
      Alert.alert('Sucesso', 'Registro salvo!');
    }
    setRegistroEmEdicao(null);
  };

  const handleDelete = id => setRegistros(registros.filter(r => r.id !== id));
  const handleEdit = reg => setRegistroEmEdicao(reg);
  const handleCancel = () => setRegistroEmEdicao(null);

  let registrosExibidos = [...registros];
  if (ordenacao === 'maior_uso') registrosExibidos.sort((a,b)=>b.uso-a.uso);
  else registrosExibidos.sort((a,b)=>b.id-a.id);

  if (carregando) return <ActivityIndicator size="large" color="#3498db" style={{marginTop:50}}/>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Diário de Cigarros Eletrônicos 🚬</Text>
        <Text style={styles.subtituloApp}>App Interativo e Profissional</Text>

        <Grafico registros={registrosExibidos} />

        <View style={{flexDirection:'row', justifyContent:'center', marginBottom:10, gap:10}}>
          <Button title="Mais Recentes" onPress={()=>setOrdenacao('recentes')}/>
          <Button title="Maior Uso" onPress={()=>setOrdenacao('maior_uso')}/>
        </View>

        <Formulario onSave={handleSave} onCancel={handleCancel} registroEmEdicao={registroEmEdicao}/>
        <ListaRegistros registros={registrosExibidos} onEdit={handleEdit} onDelete={handleDelete}/>

        <View style={styles.card}>
          <Text style={styles.subtitulo}>Exportar Dados</Text>
          <TouchableOpacity style={styles.botaoExportar} onPress={() => {
            if (registros.length===0) return Alert.alert('Aviso','Nenhum dado para exportar.');
            const jsonString = JSON.stringify(registros, null, 2);
            const blob = new Blob([jsonString], {type:'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download='dados.json'; a.click();
            URL.revokeObjectURL(url);
          }}>
            <Text style={styles.botaoTexto}>Exportar arquivo dados.json</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, paddingTop:25, backgroundColor:'#f0f4f7' },
  titulo:{ fontSize:28, fontWeight:'bold', textAlign:'center', marginVertical:20, color:'#1e3a5f' },
  subtituloApp:{ textAlign:'center', fontSize:16, color:'#555', marginTop:-20, marginBottom:20, fontStyle:'italic' },
  card:{ backgroundColor:'white', borderRadius:8, padding:15, marginHorizontal:15, marginBottom:20, elevation:3 },
  subtitulo:{ fontSize:20, fontWeight:'bold', marginBottom:15, color:'#34495e' },
  botaoExportar:{ backgroundColor:'#27ae60', padding:15, borderRadius:5, alignItems:'center', marginTop:5 },
  botaoTexto:{ color:'white', fontSize:16, fontWeight:'bold' },
});
