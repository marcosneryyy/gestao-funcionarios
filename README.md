# Sistema de Gestão de Funcionários

Aplicação web (HTML + CSS + JavaScript puro) para cadastrar, listar, editar, excluir
e gerar relatórios de funcionários de uma startup de tecnologia.

## Estrutura

```
├── index.html            # Interface (formulário, tabela e relatórios)
├── css/style.css         # Estilos
├── js/Funcionario.js     # Classe Funcionario (Exercício 1)
├── js/app.js             # Lógica da aplicação (Exercícios 1 a 4)
├── Dockerfile            # Imagem nginx com a aplicação
├── docker-compose.yml    # Ambiente de desenvolvimento com volume
└── .devcontainer/        # Dev Container para VS Code
```

## Como executar com Docker

Pré-requisito: [Docker](https://www.docker.com/) instalado.

```bash
docker compose up --build
```

Acesse **http://localhost:8080**. Como o código é montado como volume, basta salvar
um arquivo e recarregar a página para ver a alteração.

Para parar:

```bash
docker compose down
```

### Alternativa: Dev Container (VS Code)

Abra a pasta no VS Code com a extensão *Dev Containers* e escolha
**"Reopen in Container"**. O servidor sobe automaticamente na porta 8080.

## Exercícios

### Exercício 1 – Cadastro e listagem
- Formulário com Nome, Idade, Cargo e Salário.
- Classe `Funcionario` (`js/Funcionario.js`) com atributos privados (`#nome`, `#idade`…),
  construtor, getters/setters com validação e `toString()`.
- Os funcionários ficam no array `funcionarios` e são exibidos em uma `<table>`.

### Exercício 2 – Excluir e alterar
- Cada linha tem os botões **Editar** e **Excluir**, ligados por `onclick` com funções anônimas.
- **Editar** carrega os dados no formulário; ao salvar, o método `atualizar()` da classe
  usa os setters para alterar os atributos.

### Exercício 3 – Funções anônimas e lambdas
- Manipulação do array com arrow functions: `buscarPorId`, `buscarPorNome`,
  `adicionarFuncionario`, `removerPorId`, `atualizarPorId`.
- Comparação entre função anônima tradicional e arrow function:

```js
// Função anônima tradicional
btnEditar.onclick = function () {
  carregarParaEdicao(f.id);
};

// Arrow function (lambda)
btnExcluir.onclick = () => excluirFuncionario(f.id);

// No array
funcionarios.map(function (f) { return f.salario * 2; }); // tradicional
funcionarios.map((f) => f.salario * 2);                   // lambda
```

### Exercício 4 – Relatórios (map, filter, reduce, Set)

```js
const relatorios = {
  salarioAcima5000: () => funcionarios.filter((f) => f.salario > 5000),
  mediaSalarial:    () => funcionarios.reduce((s, f) => s + f.salario, 0) / funcionarios.length,
  cargosUnicos:     () => [...new Set(funcionarios.map((f) => f.cargo))],
  nomesMaiusculo:   () => funcionarios.map((f) => f.nome.toUpperCase()),
};
```

Os relatórios são atualizados automaticamente a cada cadastro, edição ou exclusão.

## Publicando no GitHub

```bash
git remote add origin https://github.com/<seu-usuario>/gestao-funcionarios.git
git branch -M main
git push -u origin main
```
