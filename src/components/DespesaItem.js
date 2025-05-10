import React, { useState } from 'react';// Todo componente React precisa importar o React

// Este é o nosso componente funcional DespesaItem
function DespesaItem(props) {
    const handleExcluirClick = () => {
        if (window.confirm(`Tem certeza que deseja excluir a despesa "${props.descricao}"?`)) {
            props.onExcluir(props.id);
        }
    }

    return (
        <div className="despesa-item" style={{ border: '1px solid #eee', padding: '10px', margin: '10px', borderRadius: '5px' }}>
            <h3>{props.descricao} (ID: {props.id})</h3>
            <p>Valor: R$ {props.valor ? props.valor.toFixed(2) : '0.00'}</p>
            <p>Data: {props.data}</p>
            <p>Categoria: {props.categoria}</p>
            <button onClick={handleExcluirClick} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                Excluir
            </button>
            <button
                onClick={() => props.onAbrirFormEdicao(props)}
                style={{ backgroundColor: 'orange', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginLeft: '5px' }}
            >
                Editar
            </button>
        </div>
    );
}

export default DespesaItem; // Não se esqueça de exportar para poder usá-lo em outros lugares!