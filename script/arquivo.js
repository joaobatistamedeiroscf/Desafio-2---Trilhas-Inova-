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

// Variável para armazenar a trilha selecionada
let trilhaSelecionada = null;

// Validação de senha em tempo real
senhalogin.addEventListener('input', function() {
    const senha = this.value;
    
    document.getElementById('req-tamanho').style.color = senha.length >= 8 ? 'green' : 'red';
    document.getElementById('req-maiuscula').style.color = /[A-Z]/.test(senha) ? 'green' : 'red';
    document.getElementById('req-minuscula').style.color = /[a-z]/.test(senha) ? 'green' : 'red';
    document.getElementById('req-numero').style.color = /[0-9]/.test(senha) ? 'green' : 'red';
    document.getElementById('req-especial').style.color = /[!@#$%^&*]/.test(senha) ? 'green' : 'red';
});

// Atualiza a trilha selecionada quando o usuário escolhe
trilhas.forEach(trilha => {
    trilha.addEventListener('change', function() {
        if(this.checked) {
            trilhaSelecionada = this.value;
        }
    });
});

// Validação do formulário ao enviar
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    // Validação dos campos
    if (!validarCampos()) {
        return;
    }

    try {
        // Salva os arquivos primeiro
        await salvarArquivos();

        // Salva os dados do usuário
        salvarDadosUsuario();

        alert('Inscrição realizada com sucesso!');
        setTimeout(() => {
            window.location.href = "login.html";
        }, 500);
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
        alert("Ocorreu um erro ao salvar seus dados. Tente novamente.");
    }
});

// Função para validar todos os campos
function validarCampos() {
    if (nome.value === "") {
        alert("Por favor, preencha o seu nome.");
        return false;
    }

    if (data.value === "") {
        alert("Por favor, informe sua data de nascimento.");
        return false;
    }

    if (cpf.value === "" || !validarCPF(cpf.value)) {
        alert("Por favor, preencha corretamente o CPF (11 dígitos).");
        return false;
    }

    if (sexo.value !== "Masculino" && sexo.value !== "Feminino") {
        alert("Por favor, selecione o sexo.");  
        return false;
    }

    if (email.value === "" || !validarEmail(email.value)) {
        alert("Por favor, preencha com um e-mail válido.");
        return false;
    }

    if (telefone.value === "" || !validarTelefone(telefone.value)) {
        alert("O telefone deve conter 11 dígitos, incluindo o DDD.");
        return false;
    }

    if (!comprovanteDeIdentidade.files[0]) {
        alert("Por favor, anexe o documento de identidade.");
        return false;
    }

    if (cep.value === "" || !validarCEP(cep.value)) {
        alert("O CEP deve conter 8 dígitos.");
        return false;
    }

    if (rua.value === "") {
        alert("Por favor, preencha com o nome da sua rua.");
        return false;
    }

    if (numeroCasa.value === "") {
        alert("Por favor, preencha com o número da sua casa.");
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

// Função para salvar arquivos no localStorage
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

// Funções auxiliares de validação
function validarEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validarCPF(cpf) {
    // Remove caracteres não numéricos e verifica se tem 11 dígitos
    return cpf.replace(/\D/g, '').length === 11;
}

function validarTelefone(telefone) {
    // Remove caracteres não numéricos e verifica se tem 11 dígitos
    return telefone.replace(/\D/g, '').length === 11;
}

function validarCEP(cep) {
    // Remove caracteres não numéricos e verifica se tem 8 dígitos
    return cep.replace(/\D/g, '').length === 8;
}

function validarSenha(senha) {
    return senha.length >= 8 &&
           /[A-Z]/.test(senha) &&
           /[a-z]/.test(senha) &&
           /[0-9]/.test(senha) &&
           /[!@#$%^&*]/.test(senha);
}

// Busca CEP
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
