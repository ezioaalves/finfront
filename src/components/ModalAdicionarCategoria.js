// Dentro de src/components/ModalAdicionarCategoria.js
import React, { useState } from 'react';

function ModalAdicionarCategoria(props) {
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [descricaoCategoria, setDescricaoCategoria] = useState('');

    if (!props.isOpen) {
        return null; // Não renderiza nada se o modal não estiver aberto
    }

    const handleSubmitModal = (event) => {
        event.preventDefault();
        if (!nomeCategoria.trim()) {
            alert("Por favor, insira o nome da categoria.");
            return;
        }

        if (!descricaoCategoria.trim()) {
            alert("Por favor, insira a descrição da categoria.");
            return;
        }

        props.onSalvar({
            name: nomeCategoria,
            description: descricaoCategoria,
        });

        setNomeCategoria('');
        setDescricaoCategoria('');
    };


    const modalStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '30px',
        zIndex: 1000,
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999
    };

    return (
        <>
            <div style={overlayStyle} onClick={props.onClose} />
            <div style={modalStyle}>
                <h2>Adicionar Nova Categoria</h2>
                <form onSubmit={handleSubmitModal}>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="nomeCategoria" style={{ display: 'block', marginBottom: '5px' }}>Nome da Categoria:</label>
                        <input
                            type="text"
                            id="nomeCategoria"
                            value={nomeCategoria}
                            onChange={(e) => setNomeCategoria(e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="descricaoCategoria" style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
                        <input
                            type="text"
                            id="descricaoCategoria"
                            value={descricaoCategoria}
                            onChange={(e) => setDescricaoCategoria(e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={props.onClose}
                            style={{ marginRight: '10px', padding: '8px 15px' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            Salvar Categoria
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ModalAdicionarCategoria;