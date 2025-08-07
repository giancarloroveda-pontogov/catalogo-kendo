export default class ProdutoPreview {
	render({ parentElement, observer }) {
		if (parentElement.length < 0) {
			return false;
		}

		parentElement.load("./components/produto-preview/produto-preview.html", () => {
			this.#renderPreviewInputs();

			observer.subscribeExecuting((produto) => this.refreshProduto(produto));
		});
	}

	refreshProduto(produto) {
		$("#preview #nome").val(produto?.nome || "");
		$("#preview #categoria").val(produto?.categoria || "");
		$("#preview #preco").data("kendoNumericTextBox").value(produto?.preco || "");
		$("#preview #data_cadastro").data("kendoTextBox").value(
			(produto?.data_cadastro && new Date(produto?.data_cadastro).toLocaleDateString()) || "");
		$("#preview #ativo").data("kendoSwitch").check(produto?.ativo || false)
	}

	#renderPreviewInputs() {
		$("#nome").kendoTextBox({
			label: "Nome",
			enable: false
		});

		$("#categoria").kendoTextBox({
			enable: false
		})

		$("#preco").kendoNumericTextBox({
			format: "c2",
			spinners: false,
			decimals: 2,
			label: "Preço",
			enable: false,
		})

		$("#data_cadastro").kendoTextBox({
			enable: false,
		});

		$("#ativo").kendoSwitch({
			enabled: false
		});
	}
}