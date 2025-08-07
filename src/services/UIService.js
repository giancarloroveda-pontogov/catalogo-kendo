import ValidationError from "../Errors/ValidationError.js";

export default class UIService {
	static showError(error) {
		if (error instanceof ValidationError) {
			this.#showValidationError(error);
		} else {
			this.#showGenericError(error);
		}
	}

	static #showValidationError(error) {
		const title = "Erro de Validação";
		const content = `
			<div style="color: #a94442; background-color: #f2dede; border: 1px solid #ebccd1; border-radius: 4px; padding: 10px;">
				<strong>${error.message}</strong>
				<ul style="margin-top: 10px; padding-left: 20px;">
					${error.errors.map(e => `
						<li><strong>${e.campo}</strong>: ${e.mensagem}</li>
					`).join("")}
				</ul>
			</div>
		`;
		this.#renderAlert(title, content, "Entendi");
	}

	static #showGenericError(error) {
		const title = "Erro";
		const content = `
			<div style="color: #a94442; background-color: #f2dede; border: 1px solid #ebccd1; border-radius: 4px; padding: 10px;">
				<strong>Ocorreu um erro inesperado:</strong>
				<p>${error?.message || "Erro desconhecido."}</p>
			</div>
		`;
		this.#renderAlert(title, content, "Fechar");
	}

	static #renderAlert(title, content, okText = "OK") {
		let $el = $("#application-global-alert");

		if ($el.length === 0) {
			$("body").append('<div id="application-global-alert"></div>');
			$el = $("#application-global-alert");
		}

		const existing = $el.data("kendoAlert");
		if (existing) {
			existing.destroy();
			$el.empty();
		}

		$el.kendoAlert({
			title,
			content,
			messages: {
				okText
			},
			close: () => $el.remove()
		}).data("kendoAlert").open();
	}
}
