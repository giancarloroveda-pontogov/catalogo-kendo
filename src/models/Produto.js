import ValidationError from "../Errors/ValidationError.js";
import LocalStorage from "../utils/LocalStorage.js";
import { PRODUTOS_STORAGE_KEY } from "../consts.js";

export default class Produto {
	#id;
	#nome;
	#categoria;
	#preco;
	#data_cadastro;
	#ativo;

	validationErrors = [];

	constructor({
		id,
		nome,
		categoria,
		preco,
		data_cadastro,
		ativo
	}, options = {
		skipValidation: false
	}) {
		this.id = Number(id)
		this.nome = nome;
		this.categoria = categoria;
		this.preco = preco;
		this.data_cadastro = data_cadastro;
		this.ativo = ativo;

		if (this.validationErrors.length && !options.skipValidation) {
			throw new ValidationError("Produto inválido", this.validationErrors)
		}
	}

	persist() {
		if (!this.id) {
			return this.#insert();
		}

		return this.#update();
	}

	#insert() {
		const produtos = Produto.getAll();
		this.id = new Date().getTime();
		produtos.push(this);
		LocalStorage.set(PRODUTOS_STORAGE_KEY, produtos.map(p => p.data));
	}

	#update() {
		const produtos = Produto.getAll();
		const index = produtos.findIndex((p) => p.id === this.id);
		produtos[index] = this;
		LocalStorage.set(PRODUTOS_STORAGE_KEY, produtos.map(p => p.data));
	}

	static getAll() {
		return Produto.getAllRaw()
			.map((p) => new Produto(p, { skipValidation: true }));
	}

	static getAllRaw() {
		return LocalStorage.get(PRODUTOS_STORAGE_KEY) || [];
	}

	static getById(id) {
		return this.getAll().find((p) => p.id === id);
	}

	static delete(id) {
		const produtos = this.getAll();
		const index = produtos.findIndex((p) => p.id === id);

		if (index === -1) return false;

		const produtoRemovido = produtos.splice(index, 1);

		LocalStorage.set(
			PRODUTOS_STORAGE_KEY,
			produtos.map(p => p.data)
		);

		return produtoRemovido;
	}

	get data() {
		return {
			id: this.id,
			nome: this.nome,
			categoria: this.categoria,
			preco: this.preco,
			data_cadastro: this.data_cadastro,
			ativo: this.ativo
		}
	}

	get id() {
		return this.#id;
	}

	set id(value) {
		this.#id = value;
	}


	get nome() {
		return this.#nome;
	}

	set nome(value) {
		if (!value) {
			this.validationErrors.push({
				campo: "nome",
				mensagem: "Campo 'nome' é obrigatório para o Produto!"
			});
		}

		if (Produto.getAllRaw().some((p) => Number(p.id) !== Number(this.id) && p.nome?.toLowerCase() === value.toLowerCase())) {
			this.validationErrors.push({
				campo: "nome",
				mensagem: "Ja existe um Produto com o nome informado: '" + value + "'!"
			});
		}

		this.#nome = value;
	}

	get categoria() {
		return this.#categoria;
	}

	set categoria(value) {
		if (!value) {
			this.validationErrors.push({
				campo: "categoria",
				mensagem: "Campo 'categoria' é obrigatório para o Produto!"
			});
		}

		this.#categoria = value;
	}

	get preco() {
		return this.#preco;
	}

	set preco(value) {
		if (value < 0) {
			this.validationErrors.push({
				campo: "preco",
				mensagem: "O valor mínimo para 'preço' do Produto é: 0!"
			});
		}

		this.#preco = value;
	}

	get data_cadastro() {
		return this.#data_cadastro;
	}

	set data_cadastro(value) {
		this.#data_cadastro = value;
	}

	get ativo() {
		return this.#ativo;
	}

	set ativo(value) {
		this.#ativo = value;
	}
}