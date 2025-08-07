import ProdutoPreview from "../../components/produto-preview/produto-preview.js";
import Observer from "../../pubsub/Observer.js";
import Produto from "../../models/Produto.js"
import UIService from "../../services/UIService.js";

export default class CatalogoProdutosView {
  produtoSelecionadoObserver = new Observer();

  render() {
    $("#app").load("./views/catalogo-produtos/catalogo-produtos.html", () => {
      this.#renderToolBar();

      this.#renderGrid();

      this.#renderFormWindow();

      this.#renderFilters();

      new ProdutoPreview().render({
        parentElement: $("#produto-preview"),
        observer: this.produtoSelecionadoObserver
      })
    });
  }

  #renderFilters() {
    $("#filters #filter_nome").kendoTextBox({
      placeholder: "Nome",
    });

    $("#filters #filter_categoria").kendoDropDownList({
      dataSource: [
        { name: "Roupas" },
        { name: "Calçados" },
        { name: "Acessórios" },
        { name: "Eletrodomésticos" },
        { name: "Móveis" },
        { name: "Ferramentas" },
      ],
      dataTextField: "name",
      dataValueField: "name",
      filter: "contains",
      autoBind: false,

    });

    $("#filters button[type='button']").kendoButton({
      click: () => {
        const filters = {
          nome: $("#filters #filter_nome").data("kendoTextBox").value(),
          categoria: $("#filters #filter_categoria").data("kendoDropDownList").value(),
        }

        const dataSource = $("#produtos-grid").data("kendoGrid").dataSource;
        dataSource.filter({
          logic: "and",
          filters: [
            {
              field: "nome",
              operator: "contains",
              value: filters.nome
            },
            {
              field: "categoria",
              operator: "contains",
              value: filters.categoria
            }
          ]
        });
      }
    })

    $("#filters button[type='reset']").kendoButton({
      click: () => {
        $("#filters #filter_nome").data("kendoTextBox").value("")
        $("#filters #filter_categoria").data("kendoDropDownList").value("")
        $("#filters #filter_categoria").data("kendoDropDownList").select(-1)

        const dataSource = $("#produtos-grid").data("kendoGrid").dataSource;
        dataSource.filter({});
      }
    })
  }

  #renderToolBar() {
    const handleIncluirClick = () => {
      this.#setFormData();
      $("#produto-form-dialog").data("kendoWindow").center().open();
    }

    const handleEditarClick = () => {
      this.#setFormData(this.#getProdutoSelecionado());
      $("#produto-form-dialog").data("kendoWindow").center().open();
    }

    $("#action-bar").kendoToolBar({
      resizable: false,
      items: [
        {
          type: "buttonGroup",
          buttons: [
            {
              type: "button",
              text: "Editar",
              enable: false,
              attributes: {
                id: "editar-btn",
              },
              icon: "pencil",
              click: handleEditarClick
            },
            { type: "button", text: "Incluir", click: handleIncluirClick, icon: "plus" },
          ]
        }
      ]
    })

    this.produtoSelecionadoObserver.subscribe((produto) => {
      const toolBar = $("#action-bar").data("kendoToolBar");
      toolBar.enable($("#editar-btn"), !!produto)
    })
  }

  #renderGrid() {
    const dataSource = new kendo.data.DataSource({
      transport: {
        read: (options) => {
          options.success(Produto.getAll());
        },
      },
      schema: {
        model: {
          id: "id",
          fields: {
            id: { editable: false, nullable: true },
            nome: { type: "string", validation: { required: true } },
            categoria: { type: "string" },
            preco: { type: "number" },
            data_cadastro: { type: "date" },
            ativo: { type: "boolean" }
          }
        },
      },
      pageSize: 5,
    });

    $("#produtos-grid").kendoGrid({
      columns: [
        { field: "nome", title: "Nome" },
        { field: "categoria", title: "Categoria" },
        { field: "preco", title: "Preço", format: "{0:c}" },
        { field: "data_cadastro", title: "Data de Cadastro", format: "{0:dd/MM/yyyy}" },
        { field: "ativo", title: "Ativo", template: "#= ativo ? 'Sim' : 'Não' #" },
      ],
      dataSource,
      selectable: true,
      sortable: true,
      pageable: true,
      toolbar: ["excel", "search"],
      change: () => {
        this.produtoSelecionadoObserver.next(this.#getProdutoSelecionado())
      }
    });
  }

  #getProdutoSelecionado() {
    const grid = $("#produtos-grid").data("kendoGrid");
    const selectedRows = grid.select();
    if (!selectedRows.length) {
      return null;
    }
    return new Produto(grid.dataItem(selectedRows[0]));
  }

  #renderFormWindow() {
    $("#produto-form-dialog").kendoWindow({
      visible: false,
      modal: true,
      draggable: false,
      width: 400,
      title: "Incluir Produto",
      open: () => {
        const formActionsToolBar = $("#form-actions").data("kendoToolBar");
        formActionsToolBar.enable($("#excluir-btn"), $("#produto-form #id").val());
      }
    });

    $("#produto-form #nome").kendoTextBox({
      label: "Nome",
    });

    $("#produto-form #categoria").kendoDropDownList({
      dataSource: [
        { name: "Roupas" },
        { name: "Calçados" },
        { name: "Acessórios" },
        { name: "Eletrodomésticos" },
        { name: "Móveis" },
        { name: "Ferramentas" },
      ],
      dataTextField: "name",
      dataValueField: "name",
      filter: "contains",
      autoBind: false,
    })

    $("#produto-form #preco").kendoNumericTextBox({
      format: "c2",
      spinners: false,
      decimals: 2,
      label: "Preço",
    })

    $("#produto-form #data_cadastro").kendoDatePicker({
      format: "dd/MM/yyyy",
    });
    $("#produto-form #data_cadastro").kendoMaskedTextBox({
      mask: "00/00/0000",
    })

    $("#produto-form #ativo").kendoSwitch();

    const handleGravar = () => {
      const produto = this.#getFormData();
      const dataSource = $("#produtos-grid").data("kendoGrid").dataSource;

      try {
        const produtoInstancia = new Produto(produto);

        produtoInstancia.persist();

        $("#produto-form-dialog").data("kendoWindow").close();
        this.#setFormData();
        dataSource.read();
      } catch (e) {
        UIService.showError(e);
      }
    };

    const handleExcluir = () => {
      const produto = this.#getFormData();
      const dataSource = $("#produtos-grid").data("kendoGrid").dataSource;
      try {
        const result = Produto.delete(Number(produto.id));
        $("#produto-form-dialog").data("kendoWindow").close();
        this.#setFormData();
        dataSource.read();
      } catch (e) {
        UIService.showError(e);
      }
    };

    $("#form-actions").kendoToolBar({
      items: [
        { type: "button", text: "Gravar", icon: "save", click: handleGravar },
        {
          type: "button",
          text: "Excluir",
          icon: "trash",
          enable: false,
          id: "excluir-btn",
          click: handleExcluir
        },
        {
          type: "button",
          text: "Fechar",
          icon: "x",
          click: () => $("#produto-form-dialog").data("kendoWindow").close()
        },
      ],
      rounded: true
    })
  }

  #getFormData() {
    const id = $("#produto-form #id").val();
    const nome = $("#produto-form #nome").data("kendoTextBox").value();
    const categoria = $("#produto-form #categoria").data("kendoDropDownList").value();
    const preco = $("#produto-form #preco").data("kendoNumericTextBox").value();
    const data_cadastro = $("#produto-form #data_cadastro").data("kendoDatePicker").value();
    const ativo = $("#produto-form #ativo").data("kendoSwitch").check();

    return {
      id,
      nome,
      categoria,
      preco,
      data_cadastro,
      ativo
    }
  }

  #setFormData(produto) {
    $("#produto-form #id").val(produto?.id || null);
    $("#produto-form #nome").data("kendoTextBox").value(produto?.nome || "");
    $("#produto-form #categoria").data("kendoDropDownList").value(produto?.categoria || "");
    !produto && $("#produto-form #categoria").data("kendoDropDownList").select(-1);
    $("#produto-form #preco").data("kendoNumericTextBox").value(produto?.preco || "");
    $("#produto-form #data_cadastro").data("kendoDatePicker").value(produto?.data_cadastro || "");
    $("#produto-form #ativo").data("kendoSwitch").check(produto?.ativo || false);
  }
}