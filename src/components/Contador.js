// Dentro de src/components/Contador.js
import React, { useState } from 'react';

function Contador() {
    // Declara uma nova variável de estado chamada "contagem", inicializada com 0
    // 'setContagem' é a função para atualizar 'contagem'
    const [contagem, setContagem] = useState(0);

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px', textAlign: 'center' }}>
            <h2>Contador Simples</h2>
            <p>Você clicou {contagem} vezes</p>
            {/* Quando o botão é clicado, chamamos setContagem para incrementar o valor de contagem */}
            <button onClick={() => setContagem(contagem + 1)}>
                Clique aqui para Aumentar
            </button>
            <button onClick={() => setContagem(contagem - 1)} style={{ marginLeft: '10px' }}>
                Clique aqui para Diminuir
            </button>
            <button onClick={() => setContagem(0)} style={{ marginLeft: '10px' }}>
                Zerar
            </button>
        </div>
    );
}

export default Contador;