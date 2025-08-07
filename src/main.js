import configureCulture from "./config/culture.js";
import CatalogoProdutosView from "./views/catalogo-produtos/catalogo-produtos.js";

(function () {
  configureCulture();

  const catalogoProdutosView = new CatalogoProdutosView();

  catalogoProdutosView.render();
})()