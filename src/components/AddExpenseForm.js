import React, { useState, useEffect } from "react";

function AddExpenseForm(props) {
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");

    useEffect(() => {
        if (props.modoEdicao && props.despesaAtual) {
            setDescricao(props.despesaAtual.descricao || '');
            setCategoria(props.despesaAtual.categoria || '');
            setValor(props.despesaAtual.valor ? props.despesaAtual.valor.toString() : '');
            setData(props.despesaAtual.data || '');
        } else {
            setDescricao('');
            if (props.categorias && props.categorias.length > 0) {
                setCategoria(props.categorias[0].name);
            } else {
                setCategoria('');
            }
            setValor('');
            setData('');
        }
    }, [props.modoEdicao, props.despesaAtual, props.categorias]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!descricao || !categoria || !valor || !data) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const dadosDoFormulario = {
            descricao: descricao,
            categoria: categoria,
            valor: valor,
            data: data,
        };

        if (props.modoEdicao && props.despesaAtual) {
            props.onAtualizarDespesa(props.despesaAtual.id, dadosDoFormulario);
        } else {
            const dadosComIdCliente = { ...dadosDoFormulario, id: new Date().getTime().toString() };
            props.onSalvarDespesa(dadosComIdCliente);
        }

        if (!props.modoEdicao) {
            setDescricao('');
            setCategoria('');
            setValor('');
            setData('');
        }
    };
    return (
        <form onSubmit={handleSubmit} style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px' }}>
            <h2 style={{ textAlign: 'center' }}>
                {props.modoEdicao ? 'Editar Despesa' : 'Adicionar Nova Despesa'}
            </h2>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="descricao" style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
                <input type="text" id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="categoria" style={{ display: 'block', marginBottom: '5px' }}>Categoria:</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select
                        id="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        style={{ flexGrow: 1, padding: '8px', boxSizing: 'border-box' }}
                        required
                    >
                        <option value="" disabled>Selecione uma categoria</option>
                        {props.categorias && props.categorias.map((cat) => (
                            <option key={cat.id || cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={props.onAbrirModalCategoria}
                        style={{ marginLeft: '10px', padding: '8px 10px', whiteSpace: 'nowrap' }}
                    >
                        Nova Categoria
                    </button>
                </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="valor" style={{ display: 'block', marginBottom: '5px' }}>Valor (R$):</label>
                <input type="number" id="valor" value={valor} onChange={(e) => setValor(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="Ex: 50.75" step="0.01" required />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="data" style={{ display: 'block', marginBottom: '5px' }}>Data:</label>
                <input type="date" id="data" value={data} onChange={(e) => setData(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
            </div>

            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: props.modoEdicao ? '#FFA500' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                {props.modoEdicao ? 'Atualizar Despesa' : 'Adicionar Despesa'}
            </button>

            {props.modoEdicao && (
                <button
                    type="button"
                    onClick={props.onCancelarEdicao}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#777', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
                >
                    Cancelar Edição
                </button>
            )}
        </form>
    );
};

export default AddExpenseForm;