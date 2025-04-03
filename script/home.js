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