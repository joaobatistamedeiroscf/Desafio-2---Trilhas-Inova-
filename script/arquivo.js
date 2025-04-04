let form = document.getElementById("form");
let nome = document.getElementById("nome");
let data = document.getElementById("data");
let cpf = document.getElementById("cpf");
let email = document.getElementById("email");
let telefone = document.getElementById("phone");
let cep = document.getElementById("cep");
let sexo = document.getElementById("sexo");
let rua = document.getElementById("rua");
let numeroCasa = document.getElementById("numero-casa");
let cidade = document.getElementById("cidade");
let estado = document.getElementById("estado");
let trilha = document.getElementById('');
let comprovanteDeIdentidade = document.getElementById("identidade");
let comprovanteDeResidencia = document.getElementById("residencia");
let senhalogin = document.getElementById("senhalogin");

document.getElementById('senhalogin').addEventListener('input', function() {
    const senha = this.value;
    
    document.getElementById('req-tamanho').style.color = senha.length >= 8 ? 'green' : 'red';
    document.getElementById('req-maiuscula').style.color = /[A-Z]/.test(senha) ? 'green' : 'red';
    document.getElementById('req-minuscula').style.color = /[a-z]/.test(senha) ? 'green' : 'red';
    document.getElementById('req-numero').style.color = /[0-9]/.test(senha) ? 'green' : 'red';
    document.getElementById('req-especial').style.color = /[!@#$%^&*]/.test(senha) ? 'green' : 'red';
});


form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let valido = true;

    if (nome.value === "") {
        alert("Por favor, preencha o seu nome.");
        return;
    }

    if(data.value ===""){
        alert("Por favor, informe sua data de nascimento");
        return;
    }

    if (cpf.value ==="" || !validaDigitosCpf(cpf.value, 14)) {
        alert("Por favor, preencha corretamente, o CPF deve conter 11 dígitos.");
        return;
    }

    if(sexo.value != "Masculino" && sexo.value != "Femenino"){
        alert("Por favor, selecione o sexo");  
        return;
    }


    if (email.value === "" || !validaEmail(email.value)) {
        alert("Por favor, preencha com um e-mail válido.");
        return;
    }

    if (telefone.value === "" || !validaDigitoTelefone(telefone.value, 15)) {
        alert("O telefone deve conter 11 dígitos, incluindo o DDD.");
        return;
    }

    if(comprovanteDeIdentidade.value === ""){
        alert("Por favor, anexe o documento de identidade");
        return;
    }

    if (cep.value === "" || !validaCep(cep.value, 9)) {
        alert("O Cep deve conter 8 dígitos");
        return;
    }

    if (rua.value === "") {
        alert("Por favor, preencha com o nome da sua rua");
        return;
    }

    if (numeroCasa.value === "") {
        alert("Por favor, preencha com o número da sua casa");
        return;
    }

    if(comprovanteDeResidencia.value === ""){
        alert("Por favor, anexe o comprovante de Residência ");
        return ;
    }
   
    if(senhalogin.value === ""){
        alert("Por favor, crie uma senha");
        return ; 
    }

    if (senhalogin.value === "" || !validarSenha(senhalogin.value, 8)) {
        alert("Por favor, preencha com sua senha, a senha deve conter pelo menos 8 caracteres");
        return;
    }

    if (!senhaForte(senhalogin.value)) {
        return; 
    }

    const file1 = comprovanteDeIdentidade.files[0];
    const file2 = comprovanteDeResidencia.files[0];

    if (!file1 || !file2) {
        alert("Por favor, anexe ambos os documentos.");
        return;
    }

    if (valido) {
        try {
            await saveFile();

            let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');

            listaUser.push({
                nome: nome.value,
                dataDeNascimento: data.value,
                CPF: cpf.value,
                sexo: sexo.value,
                email: email.value,
                telefone: telefone.value,
                CEP: cep.value,
                rua: rua.value,
                numero: numeroCasa.value,
                cidade: cidade.value,
                Estado: estado.value,
                senha: senhalogin.value,
                identidade: localStorage.getItem('pdf1_identidade'),
                residencia: localStorage.getItem('pdf2_residencia')
            });

            localStorage.setItem("listaUser", JSON.stringify(listaUser));

            alert('Inscrição realizada com sucesso!');
            setTimeout(() => {
                window.location.href = "login.html";
            }, 500);
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            alert("Ocorreu um erro ao salvar seus dados. Tente novamente.");
        }
    }

});

function saveFile() {
    return new Promise((resolve, reject) => {
        const file1 = comprovanteDeIdentidade.files[0];
        const file2 = comprovanteDeResidencia.files[0];

        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = function(e) {
            const pdf1Base64 = e.target.result;
            localStorage.setItem('pdf1', pdf1Base64);
            localStorage.setItem('pdf1_identidade', file1.name);

            reader2.onload = function(e) {
                const pdf2Base64 = e.target.result;
                localStorage.setItem('pdf2', pdf2Base64);
                localStorage.setItem('pdf2_residencia', file2.name);
                resolve(); // Sucesso
            };

            reader2.onerror = () => reject(new Error("Falha ao ler comprovante de residência"));
            reader2.readAsDataURL(file2);
        };

        reader1.onerror = () => reject(new Error("Falha ao ler comprovante de identidade"));
        reader1.readAsDataURL(file1);
    });
}

function validaEmail(email) {
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validaDigitosCpf(cpf, cpfdigitoscpf) {
    return cpf.length === cpfdigitoscpf;
}

function validaDigitoTelefone(telefone, digitostelefonecomdd) {
    return telefone.length === digitostelefonecomdd;
}

function validaCep(cep, digitoscep) {
    return cep.length === digitoscep;
}

function validarSenha(senha, digitossenha) {
    return senha.length >= digitossenha;
}

function buscarCep(cep) {
    fetch('https://viacep.com.br/ws/' + cep + '/json/')
        .then(response => {
            if (!response.ok) {
                alert('ERRO DE CONEXÃO');
                return;
            }
            return response.json();
        })
        .then(data => {
            rua.value = data.logradouro;
            cidade.value = data.localidade;
            estado.value = data.uf;
        });
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



