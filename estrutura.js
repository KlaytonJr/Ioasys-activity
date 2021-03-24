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
    
    // calcular valor final (desconto para novos clientes OU cupom)
    fecharCompra() {
        let valorFinal = this.valorTotal;
        // 20% de desconto para novos clientes
        if(this.novoCliente) { 
            valorFinal -= (this.valorTotal * (20/100));
        // desconto de XX% do cupom 
        } else if(this.cupom) {
            valorFinal -= (this.valorTotal * (this.cupom/100))
        // 5% de desconto para compras acima de 100 reais
        } else {
            if(this.valorTotal >= 100 && !this.cupom){
                valorFinal -= (this.valorTotal * (5/100))
            }
        }

        this.valorTotal = valorFinal.toFixed(2);
        return this.valorTotal;
    }
}

function Produto(codigo, nome, preco){
    this.codigo = codigo;
    this.nome = nome;
    this.preco = preco;
}

const meuCarrinho = new CarrinhoDeCompras('Klayton', new Date(), false)

meuCarrinho.adicionarProduto({codigo: 01, nome: "Camisa Polo Halph Lauren", preco: 250.00}, 1)

meuCarrinho.adicionarProduto(new Produto(02, "Calça Calvin Klein", 376.90), 1)

// adicionar uma lista 
const meusItens = [
    {produto: new Produto (03, "meia Tommy Hilfiger", 63.00), quantidade:  1},
    {produto: new Produto (04, "Bermuda Levis", 95.00), quantidade:  1},
    {produto: new Produto (05, "Boné Supreme", 550.00), quantidade:  1},
    {produto: new Produto (06, "Tênis Nike", 390.00), quantidade: 1},
    {produto: new Produto (07, "Tênis Yeezy", 1500.00), quantidade:  1}
]

meuCarrinho.adicionarProdutos(meusItens);

meuCarrinho.adicionarProdutos([
    {produto: new Produto(08, "Camiseta Supreme", 700.00), quantidade: 1},
    {produto: new Produto (09, "Relogio Rolex", 5000.00), quantidade: 1},
])

meuCarrinho.adicionarCupom('camp50')

function resumoDaCompra(carrinho) {

    const dataFormatada = `${carrinho.data.getDate()}/${carrinho.data.getMonth()+1}/${carrinho.data.getFullYear()}` 

    let geral = `O cliente: ${carrinho.cliente} efetuou a compra no dia ${dataFormatada} dos seguintes itens:
    ${carrinho.listaDeProdutos}`

    return (metodoDePagamento, parcelas) => {
        carrinho.fecharCompra();
        let pagamento = Number(carrinho.valorTotal);

        if (metodoDePagamento === 'Cartão de Crédito'){
            switch(parcelas){
                case 1:
                    pagamento /= parcelas;
                    break;
                case 2:
                    pagamento /= parcelas;
                    break;
                case 3:
                    pagamento /= parcelas;
                    break;
            }
        } else {
            pagamento = Number(carrinho.valorTotal);
            parcelas = 1;
        }

        if (!carrinho.cupom && pagamento < 100 && carrinho.novoCliente === false){
            carrinho.cupom = 'Não há cupom aplicado';
        } else if (!carrinho.cupom && pagamento > 100 && carrinho.novoCliente === false) {
            carrinho.cupom = "5"
        } else if (carrinho.novoCliente === true) {
            carrinho.cupom = "20"
        }

        return `${geral}\n\nTotal de itens: ${carrinho.totalDeItens}\n\nMétodo de pagamento: ${metodoDePagamento}\nCupom aplicado de ${carrinho.cupom}%\n\nValor total com desconto: R$ ${carrinho.valorTotal} em ${parcelas}x de R$ ${pagamento.toFixed(2)}`;
    }
}

console.log(resumoDaCompra(meuCarrinho)('Cartão de Crédito', 3))