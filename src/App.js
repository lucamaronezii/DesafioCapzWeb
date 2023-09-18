import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function formatarResultados(resultados) {
  return resultados.map((resultado) => {
    const formattedResultado = {};
    for (const key in resultado) {
      if (resultado.hasOwnProperty(key)) {
        formattedResultado[`${key.charAt(0).toUpperCase() + key.slice(1)}:`] = resultado[key];
      }
    }
    return formattedResultado;
  });
}

function App() {
  const [palavraChave, setPalavraChave] = useState('');
  const [resultados, setResultados] = useState([]);
  const [erro, setErro] = useState(null);
  const [modoEscuro, setModoEscuro] = useState(false);

  const handleInputChange = async (e) => {
    const valor = e.target.value;
    setPalavraChave(valor);

    try {
      const response = await fetch(`https://localhost:7082/Sistema/pesquisar?palavraChave=${valor}`);
      const data = await response.json();
      const formattedData = formatarResultados(data);
      setResultados(formattedData);
      setErro(null);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      setResultados([]);
      setErro('Erro ao buscar resultados. Verifique a conexão com a API.');
    }
  };

  const toggleModo = () => {
    setModoEscuro(!modoEscuro);
  };

  useEffect(() => {
    if (modoEscuro) {
      document.body.classList.add('bg-dark', 'text-light');
    } else {
      document.body.classList.remove('bg-dark', 'text-light');
    }
  }, [modoEscuro]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className={`text-center ${modoEscuro ? 'text-light' : ''}`}>Multisearch</h1>
        <button className={`btn ${modoEscuro ? 'btn-light' : 'btn-dark'}`} onClick={toggleModo}>
          {modoEscuro ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className={`form-control ${modoEscuro ? 'bg-dark text-light' : ''}`}
          placeholder="Digite sua pesquisa e pressione Enter"
          value={palavraChave}
          onChange={handleInputChange}
        />
      </div>
      {erro && <p className="text-danger">{erro}</p>}
      <ul className={`list-group ${modoEscuro ? 'bg-dark text-light' : ''}`}>
        {resultados.length === 0 ? (
          <li className="list-group-item">Nenhum objeto encontrado.</li>
        ) : (
          resultados.map((resultado, index) => (
            <li className={`list-group-item ${modoEscuro ? 'bg-dark text-light' : ''}`} key={index}>
              {Object.entries(resultado).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}</strong> {value}
                </p>
              ))}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;