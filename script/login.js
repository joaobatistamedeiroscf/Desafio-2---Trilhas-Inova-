const mostrarSenha = document.querySelector('.mostrar-senha');

mostrarSenha.addEventListener('click', function() {
    let senhaInput = document.getElementById('senha');
    const tipoAtual = senhaInput.getAttribute('type');
    senhaInput.setAttribute('type', tipoAtual === 'password' ? 'text' : 'password');
    this.textContent = tipoAtual === 'password' ? '👀' : '🙈';
});
    
function entrar() {

    const cpf = document.getElementById('cpf');
    const cpfLabel = document.getElementById('cpf-label');

    const senha = document.getElementById('senha');
    const senhaLabel = document.getElementById('senha-label');

    const mensagemErro = document.getElementById('mensagem-erro');
    let listaUser = [];

    let userValid = {
        nome: '',
        CPF: '',
        senha: '',
    }

    listaUser = JSON.parse(localStorage.getItem('listaUser'));

    listaUser.forEach((item) => {
        if(cpf.value == item.CPF && senha.value == item.senha){
            userValid = {
                nome: item.nome,
                CPF: item.CPF,
                senha: item.senha
            }
        }
    });
    
    if(cpf.value == userValid.CPF && senha.value == userValid.senha) {
        window.location.href = 'home.html'
        
        let token = Math.random().toString(16).substr(2, 10) + Math.random().toString(16).substr(2, 10)
        localStorage.setItem('token', token);

        localStorage.setItem('userLogado', JSON.stringify(userValid));
    
    } else {
        cpfLabel.setAttribute('style', 'color: red');
        cpf.setAttribute('style', 'border-color: red');
        senhaLabel.setAttribute('style', 'color: red');
        senha.setAttribute('style', 'border-color: red');
        mensagemErro.setAttribute('style', 'display: block');
        mensagemErro.innerHTML = 'CPF ou senha incorretos';
        cpf.focus();
    }

}