import React, { useState, useEffect } from 'react';
import DespesaItem from './components/DespesaItem';
import AddExpenseForm from './components/AddExpenseForm';
import ModalAdicionarCategoria from './components/ModalAdicionarCategoria';
import FileUploadForm from './components/FileUploadForm';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [minhasDespesas, setMinhasDespesas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isModalCategoriaAberto, setIsModalCategoriaAberto] = useState(false);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [despesaParaEditar, setDespesaParaEditar] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleSalvarEdicaoDespesa = async (id, dadosAtualizados) => {
    console.log(`App.js: Tentando ATUALIZAR despesa ID: ${id} com dados:`, dadosAtualizados);
    const despesaAtualizadaParaAPI = {
      description: dadosAtualizados.descricao,
      category: dadosAtualizados.categoria,
      amount: parseFloat(dadosAtualizados.valor),
      date: dadosAtualizados.data,
      transaction_type: "DEBIT",
    };

    setErro(null);

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/transactions/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(despesaAtualizadaParaAPI),
      });

      if (!resposta.ok) {
        const erroData = await resposta.text();
        throw new Error(`Erro HTTP: ${resposta.status} - ${erroData || 'Falha ao atualizar despesa'}`);
      }

      const despesaRetornadaPelaAPI = await resposta.json();

      const despesaAtualizadaFormatada = {
        id: despesaRetornadaPelaAPI.id.toString(),
        descricao: despesaRetornadaPelaAPI.description,
        valor: parseFloat(despesaRetornadaPelaAPI.amount),
        data: despesaRetornadaPelaAPI.date,
        categoria: despesaRetornadaPelaAPI.category,
      };

      setMinhasDespesas((prevDespesas) =>
        prevDespesas.map(d => (d.id === id ? despesaAtualizadaFormatada : d))
      );

      setModoEdicao(false);
      setDespesaParaEditar(null);

    } catch (e) {
      console.error("Erro ao atualizar despesa:", e);
      setErro(e.message);
    }
    finally {
      setEstaCarregando(false);
    }
  };

  const handleCancelarEdicao = () => {
    setModoEdicao(false);
    setDespesaParaEditar(null);
  };

  useEffect(() => {
    const buscarDespesas = async () => {
      setEstaCarregando(true);
      setErro(null);
      try {
        const resposta = await fetch(`${API_BASE_URL}/api/transactions/`);
        if (!resposta.ok) {
          const erroData = await resposta.text();
          throw new Error(`Erro HTTP: ${resposta.status} - ${erroData || 'Falha ao buscar despesas'}`);
        }
        const dadosApi = await resposta.json();
        const despesasFormatadas = dadosApi.map(item => ({
          id: item.id.toString(),
          descricao: item.description,
          valor: parseFloat(item.amount),
          data: item.date,
          categoria: item.category,
        }));
        setMinhasDespesas(despesasFormatadas);

      } catch (e) {
        console.error("Erro ao buscar despesas da API:", e);
        setErro(e.message);
      } finally {
        setEstaCarregando(false);
      }
    };
    buscarDespesas();
  }, []);

  useEffect(() => {
    const carregarDadosInicais = async () => {
      setEstaCarregando(true);
      setErro(null);
      try {
        const respostaDespesas = await fetch(`${API_BASE_URL}/api/transactions/`);
        if (!respostaDespesas.ok) {
          throw new Error(`Falha ao buscar despesas: ${respostaDespesas.statusText}`)
        }
        const dadosApiDespesas = await respostaDespesas.json();
        const despesasFormatadas = dadosApiDespesas.map(item => ({
          id: item.id.toString(),
          descricao: item.description,
          valor: parseFloat(item.amount),
          data: item.date,
          categoria: item.category,
        }));
        setMinhasDespesas(despesasFormatadas);

        const respostaCategorias = await fetch(`${API_BASE_URL}/api/categories/`);
        if (!respostaCategorias.ok) {
          throw new Error(`Falha ao buscar categorias: ${respostaCategorias.statusText}`)
        }
        const dadosApiCategorias = await respostaCategorias.json();
        setCategorias(dadosApiCategorias);

        const respostaFiles = await fetch(`${API_BASE_URL}/api/file-upload/`);
        if (!respostaFiles.ok) throw new Error(`Falha ao buscar arquivos: ${respostaFiles.statusText}`);
        const dadosApiFiles = await respostaFiles.json();
        setUploadedFiles(dadosApiFiles);
        console.log("Arquivos carregados:", dadosApiFiles);

      } catch (e) {
        console.error("Erro ao carregar dados iniciais:", e);
        setErro(e.message);
      } finally {
        setEstaCarregando(false);
      }
    };

    carregarDadosInicais();
  }, []);
  const adicionarDespesaHandler = async (dadosDoFormulario) => {
    const despesaParaEnviar = {
      description: dadosDoFormulario.descricao,
      category: dadosDoFormulario.categoria,
      amount: parseFloat(dadosDoFormulario.valor),
      date: dadosDoFormulario.data,
      transaction_type: "DEBIT",
    };

    setEstaCarregando(true);
    setErro(null);

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/transactions/`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(despesaParaEnviar),
      });

      if (!resposta.ok) {
        const erroData = await resposta.text();
        throw new Error(`Erro HTTP: ${resposta.status} - ${erroData || 'Falha ao adicionar despesa'}`);
      }

      const despesaCriada = await resposta.json();

      const despesaFormatadaDaApi = {
        id: despesaCriada.id.toString(),
        descricao: despesaCriada.description,
        valor: parseFloat(despesaCriada.amount),
        data: despesaCriada.date,
        categoria: despesaCriada.category,
      };
      setMinhasDespesas((prevDespesas) => [despesaFormatadaDaApi, ...prevDespesas]);
    }
    catch (e) {
      console.error("Erro ao adicionar despesa:", e);
      setErro(e.message);
    }
    finally {
      setEstaCarregando(false);
    }
  };

  const excluirDespesaHandler = async (id) => {
    console.log("Excluindo despesa com ID:", id);
    setEstaCarregando(true);
    setErro(null);

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/transactions/${id}/`, {
        method: 'DELETE',
      });

      if (!resposta.ok) {
        if (resposta.status === 204) {
          console.log("Despesa excluída com sucesso.");
        } else {
          const erroData = await resposta.text();
          throw new Error(`Erro HTTP: ${resposta.status} - ${erroData || 'Falha ao excluir despesa'}`);
        }
      }

      setMinhasDespesas((prevDespesas) => prevDespesas.filter(despesa => despesa.id !== id));
    }
    catch (e) {
      console.error("Erro ao excluir despesa:", e);
      setErro(e.message);
    }
    finally {
      setEstaCarregando(false);
    }
  };

  const handleAbrirFormularioEdicao = (despesa) => {
    console.log("Editando despesa:", despesa);
    setDespesaParaEditar(despesa);
    setModoEdicao(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUploadSubmit = async (formData) => {
    console.log("App.js: Recebido FormData para upload:", formData);
    
    setEstaCarregando(true);
    setErro(null);

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/file-upload/`, {
        method: 'POST',
        body: formData, 
      });

      if (!resposta.ok) {
        const erroData = await resposta.text();
        throw new Error(`Falha ao enviar arquivo: ${erroData || resposta.statusText}`);
      }

      alert("Arquivo enviado com sucesso!");

      const respostaFiles = await fetch(`${API_BASE_URL}/api/file-upload/`);
      if (!respostaFiles.ok) throw new Error('Falha ao recarregar arquivos após upload');
      const dadosApiFiles = await respostaFiles.json();
      setUploadedFiles(dadosApiFiles);

    } catch (e) {
      console.error("Erro no upload do arquivo:", e);
      setErro(e.message);
      alert(`Erro no upload: ${e.message}`);
    } finally {
      setEstaCarregando(false);
    }
  };

  let conteudoDespesas = <p style={{ textAlign: 'center' }}>Nenhuma despesa encontrada.</p>;
  if (minhasDespesas.length > 0) {
    conteudoDespesas = minhasDespesas.map((despesa) => (
      <DespesaItem
        key={despesa.id}
        id={despesa.id}
        descricao={despesa.descricao}
        valor={despesa.valor}
        data={despesa.data}
        categoria={despesa.categoria}
        onExcluir={excluirDespesaHandler}
        onAbrirFormEdicao={handleAbrirFormularioEdicao}
        onCancelarEdicao={handleCancelarEdicao}
      />
    ));
  }
  if (erro) {
    conteudoDespesas = <p style={{ textAlign: 'center', color: 'red' }}>Erro: {erro}</p>;
  }
  if (estaCarregando) {
    conteudoDespesas = <p style={{ textAlign: 'center' }}>Carregando despesas...</p>;
  }

  const handleAbrirModalCategoria = () => {
    console.log("App.js: handleAbrirModalCategoria FOI CHAMADA!"); // <<< ADICIONE ESTE LOG
    setIsModalCategoriaAberto(true);
  };

  const handleFecharModalCategoria = () => {
    setIsModalCategoriaAberto(false);
  };

  const handleSalvarNovaCategoria = async (novaCategoria) => {
    console.log("App.js: Tentando salvar nova categoria:", novaCategoria);
    setEstaCarregando(true);
    setErro(null);

    try {
      const resposta = await fetch(`${API_BASE_URL}/api/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCategoria),
      });
      if (!resposta.ok) {
        const erroData = await resposta.text();
        throw new Error(`Falha ao criar nova categoria: ${erroData || resposta.statusText}`);
      }
      handleFecharModalCategoria();

      const respostaCategorias = await fetch(`${API_BASE_URL}/api/categories/`);
      if (!respostaCategorias.ok) throw new Error(`Falha ao buscar categorias: ${respostaCategorias.statusText}`);
      const dadosApiCategorias = await respostaCategorias.json();
      setCategorias(dadosApiCategorias);

    } catch (e) {
      console.error("Erro ao salvar nova categoria:", e);
      setErro(e.message); // Pode usar o estado de erro existente ou um novo para o modal
    } finally {
      setEstaCarregando(false);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Meu Registro de Despesas</h1>
      <AddExpenseForm
        onSalvarDespesa={adicionarDespesaHandler}
        modoEdicao={modoEdicao}
        despesaAtual={despesaParaEditar}
        onAtualizarDespesa={handleSalvarEdicaoDespesa}
        onCancelarEdicao={handleCancelarEdicao}
        categorias={categorias}
        onAbrirModalCategoria={handleAbrirModalCategoria}
      />
      {isModalCategoriaAberto && (
        <ModalAdicionarCategoria
          isOpen={isModalCategoriaAberto}
          onClose={handleFecharModalCategoria}
          onSalvar={handleSalvarNovaCategoria}
        />
      )}
      <hr style={{margin: '30px 0'}} />
      <FileUploadForm onFileUpload={handleFileUploadSubmit} />

      <div style={{marginTop: '30px'}}>
        <h2 style={{ textAlign: 'center' }}>Arquivos Enviados</h2>
        {estaCarregando && uploadedFiles.length === 0 && <p style={{textAlign: 'center'}}>Carregando arquivos...</p>}
        {erro && <p style={{textAlign: 'center', color: 'red'}}>Erro ao carregar arquivos: {erro}</p>}
        {!estaCarregando && uploadedFiles.length === 0 && !erro && <p style={{textAlign: 'center'}}>Nenhum arquivo enviado ainda.</p>}
        
        {uploadedFiles.length > 0 && (
          <ul style={{ listStyleType: 'none', padding: 0, maxWidth: '600px', margin: '0 auto' }}>
            {uploadedFiles.map(file => (
              <li key={file.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                <p><strong>Nome:</strong> {file.name}</p>
                <p><strong>Tipo:</strong> {file.file_type}</p>
                {/* O campo 'file.file' é um caminho. Se for um caminho relativo ao seu backend, 
                    você precisaria construir a URL completa para um link de download, 
                    ou sua API pode fornecer uma URL de download direta.
                    Por enquanto, apenas exibimos o caminho. */}
                <p><strong>Caminho/Link:</strong> {file.file}</p> 
                {/* Exemplo de link se o backend servir os arquivos diretamente:
                <p>
                  <strong>Link:</strong> 
                  <a href={`${API_BASE_URL}${file.file}`} target="_blank" rel="noopener noreferrer">
                    Ver Arquivo
                  </a>
                </p>
                */}
              </li>
            ))}
          </ul>
        )}
      </div>
      <hr />
      <h2 style={{ textAlign: 'center' }}>Lista de Despesas</h2>
      <div className="despesas-lista">
        {erro && !estaCarregando && <p style={{ textAlign: 'center', color: 'red' }}>Erro: {erro}</p>}
        {conteudoDespesas}
      </div>
    </div>
  );
}

export default App;