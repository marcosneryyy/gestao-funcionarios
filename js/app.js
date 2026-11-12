/**
 * Sistema de Gestão de Funcionários
 * Exercícios 1 a 4: cadastro, listagem, edição, exclusão e relatórios.
 */

// ===================================================================
// Estado da aplicação
// ===================================================================
const funcionarios = [];   // array de objetos da classe Funcionario
let idEmEdicao = null;     // id do funcionário sendo editado (null = cadastro)

// ===================================================================
// Elementos do DOM
// ===================================================================
const form         = document.getElementById('form-funcionario');
const inputNome    = document.getElementById('nome');
const inputIdade   = document.getElementById('idade');
const inputCargo   = document.getElementById('cargo');
const inputSalario = document.getElementById('salario');
const btnSalvar    = document.getElementById('btn-salvar');
const btnCancelar  = document.getElementById('btn-cancelar');
const tituloForm   = document.getElementById('titulo-form');
const mensagem     = document.getElementById('mensagem');
const corpoTabela  = document.getElementById('corpo-tabela');
const inputBusca   = document.getElementById('busca');

// ===================================================================
// Exercício 3 – Funções lambda (arrow functions) para manipular o array
// ===================================================================

// Busca por ID
const buscarPorId = (id) => funcionarios.find((f) => f.id === id);

// Busca por nome (parcial, sem diferenciar maiúsculas/minúsculas)
const buscarPorNome = (termo) =>
  funcionarios.filter((f) => f.nome.toLowerCase().includes(termo.trim().toLowerCase()));

// Adiciona um novo funcionário
const adicionarFuncionario = (dados) => {
  const novo = new Funcionario(dados.nome, dados.idade, dados.cargo, dados.salario);
  funcionarios.push(novo);
  return novo;
};

// Remove pelo ID (retorna true se removeu)
const removerPorId = (id) => {
  const indice = funcionarios.findIndex((f) => f.id === id);
  if (indice === -1) return false;
  funcionarios.splice(indice, 1);
  return true;
};

// Atualiza pelo ID usando o método da classe Funcionario
const atualizarPorId = (id, dados) => {
  const funcionario = buscarPorId(id);
  if (!funcionario) throw new Error('Funcionário não encontrado.');
  funcionario.atualizar(dados);
  return funcionario;
};

// ===================================================================
// Exercício 3 – Comparação: função anônima tradicional x arrow function
// ===================================================================
//
// Função anônima tradicional:
//   const dobrarSalariosTradicional = funcionarios.map(function (f) {
//     return f.salario * 2;
//   });
//
// Mesma lógica com arrow function (lambda):
//   const dobrarSalariosLambda = funcionarios.map((f) => f.salario * 2);
//
// A arrow function é mais curta, tem retorno implícito quando é uma
// única expressão e não cria seu próprio "this".

// ===================================================================
// Exercício 4 – Relatórios com map, filter, reduce e Set
// ===================================================================
const relatorios = {
  // Funcionários com salário maior que R$ 5000
  salarioAcima5000: () => funcionarios.filter((f) => f.salario > 5000),

  // Média salarial
  mediaSalarial: () =>
    funcionarios.length === 0
      ? 0
      : funcionarios.reduce((soma, f) => soma + f.salario, 0) / funcionarios.length,

  // Cargos únicos (sem repetição)
  cargosUnicos: () => [...new Set(funcionarios.map((f) => f.cargo))],

  // Nomes em maiúsculo
  nomesMaiusculo: () => funcionarios.map((f) => f.nome.toUpperCase()),
};

// ===================================================================
// Utilitários de interface
// ===================================================================
const lerFormulario = () => ({
  nome: inputNome.value,
  idade: inputIdade.value,
  cargo: inputCargo.value,
  salario: inputSalario.value,
});

const mostrarMensagem = (texto, tipo = 'sucesso') => {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  clearTimeout(mostrarMensagem.timer);
  mostrarMensagem.timer = setTimeout(() => {
    mensagem.textContent = '';
    mensagem.className = 'mensagem';
  }, 3500);
};

const limparFormulario = () => {
  form.reset();
  idEmEdicao = null;
  tituloForm.textContent = 'Cadastrar funcionário';
  btnSalvar.textContent = 'Cadastrar';
  btnCancelar.hidden = true;
  inputNome.focus();
};

// Cria uma célula de texto (textContent evita injeção de HTML)
const celula = (texto) => {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
};

// ===================================================================
// Exercício 1 e 2 – Renderização da tabela
// ===================================================================
const renderizarTabela = () => {
  const termo = inputBusca.value;
  const lista = termo ? buscarPorNome(termo) : funcionarios;

  corpoTabela.innerHTML = '';

  if (lista.length === 0) {
    const tr = document.createElement('tr');
    const td = celula(funcionarios.length === 0
      ? 'Nenhum funcionário cadastrado.'
      : 'Nenhum funcionário encontrado para a busca.');
    td.colSpan = 6;
    td.className = 'vazio';
    tr.appendChild(td);
    corpoTabela.appendChild(tr);
  }

  lista.forEach((f) => {
    const tr = document.createElement('tr');
    if (f.id === idEmEdicao) tr.className = 'em-edicao';
    tr.title = f.toString();

    tr.appendChild(celula(f.id));
    tr.appendChild(celula(f.nome));
    tr.appendChild(celula(f.idade));
    tr.appendChild(celula(f.cargo));
    const tdSalario = celula(f.salarioFormatado());
    tdSalario.className = 'num';
    tr.appendChild(tdSalario);

    const tdAcoes = document.createElement('td');
    tdAcoes.className = 'acoes';

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.textContent = 'Editar';
    btnEditar.className = 'btn btn-secundario';
    // Exercício 2 – onclick com função anônima
    btnEditar.onclick = function () {
      carregarParaEdicao(f.id);
    };

    const btnExcluir = document.createElement('button');
    btnExcluir.type = 'button';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.className = 'btn btn-perigo';
    // Exercício 3 – a mesma ideia refatorada para arrow function
    btnExcluir.onclick = () => excluirFuncionario(f.id);

    tdAcoes.append(btnEditar, btnExcluir);
    tr.appendChild(tdAcoes);
    corpoTabela.appendChild(tr);
  });

  document.getElementById('total').textContent = funcionarios.length;
  renderizarRelatorios();
};

// ===================================================================
// Exercício 4 – Renderização dos relatórios
// ===================================================================
const preencherLista = (ul, itens, vazio) => {
  ul.innerHTML = '';
  if (itens.length === 0) {
    const li = document.createElement('li');
    li.textContent = vazio;
    li.className = 'vazio';
    ul.appendChild(li);
    return;
  }
  itens.forEach((texto) => {
    const li = document.createElement('li');
    li.textContent = texto;
    ul.appendChild(li);
  });
};

const renderizarRelatorios = () => {
  preencherLista(
    document.getElementById('rel-acima-5000'),
    relatorios.salarioAcima5000().map((f) => `${f.nome} — ${f.salarioFormatado()}`),
    'Nenhum funcionário com salário acima de R$ 5.000,00.'
  );

  document.getElementById('rel-media').textContent =
    Funcionario.formatarMoeda(relatorios.mediaSalarial());

  preencherLista(
    document.getElementById('rel-cargos'),
    relatorios.cargosUnicos(),
    'Nenhum cargo cadastrado.'
  );

  preencherLista(
    document.getElementById('rel-nomes'),
    relatorios.nomesMaiusculo(),
    'Nenhum nome cadastrado.'
  );
};

// ===================================================================
// Exercício 2 – Editar e excluir
// ===================================================================
const carregarParaEdicao = (id) => {
  const f = buscarPorId(id);
  if (!f) return;

  idEmEdicao = id;
  inputNome.value = f.nome;
  inputIdade.value = f.idade;
  inputCargo.value = f.cargo;
  inputSalario.value = f.salario;

  tituloForm.textContent = `Editando funcionário #${f.id}`;
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.hidden = false;
  inputNome.focus();
  renderizarTabela();
};

const excluirFuncionario = (id) => {
  const f = buscarPorId(id);
  if (!f) return;
  if (!confirm(`Excluir o funcionário "${f.nome}"?`)) return;

  removerPorId(id);
  if (idEmEdicao === id) limparFormulario();
  mostrarMensagem(`Funcionário "${f.nome}" excluído.`);
  renderizarTabela();
};

// ===================================================================
// Eventos
// ===================================================================

// Cadastro / atualização – evento com função anônima tradicional
form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  try {
    const dados = lerFormulario();
    if (idEmEdicao === null) {
      const novo = adicionarFuncionario(dados);
      mostrarMensagem(`Funcionário "${novo.nome}" cadastrado.`);
    } else {
      const atualizado = atualizarPorId(idEmEdicao, dados);
      mostrarMensagem(`Funcionário "${atualizado.nome}" atualizado.`);
    }
    limparFormulario();
    renderizarTabela();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
});

// Cancelar edição – arrow function
btnCancelar.addEventListener('click', () => {
  limparFormulario();
  renderizarTabela();
});

// Busca por nome em tempo real – arrow function
inputBusca.addEventListener('input', () => renderizarTabela());

// Dados de exemplo
document.getElementById('btn-exemplos').addEventListener('click', () => {
  [
    { nome: 'Ana Souza',      idade: 29, cargo: 'Desenvolvedora',  salario: 7200 },
    { nome: 'Bruno Lima',     idade: 34, cargo: 'Designer',        salario: 4800 },
    { nome: 'Carla Mendes',   idade: 41, cargo: 'Gerente de Projetos', salario: 11500 },
    { nome: 'Diego Santos',   idade: 23, cargo: 'Desenvolvedor',   salario: 3900 },
    { nome: 'Eduarda Rocha',  idade: 27, cargo: 'Designer',        salario: 5100 },
  ].forEach((d) => adicionarFuncionario(d));
  mostrarMensagem('Dados de exemplo adicionados.');
  renderizarTabela();
});

// Inicialização
renderizarTabela();
