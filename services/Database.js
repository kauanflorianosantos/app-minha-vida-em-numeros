export const carregarDados = async () => {
  try {
    const dadosString = localStorage.getItem('registros_cigarros');
    return dadosString ? JSON.parse(dadosString) : [];
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    return [];
  }
};

export const salvarDados = async (registros) => {
  try {
    localStorage.setItem('registros_cigarros', JSON.stringify(registros));
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
  }
};
