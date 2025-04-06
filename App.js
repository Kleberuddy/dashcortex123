import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const DashCortexReportUploader = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [campaignData, setCampaignData] = useState([]);

  const total = campaignData.reduce((acc, item) => {
    acc.impressoes += item.impressoes;
    acc.cliques += item.cliques;
    acc.conversoes += item.conversoes;
    acc.custo += item.custo;
    return acc;
  }, { impressoes: 0, cliques: 0, conversoes: 0, custo: 0 });

  const toNumber = (val) => parseFloat((val || '0').toString().replace(',', '.')) || 0;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const parsedData = jsonData.map(row => ({
          name: row['Nome da campanha'] || 'Desconhecida',
          impressoes: toNumber(row['Impressões']),
          cliques: toNumber(row['Cliques no link']),
          conversoes: toNumber(row['Conversões']),
          ctr: toNumber(row['CTR (todos)']),
          cpc: toNumber(row['CPC (custo por clique no link)']),
          custo: toNumber(row['Valor usado'])
        }));

        setCampaignData(parsedData);
        setFileUploaded(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>DashCortex - Relatório Meta Ads</h1>
      <input type="file" onChange={handleFileUpload} />
      {!fileUploaded ? (
        <p>Faça upload de um arquivo .xlsx</p>
      ) : (
        <>
          <h2>Resumo</h2>
          <ul>
            <li>Impressões: {total.impressoes.toLocaleString()}</li>
            <li>Cliques: {total.cliques.toLocaleString()}</li>
            <li>Conversões: {total.conversoes.toLocaleString()}</li>
            <li>Custo: R$ {total.custo.toFixed(2)}</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default DashCortexReportUploader;
