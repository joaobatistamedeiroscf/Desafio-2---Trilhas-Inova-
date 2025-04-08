let userLogado = JSON.parse(localStorage.getItem('userLogado'));
let logado = document.getElementById('logado');

logado.innerHTML = `Olá ${userLogado.nome}`;

if(localStorage.getItem('token') == null){
    alert('Você precisa está logado para acessar essa página!');
    window.location.href = 'login.html';
}


function sair(){
    localStorage.removeItem('token');
    localStorage.removeItem('userLogado');
    window.location.href = 'login.html';
}


// Recupera os PDFs do localStorage e cria links para download
function loadPDFsFromLocalStorage() {
    const pdf1Base64 = localStorage.getItem('pdf1');
    const pdf1Name = localStorage.getItem('pdf1_identidade');
    const pdf2Base64 = localStorage.getItem('pdf2');
    const pdf2Name = localStorage.getItem('pdf2_residencia');
  
    // Cria um link para download do PDF 1
    const link1 = document.createElement('a');
    link1.href = pdf1Base64;
    link1.download = pdf1Name || 'documento1.pdf';
    link1.innerHTML = 'Comprovante de identidade<br>';
    document.body.appendChild(link1);
  
    // Cria um link para download do PDF 2
    const link2 = document.createElement('a');
    link2.href = pdf2Base64;
    link2.download = pdf2Name || 'documento2.pdf';
    link2.textContent = 'Comprovante de residência';
    document.body.appendChild(link2);
  
}

loadPDFsFromLocalStorage();