// Dentro de src/components/FileUploadForm.js
import React, { useState } from 'react';

function FileUploadForm(props) { 
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('EXTRATO');

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      if (!fileName) {
        setFileName(event.target.files[0].name);
      }
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Por favor, selecione um arquivo.");
      return;
    }
    if (!fileName.trim()) {
      alert("Por favor, dê um nome ao arquivo.");
      return;
    }
    if (!fileType) {
      alert("Por favor, selecione o tipo do arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', fileName);
    formData.append('file_type', fileType);

    //console.log("FileUploadForm: Enviando FormData...", formData);

    if (props.onFileUpload) {
      props.onFileUpload(formData);
    }


    if (event.target) { 
        event.target.reset();
        setSelectedFile(null);
        setFileName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px auto', padding: '20px', border: '1px solid #007bff', borderRadius: '8px', maxWidth: '500px' }}>
      <h2 style={{ textAlign: 'center', color: '#007bff' }}>Upload de Arquivo</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="fileInput" style={{ display: 'block', marginBottom: '5px' }}>Selecionar Arquivo:</label>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          required
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="fileName" style={{ display: 'block', marginBottom: '5px' }}>Nome do Arquivo:</label>
        <input
          type="text"
          id="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Ex: Extrato Bancário Maio"
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="fileType" style={{ display: 'block', marginBottom: '5px' }}>Tipo do Arquivo:</label>
        <select
          id="fileType"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          required
        >
          <option value="EXTRATO">EXTRATO (Extrato Bancário)</option>
          <option value="FATURA">FATURA (Fatura de Cartão/Serviço)</option>
        </select>
      </div>

      <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Enviar Arquivo
      </button>
    </form>
  );
}

export default FileUploadForm;