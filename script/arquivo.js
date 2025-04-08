const form = document.getElementById("form");
const nome = document.getElementById("nome");
const data = document.getElementById("data");
const cpf = document.getElementById("cpf");
const email = document.getElementById("email");
const telefone = document.getElementById("phone");
const cep = document.getElementById("cep");
const sexo = document.getElementById("sexo");
const rua = document.getElementById("rua");
const numeroCasa = document.getElementById("numero-casa");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");
const trilhas = document.querySelectorAll("input[name='trilha']");
const comprovanteDeIdentidade = document.getElementById("identidade");
const comprovanteDeResidencia = document.getElementById("residencia");
const senhalogin = document.getElementById("senhalogin");

let trilhaSelecionada = null;

// Adicione este evento para todos os campos de input
const campos = [
    nome, data, cpf, email, telefone, cep, 
    sexo, rua, numeroCasa, cidade, estado, senhalogin
];

campos.forEach(campo => {
    // Quando começar a digitar, esconde o erro
    campo.addEventListener('input', function() {
        esconderErro(this.id);
        
        // Validação em tempo real para a senha
        if(this.id === 'senhalogin') {
            const senha = this.value;
            document.getElementById('req-tamanho').style.color = senha.length >= 8 ? 'green' : 'red';
            document.getElementById('req-maiuscula').style.color = /[A-Z]/.test(senha) ? 'green' : 'red';
            document.getElementById('req-minuscula').style.color = /[a-z]/.test(senha) ? 'green' : 'red';
            document.getElementById('req-numero').style.color = /[0-9]/.test(senha) ? 'green' : 'red';
            document.getElementById('req-especial').style.color = /[!@#$%^&*]/.test(senha) ? 'green' : 'red';
        }
    });
    
    // Quando clicar no campo, remove o estilo de erro temporariamente
    campo.addEventListener('click', function() {
        this.style.borderColor = '';
        const erroElement = document.getElementById(`erro-${this.id}`);
        if(erroElement) {
            erroElement.style.display = 'none';
        }
    });
});

trilhas.forEach(trilha => {
    trilha.addEventListener('change', function() {
        if(this.checked) {
            trilhaSelecionada = this.value;
        }
    });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    if (!validarCampos()) {
        return;
    }

    try {
        await salvarArquivos();

        salvarDadosUsuario();

        localStorage.removeItem('rascunhoInscricao');

        alert('Inscrição realizada com sucesso!');
        setTimeout(() => {
            window.location.href = "login.html";
        }, 500);
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        alert("Ocorreu um erro ao salvar seus dados. Tente novamente.");
    }
});

function validarCampos() {
    if (nome.value === "") {
        mostrarErro("nome", "Preencha com o nome completo");
        return false;
    }

    if (data.value === "") {
        mostrarErro("data", "Informe sua data de nascimento");
        return false;
    }

    if (cpf.value === "" || !validarCPF(cpf.value)) {
        alert("Por favor, .");
        mostrarErro("cpf", "Preencha corretamente o CPF (11 dígitos)");
        return false;
    }

    if (sexo.value !== "Masculino" && sexo.value !== "Feminino") {
        alert("Por favor, .");
        mostrarErro("sexo", "Selecione o sexo");  
        return false;
    }

    if (email.value === "" && !validarEmail(email.value)) {
        mostrarErro("email", "Email inválido");
        return false;
    }

    if (telefone.value === "" || !validarTelefone(telefone.value)) {
        mostrarErro("phone", "O telefone deve conter 11 dígitos, incluindo o DDD");
        return false;
    }

    if (!comprovanteDeIdentidade.files[0]) {
        alert("Por favor, anexe o documento de identidade.");
        return false;
    }

    if (cep.value === "" || !validarCEP(cep.value)) {
        mostrarErro("cep", "O CEP deve conter 8 dígitos.");
        return false;
    }

    if (rua.value === "") {
        mostrarErro("rua", "preencha com o nome da sua rua.");
        return false;
    }

    if (numeroCasa.value === "") {
        mostrarErro("numero-casa", "Número da casa não informado.");
        numeroCasa.focus();
        return false;
    }

    if (!comprovanteDeResidencia.files[0]) {
        alert("Por favor, anexe o comprovante de residência.");
        return false;
    }
   
    if (senhalogin.value === "" || !validarSenha(senhalogin.value)) {
        alert("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
        return false;
    }

    if (!trilhaSelecionada) {
        alert("Por favor, selecione uma trilha.");
        return false;
    }

    return true;
}

function salvarArquivos() {
    return new Promise((resolve, reject) => {
        const file1 = comprovanteDeIdentidade.files[0];
        const file2 = comprovanteDeResidencia.files[0];

        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = function(e) {
            localStorage.setItem('pdf1_identidade', file1.name);
            localStorage.setItem('pdf1_data', e.target.result);

            reader2.onload = function(e) {
                localStorage.setItem('pdf2_residencia', file2.name);
                localStorage.setItem('pdf2_data', e.target.result);
                resolve();
            };

            reader2.onerror = () => reject("Falha ao ler comprovante de residência");
            reader2.readAsDataURL(file2);
        };

        reader1.onerror = () => reject("Falha ao ler comprovante de identidade");
        reader1.readAsDataURL(file1);
    });
}

// Função para salvar os dados do usuário
function salvarDadosUsuario() {
    let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');

    listaUser.push({
        Nome: nome.value,
        DataDeNascimento: data.value,
        CPF: cpf.value,
        Sexo: sexo.value,
        Email: email.value,
        Telefone: telefone.value,
        CEP: cep.value,
        Rua: rua.value,
        Numero: numeroCasa.value,
        Cidade: cidade.value,
        Estado: estado.value,
        Trilha: trilhaSelecionada,
        Senha: senhalogin.value,
        Identidade: localStorage.getItem('pdf1_identidade'),
        Residencia: localStorage.getItem('pdf2_residencia')
    });

    localStorage.setItem("listaUser", JSON.stringify(listaUser));
}

function validarEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validarCPF(cpf) {
    return cpf.replace(/\D/g, '').length === 11;
}

function validarTelefone(telefone) {
    return telefone.replace(/\D/g, '').length === 11;
}

function validarCEP(cep) {
    return cep.replace(/\D/g, '').length === 8;
}

function validarSenha(senha) {
    return senha.length >= 8 &&
           /[A-Z]/.test(senha) &&
           /[a-z]/.test(senha) &&
           /[0-9]/.test(senha) &&
           /[!@#$%^&*]/.test(senha);
}

function buscarCep(cep) {
    const cepNumerico = cep.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                rua.value = data.logradouro || '';
                cidade.value = data.localidade || '';
                estado.value = data.uf || '';
            } else {
                alert('CEP não encontrado');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP. Verifique o número e tente novamente.');
        });
}


function salvarRascunho() {
    const formData = {
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        cpf: document.getElementById('cpf').value,
        sexo: document.getElementById('sexo').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numeroCasa: document.getElementById('numero-casa').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
    };
    
    localStorage.setItem('rascunhoInscricao', JSON.stringify(formData));
    alert('Progresso salvo com sucesso! Você pode continuar depois.');
}

function carregarRascunho() {
    const dadosSalvos = localStorage.getItem('rascunhoInscricao');
    if (dadosSalvos) {
        if(confirm('Encontramos um rascunho salvo. Deseja continuar de onde parou?')) {
            const formData = JSON.parse(dadosSalvos);
            
            document.getElementById('nome').value = formData.nome || '';
            document.getElementById('data').value = formData.data || '';
            document.getElementById('cpf').value = formData.cpf || '';
            document.getElementById('sexo').value = formData.sexo || '';
            document.getElementById('email').value = formData.email || '';
            document.getElementById('phone').value = formData.phone || '';
            document.getElementById('cep').value = formData.cep || '';
            document.getElementById('rua').value = formData.rua || '';
            document.getElementById('numero-casa').value = formData.numeroCasa || '';
            document.getElementById('cidade').value = formData.cidade || '';
            document.getElementById('estado').value = formData.estado || '';
        }
    }
}

document.querySelector('.salvar-dados').addEventListener('click', salvarRascunho);

document.addEventListener('DOMContentLoaded', carregarRascunho);


function mostrarErro(campo, mensagem) {
    const erroElement = document.getElementById(`erro-${campo}`);
    const inputElement = document.getElementById(campo);
    
    if (erroElement && inputElement) {
        erroElement.textContent = mensagem;
        erroElement.style.display = 'block';
        inputElement.style.borderColor = 'var(--cor-sexta)';
        inputElement.focus();
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