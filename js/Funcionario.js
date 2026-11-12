/**
 * Exercício 1 – Classe Funcionario
 * Atributos privados, construtor, métodos de acesso (get/set) e toString().
 */
class Funcionario {
  // Atributos privados
  #id;
  #nome;
  #idade;
  #cargo;
  #salario;

  static #proximoId = 1;

  constructor(nome, idade, cargo, salario) {
    this.#id = Funcionario.#proximoId++;
    this.nome = nome;       // usa os setters (com validação)
    this.idade = idade;
    this.cargo = cargo;
    this.salario = salario;
  }

  // ---------- Getters ----------
  get id()      { return this.#id; }
  get nome()    { return this.#nome; }
  get idade()   { return this.#idade; }
  get cargo()   { return this.#cargo; }
  get salario() { return this.#salario; }

  // ---------- Setters (com validação) ----------
  set nome(valor) {
    const v = String(valor ?? '').trim();
    if (!v) throw new Error('Nome é obrigatório.');
    this.#nome = v;
  }

  set idade(valor) {
    const v = Number(valor);
    if (!Number.isInteger(v) || v < 14 || v > 120) {
      throw new Error('Idade deve ser um número inteiro entre 14 e 120.');
    }
    this.#idade = v;
  }

  set cargo(valor) {
    const v = String(valor ?? '').trim();
    if (!v) throw new Error('Cargo é obrigatório.');
    this.#cargo = v;
  }

  set salario(valor) {
    const v = Number(valor);
    if (!Number.isFinite(v) || v < 0) {
      throw new Error('Salário deve ser um número maior ou igual a zero.');
    }
    this.#salario = v;
  }

  /** Atualiza vários atributos de uma vez, reaproveitando os setters. */
  atualizar({ nome, idade, cargo, salario }) {
    this.nome = nome;
    this.idade = idade;
    this.cargo = cargo;
    this.salario = salario;
  }

  /** Salário formatado em Real (R$). */
  salarioFormatado() {
    return Funcionario.formatarMoeda(this.#salario);
  }

  static formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  toString() {
    return `#${this.#id} - ${this.#nome}, ${this.#idade} anos, ${this.#cargo}, ${this.salarioFormatado()}`;
  }
}
