document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.pagina-login-container');
    const senhaInput = document.getElementById('senha');
    const mostrarSenha = document.querySelector('.mostrar-senha');
    
    mostrarSenha.addEventListener('click', function() {
        const tipoAtual = senhaInput.getAttribute('type');
        senhaInput.setAttribute('type', tipoAtual === 'password' ? 'text' : 'password');
        this.textContent = tipoAtual === 'password' ? '👀' : '🙈';
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cpf = document.getElementById('cpf').value.trim();
        const senha = senhaInput.value.trim();
        let valido = true;
        
        if (!cpf) {
            mostrarErro('cpf', 'CPF é obrigatório');
            valido = false;
        } else if (!validarCPF(cpf)) {
            mostrarErro('cpf', 'CPF inválido');
            valido = false;
        } else {
            esconderErro('cpf');
        }
        
        if (!senha) {
            mostrarErro('senha', 'Senha é obrigatória');
            valido = false;
        } else if (senha.length < 8) {
            mostrarErro('senha', 'Senha deve ter pelo menos 8 caracteres');
            valido = false;
        } else if (!senhaForte(senha)) {
            valido = false; 
        } else {
            esconderErro('senha');
        }
        
        if (valido) {
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        }
    });
    
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false; 
        }
        
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto >= 10 ? 0 : resto;
        
        if (digito1 !== parseInt(cpf.charAt(9))) {
            return false;
        }
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto >= 10 ? 0 : resto;
        
        return digito2 === parseInt(cpf.charAt(10));
    }

    function mostrarErro(campo, mensagem) {
        const erroElement = document.getElementById(`erro-${campo}`);
        const inputElement = document.getElementById(campo);
        
        if (erroElement && inputElement) {
            erroElement.textContent = mensagem;
            erroElement.style.display = 'block';
            inputElement.style.borderColor = '#E43A12';
        }
    }
    
    function esconderErro(campo) {
        const erroElement = document.getElementById(`erro-${campo}`);
        const inputElement = document.getElementById(campo);
        
        if (erroElement && inputElement) {
            erroElement.style.display = 'none';
            inputElement.style.borderColor = '';
        }
    }

    function senhaForte(senhafo) {
        let temMaiuscula = /[A-Z]/.test(senhafo);
        let temMinuscula = /[a-z]/.test(senhafo);
        let temNumero = /[0-9]/.test(senhafo);
        let temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senhafo);
    
        if (!temMaiuscula) {
            alert("A senha deve conter pelo menos uma letra maiúscula.");
            return false;
        }
        if (!temMinuscula) {
            alert("A senha deve conter pelo menos uma letra minúscula.");
            return false;
        }
        if (!temNumero) {
            alert("A senha deve conter pelo menos um número.");
            return false;
        }
        if (!temEspecial) {
            alert("A senha deve conter pelo menos um caractere especial.");
            return false;
        }
        return true;
    }

});