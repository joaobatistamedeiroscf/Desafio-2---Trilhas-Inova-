
let form  =  document.getElementById("form");
let nome  =  document.getElementById("nome");
let data =  document.getElementById("data");
let cpf =  document.getElementById("cpf");
let email = document.getElementById("email");
let telefone = document.getElementById("phone");
let cep = document.getElementById("cep");
let rua = document.getElementById("rua");
let numeroCasa = document.getElementById("numero-casa");
let cidade = document.getElementById("cidade");
let estado = document.getElementById("estado");
let comprovanteDeIdentidade = document.getElementById("identidade");
let comprovanteDeResidencia = document.getElementById("residencia");
let senhalogin =  document.getElementById("senhalogin");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (nome.value === "") {
        alert("Por favor, preencha o seu nome.");
        return;
    }

    if(data.value ===""){
        alert("Por favor , preencha com sua data de nascimento");
        return;
    }

    if (cpf.value ==="" || !validaDigitosCpf(cpf.value, 14)) {
        alert("Por favor , preencha corretamente ,o CPF deve conter 11 dígitos.");
        return;
    }

    if(sexo === ""){
        alert("Por favor , preencha com o seu sexo");
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

    if(cep.value === "" ||!validaCep(cep.value,9)){
        alert("O cep deve conter 8 dígitos");
        return;
    }

    if(rua.value === ""){
        alert("Por favor, preencha com o nome da sua rua");
        return;
    }

    if(numeroCasa.value === ""){
        alert("Por favor, preencha com o número da sua casa");
        return;
    }

    if(cidade.value === ""){
        alert("Por favor , preencha com o nome da sua cidade");
        return ; 

    }

    if(estado.value === ""){
        alert("Por favor , preencha com o nome do seu estado (MA)");
        return;
    }
    
    if(comprovanteDeIdentidade.value === ""){
        alert("Por favor , anexe o documento de identidade");
        return;
    }

    if(comprovanteDeResidencia.value === ""){
        alert("Por favor , anexe o comprovante de Residência ");
        return ;
    }
   
    if(senhalogin.value === ""){
        alert("Por favor , preencha com sua senha");
        return ; 
    }


    alert("Formulário de inscrição enviado!!!");
    
    form.submit();
   
});

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

function validaCep(cep,digitoscep) {
    return cep.length === digitoscep  ;
}

function buscarCep(cep){
    fetch('https://viacep.com.br/ws/'+cep+'/json/')
    .then(response => {
        if(!response.ok){
            alert('ERRO DE CONEXÃO')
        }
        return response.json()
    })
    .then(data =>{
        rua.value = data.logradouro
        cidade.value = data.localidade
        estado.value = data.uf
    })
}

