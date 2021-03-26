class CarrinhoDeCompras {

    constructor(cliente, data, novoCliente) {
        this.cliente = cliente;
        this.novoCliente = novoCliente;
        this.data = data;
        this.itens = [];
        this.valorTotal = 0;
        this.cupom = null;
    }
    
    // adicionar produtos
    adicionarProduto(produto, quantidade) {
       this.itens.push({produto, quantidade});
       this.calcularValorTotal();
    }

    // recebe um array de objetos com um produto e a sua respectiva quantidade
    adicionarProdutos(lista) {
        this.itens.push(...lista); //spread
        this.calcularValorTotal();
    }
    
    // recalcular valor total para novos produtos adicionados (usar concatenação de operadores)
    calcularValorTotal() {
        let valorTotal = 0;

        for(const item of this.itens){
            valorTotal += item.quantidade * item.produto.preco;
        }

        this.valorTotal = valorTotal;
    }
    
    // adicionar cupom de desconto
    adicionarCupom(codigo) {
        let cupom = codigo;

        cupom = cupom.split("camp");
        cupom = cupom[1];

        this.cupom = cupom;
        return cupom;
    }
    
    // calcular quantidade de itens totais 
    get totalDeItens() {
        let itensTotal = 0;

        for(let item of this.itens){
            itensTotal += item.quantidade;
        }

        return itensTotal;
    }

    // listar produtos
    get listaDeProdutos() {
        let lista = '';

        for(let item of this.itens){
            lista += `\n\t${item.quantidade}x ${item.produto.nome}  R$ ${item.produto.preco * item.quantidade}`
        }

        return lista;
    }
}

function Produto(nome, preco){
    this.nome = nome;
    this.preco = preco;
}

let cart = new CarrinhoDeCompras("Klayton", new Date(), false);

function clicaMe(e) {

    let pai = e.target.closest("li");

    let filhoNome = pai.querySelector(".container > .texts > h1").innerHTML;
    let filhoPreco = pai.querySelector(".container > .price > h2").innerHTML;

    let quantidade = 1
    let check = false;

    for (let item in cart.itens) {
        console.log(cart.itens[item].produto.nome);

        if (cart.itens[item].produto.nome === filhoNome) {
            check = true;
            cart.itens[item].quantidade++;
            cart.calcularValorTotal();
        }
    }

    if (!check) {
        cart.adicionarProduto(new Produto(filhoNome, parseFloat(filhoPreco)), quantidade)
    }

    salvarListaCompra(cart.itens)

    return cart;
}

// Localhost
function salvarListaCompra(lista) {
    const listaJSON = JSON.stringify([lista])
    localStorage.setItem('listaLocal', listaJSON)
}
function adicionaListaSalva() {
    const listaLocal = localStorage.getItem("listaLocal")

    const listaItens = JSON.parse(listaLocal)

    preencherDados(listaItens)
}

cart.itens[adicionaListaSalva()]

function preencherDados(lista) {
    const tableData = lista;
    let quantidadeTotal = 0;
    let valorTotalCompra = 0;

    // Preencher Tabela
    const table = document.querySelector("table")
    
    for (let item in tableData[0]){
        let tr = document.createElement('tr');
        const name = document.createElement('td');
        name.innerHTML = `${lista[0][item].produto.nome}`
        const qtd = document.createElement('td');
        qtd.innerHTML = `${lista[0][item].quantidade}`
        const price = document.createElement('td');
        price.innerHTML = `R$ ${lista[0][item].produto.preco}`

        quantidadeTotal += lista[0][item].quantidade;
        valorTotalCompra += lista[0][item].produto.preco * lista[0][item].quantidade;

        tr.appendChild(name);
        tr.appendChild(qtd);
        tr.appendChild(price);

        console.log(item);
        console.log(lista[0][item]);
        console.log(lista[0][item].produto.nome);
        console.log(lista[0][item].produto.preco);
        console.log(lista[0][item].quantidade);

        table.appendChild(tr);
    }
    
    // Preencher Pagamento
    const qtdTotal = document.querySelector("#qtd-total");
    const totalPrice = document.querySelector("#total-price");
    const finalPrice = document.querySelector("#final-price");

    const btnCupom = document.querySelector(".btn-cupom");
    
    qtdTotal.innerHTML += `${quantidadeTotal}`
    totalPrice.innerHTML += `R$ ${valorTotalCompra}`
    finalPrice.innerHTML += `R$ ${valorTotalCompra}`

    btnCupom.addEventListener("click", (e) => {
        const input = document.querySelector("#buy-cupom").value;

        const cupom = cart.adicionarCupom(input);
        const valorFinalizado = fecharCompra(valorTotalCompra, cupom);
        finalPrice.innerHTML = `Preço final: R$ ${valorFinalizado}`
    })
}

const payment = document.querySelector(".payment-btn");

payment.addEventListener("click", () => {
    alert("Obrigado por testar meu projeto de ecommerce, não se esqueça de se conectar comigo no Github e LinkedIn!")
})

function fecharCompra(valorTotal, cupom,) {
    let valorFinal = valorTotal;
    
    if(cupom) {
        valorFinal -= (valorTotal * (cupom/100))
    // 5% de desconto para compras acima de 100 reais
    } else {
        if(valorTotal >= 100 && !cupom){
            valorFinal -= (valorTotal * (5/100))
        }
    }

    valorFinal = valorFinal.toFixed(2);
    return valorFinal;
}