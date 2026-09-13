const cep = document.querySelector("#cep");

cep.addEventListener("blur", () => {
    fetch(`https://viacep.com.br/ws/${cep.value}/json/`)
        .then(resposta => resposta.json())
        .then(dados => {
            document.querySelector("#rua").value = dados.logradouro;
            document.querySelector("#bairro").value = dados.bairro;
            document.querySelector("#cidade").value = dados.localidade;
            document.querySelector("#estado").value = dados.uf;
        });
});