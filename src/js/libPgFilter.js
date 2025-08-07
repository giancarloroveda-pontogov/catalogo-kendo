var pgFilter = function(options){

  var vars = {
    formElement : '',
    filterElement : '',
    fields : [],
    filterIndex : 0,
    filterTabIndex : 0
  };

  this.construct = function(options){

    $.extend(vars, options);

    this.CreateElement();

  };

  //---------------------------------------------------------------------------------------------------------------------//
  //Método que Cria os Ítens de Filtros
  //---------------------------------------------------------------------------------------------------------------------//
  this.CreateElement = function() {

    vars.filterIndex = vars.filterIndex+1;

    var objFilter = $("#"+vars.formElement+" #"+vars.filterElement);

    var optField = "";
    $.each(vars.fields, function(idx,rst) {
      optField = optField+'<option pg-type="'+rst.type+'" value="'+rst.name+'">'+rst.label+'</option>';
    });

    var inputField = '<div class="filterItem" id="filterItem'+vars.filterIndex +'" data-value="'+vars.filterIndex +'"style="height: 26px;vertical-align: middle;">'+
                     '  <select id="filterField'+vars.filterIndex+'" data-value="'+vars.filterIndex+'" tabindex="'+ ( ++vars.filterTabIndex ) +'" class="filterField" style="width: 150px;">'+optField+'</select> '+
                     '  <select id="filterOperator'+vars.filterIndex+'" class="filterOperator" tabindex="'+ ( ++vars.filterTabIndex ) +'" style="width: 150px;" ></select>'+
                     '  <span id="filterContent'+vars.filterIndex+'" style="width: auto;"></span> ';

    var btnCleanFilter = '';
    if (vars.filterIndex > 1) {
      inputField = inputField+'<span id="BtnRemover'+vars.filterIndex+'" data-value="'+vars.filterIndex+'" style="cursor: pointer;width: 24px;height: 24px;" title="Remover"></span>';

      // Se nao existe cria o campo
      if ( !($("#"+vars.formElement+" #BtnCleanFilter").length > 0) ) {
        btnCleanFilter = '<span id="BtnCleanFilter" style="cursor: pointer;width: 21px !important;height: 21px !important" title="Limpar Filtros" data-role="button" class="k-button k-button-icon" role="button" aria-disabled="false">'+
                         '<span class="k-sprite k-pg-icon k-i-l1-c6" style="margin: 0 auto;margin-top: 1.4px;"></span></span>';
      }
    }

    inputField = inputField+'</div>';

    objFilter.append(inputField);

    // Cria o botão e o evento para limpar os filtros da tela
    if(btnCleanFilter !== '') {
      $("#"+vars.formElement+" #BtnAddFilter").parent().append(btnCleanFilter);

      $("#"+vars.formElement+" #BtnCleanFilter").click(function() {

        // Valida se deve atualizar a tela
        var blUpdate = false;

        if( getBlUseStateScreen(vars.nameQuery) ) {
          $("#"+vars.formElement+" #"+vars.filterElement+" > div").each(function(idx, objCurrentFilter) {

            // valida para atualizar a tela
            var srtValueCurrentField   = $('#'+vars.formElement+' #filterValue'+objCurrentFilter.dataset.value).val();
            var blHasDataOnField = (srtValueCurrentField != '') && (srtValueCurrentField != undefined);
            if(!blUpdate && blHasDataOnField) {
              blUpdate = !blUpdate;
            }

            // Se não for o primeiro filtro, remove ...
            if( $(this).attr('id') !== 'filterItem1' ) {
              $(this).remove();
            }
            else if(blHasDataOnField) {
              $('#'+vars.formElement+' #filterValue'+objCurrentFilter.dataset.value).val(null);
            }
          });
          
          // Remove o btn clean
          $("#"+vars.formElement+" #BtnCleanFilter").remove();

          setFilterOnScreen(vars.nameQuery, vars.fields, true);

        }
        else {

          $("#"+vars.formElement+" #"+vars.filterElement+" > div").each(function(idx, objCurrentFilter) {

            var srtValueCurrentField   = $('#'+vars.formElement+' #filterValue'+objCurrentFilter.dataset.value).val();
            var blHasDataOnField = (srtValueCurrentField != '') && (srtValueCurrentField != undefined);
            if(!blUpdate && blHasDataOnField) {
              blUpdate = !blUpdate;
            }
            
            // Se não for o primeiro filtro, remove ...
            if( $(this).attr('id') !== 'filterItem1' ) {
              $(this).remove();
            }
            else if(blHasDataOnField) {
              $('#'+vars.formElement+' #filterValue'+objCurrentFilter.dataset.value).val(null);
            }
          });

          // Remove o btn clean
          $("#"+vars.formElement+" #BtnCleanFilter").remove();

          // Faz o resize no grid
          ResizeGridToPreview(vars.nameQuery);
        }

        // Seta o focus no ultimo campo do filtro
        setFocusFirstField(vars.nameQuery);

        // Atualiza a tela
        if(blUpdate) {
          $("#"+vars.formElement+" #BtnPesquisar").click();
        }

      });
    }

    $("#"+vars.formElement+" #filterField"+vars.filterIndex).kendoDropDownList({
      change: function(e){
        loadOperator(this, vars);

        var strFilterName = '#filterValue' + $(this.element[0]).attr('data-value');
        var strPath       = '#Win'+vars.nameQuery+' #frm'+vars.nameQuery+' #flt'+vars.nameQuery+' '+strFilterName;
        var strTypeField  = $(strPath).attr('data-role');

        switch(strTypeField) {

          case 'numerictextbox':
            $(strPath).data("kendoNumericTextBox").focus();
          break;

          default:
            $(strPath).focus();
        }
      }
    });

    $("#"+vars.formElement+" #filterOperator"+vars.filterIndex).kendoDropDownList({
      dataTextField: "text",
      dataValueField: "value"
    });

    $("#"+vars.formElement+" #BtnRemover"+vars.filterIndex).kendoButton({
      spriteCssClass: "k-pg-icon k-i-l1-c4",
      click: function(e){
        removeFilter(this);
        if($("#"+vars.formElement+" #"+vars.filterElement+" > div").length === 1) {
          $("#"+vars.formElement+" #BtnCleanFilter").remove();
        }
        // Seta o focus no ultimo campo do filtro
        setFocusFirstField(vars.nameQuery);
      }
    });

    //Executando a Ação de Seleção do Campo Field
    $("#"+vars.formElement+" #filterField"+vars.filterIndex).data("kendoDropDownList").trigger("change");
    
    if( !getBlUseStateScreen( vars.nameQuery ) ) {
      //Caso tenha Sido informado o Grid, redimensiona o mesmo
      $(window).trigger('resize'); 
    }

  };
  //---------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------//
  //Método que Carrega os Operadores de Acordo com o Tipo do Filtro Selecionado
  //---------------------------------------------------------------------------------------------------------------------//
  var loadOperator = function(obj, vars) {

    //Carregando o Operador do Field Selecionado
    $.each(vars.fields, function(idx,rst) {

      if(obj.value() == rst.name)
        strOperator = rst.type;

    });

    //Carregando o Índice do Grupo de Elementos
    var intIndex = $(obj.element[0]).attr("data-value");

    //Atribuindo o Objeto do Elemento de Valor do Filtro
    var objFilterValue = $("#"+vars.formElement+" #filterValue"+intIndex);

    //Atribuindo o Objeto do Kendo
    var kndWidget = kendo.widgetInstance(objFilterValue,kendo.ui);

    //Verificando se o Objeto já Existe
    if (kndWidget){
      kndWidget.destroy();
    }

    $("#"+vars.formElement+" #filterContent"+intIndex).html('<input id="filterValue'+intIndex+'" tabindex="'+ (++vars.filterTabIndex) +'">');

    if (strOperator == 'integer'){

      var objFilterValue = $("#"+vars.formElement+" #filterValue"+intIndex);

      var optData = [
        {value: "eq", text: "Igual a"},
        {value: "neq", text: "Diferente de"},
        {value: "startswith", text: "Inicia com"},
        {value: "endswith", text: "Termina com"},
        {value: "contains", text: "Contenha"},
        {value: "doesnotcontain", text: "Não contenha"},
        {value: "gt", text: "Maior que"},
        {value: "lt", text: "Menor que"},
        {value: "gte", text: "Maior ou igual a"},
        {value: "lte", text: "Menor ou igual a"}
      ];

      objFilterValue.kendoNumericTextBox({min: 0,format: "#"});


    }
    else if(strOperator == 'string'){

      var objFilterValue = $("#"+vars.formElement+" #filterValue"+intIndex);

      var optData = [
        {value: "contains", text: "Contenha"},
        {value: "startswith", text: "Inicia Com"},
        {value: "endswith", text: "Termina Com"},
        {value: "doesnotcontain", text: "Não Contenha"},
        {value: "neq", text: "Diferente de"},
        {value: "eq", text: "Igual a"}
      ];

      objFilterValue.kendoMaskedTextBox();

      // Setado dessa forma para o tamanho se adaptar entre os novegadores chrome e firefox - Fabrício M. Goulart 30/09/2020
      objFilterValue[0].style.width = '140px';

      objFilterValue.closest("span.k-datepicker").width(180);
    }
    else if(strOperator == 'date') {

      var objFilterValue = $("#"+vars.formElement+" #filterValue"+intIndex);

      var optData = [
        {value: "eq", text: "Igual a"},
        {value: "neq", text: "Diferente de"},
        {value: "gte", text: "Maior ou igual a"},
        {value: "lte", text: "Menor ou igual a"},
        {value: "gt", text: "Maior que"},
        {value: "lt", text: "Menor que"}
      ];

      objFilterValue.kendoDatePicker({format:"dd/MM/yyyy"});
      objFilterValue.kendoMaskedTextBox({mask: '00/00/0000'});
      objFilterValue.closest("span.k-datepicker").width(120);

    }
    else if((strOperator == 'hour') || (strOperator == 'time')) {

      var objFilterValue = $("#"+vars.formElement+" #filterValue"+intIndex);

      var optData = [
        {value: "gte", text: "Maior ou igual a"},
        {value: "lte", text: "Menor ou igual a"},
        //{value: "neq", text: "Diferente de"},
        {value: "gt", text: "Maior que"},
        {value: "lt", text: "Menor que"},
        {value: "eq", text: "Igual a"}
      ];

      objFilterValue.kendoTimePicker({format:"hh:mm:ss"});
      objFilterValue.kendoMaskedTextBox({mask: '00:00:00'});
      objFilterValue.closest("span.k-timepicker").width(120);

    }
    else if(strOperator == 'numeric') {

      var objFilterValue = $("#"+vars.formElement+" #filterValue"+intIndex);

      var optData = [
        {value: "eq", text: "Igual a"},
        {value: "gte", text: "Maior ou igual a"},
        {value: "lte", text: "Menor ou igual a"},
        {value: "neq", text: "Diferente de"},
        {value: "gt", text: "Maior Que"},
        {value: "lt", text: "Menor Que"}
      ];

      objFilterValue.kendoNumericTextBox({decimals: 2, format: "c2"});
      //objFilterValue.closest("span.k-datepicker").width(150);

    }

    objfilterOperator = $("#"+vars.formElement+" #filterOperator"+intIndex).data("kendoDropDownList");
    objfilterOperator.dataSource.data(optData);
    objfilterOperator.dataSource.query();
    objfilterOperator.select(0);

    /*
    Ao trocar o filtro vamos passar pelo tabIndex de cada 1
    e seta-lós novamente para ficar na sequencia correta ...
    */
    orderTabIndexFilter();

  };
  //---------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------//
  //Método que remove os Ítens do Filtro
  //---------------------------------------------------------------------------------------------------------------------//
  var removeFilter = function(obj) {

    var blUpdate = false;
    var intIndex = $(obj.element[0]).attr("data-value");

    // Se o campo que esta sendo excluido possuir registro, vamos atualizar a tela
    if( $($("#"+vars.formElement+" #"+vars.filterElement+" #filterValue"+intIndex)[0]).val() !== '' ) {
      blUpdate = !blUpdate;
    }

    $("#"+vars.formElement+" #filterItem"+intIndex).remove();

    // caso seja necessario, atualizaremos a tela
    if ( blUpdate ) {
      $("#"+vars.formElement+" #BtnPesquisar").click();
    }

    if( getBlUseStateScreen(vars.nameQuery) ) {
      dispatcheEventAddFilterOnScreen(vars.nameQuery, 'RemoveFilter');
    }
    else {
      $(window).trigger('resize');
    }

    orderTabIndexFilter();
  };
  //---------------------------------------------------------------------------------------------------------------------//  
  
  //---------------------------------------------------------------------------------------------------------------------//
  // Método que retorna o valor valor do tabindex, conforme a criação da tela
  //---------------------------------------------------------------------------------------------------------------------//
  var cdIndiceTabIndex = function() {

    var intFoundIndex = 1;

    // Se, a primeira linha dos filtros por uma linha "Adicional", vamos pegar o ultimo valor existente para o tabindex
    var strContentFirstChild = $('#'+vars.formElement+' .k-bg-blue.screen-filter-content > table:nth-of-type(1)').html();
    if(strContentFirstChild != null){
      intFoundIndex        = parseInt(strContentFirstChild.substring(strContentFirstChild.lastIndexOf('tabindex')+10, strContentFirstChild.lastIndexOf('tabindex')+11));
    }
    intFoundIndex            = (intFoundIndex > 0) ? (intFoundIndex + 1) : 1;

    return intFoundIndex;
  }
  //---------------------------------------------------------------------------------------------------------------------//

  //---------------------------------------------------------------------------------------------------------------------//
  // Método que ordena o TabIndex dos Ítens do Filtro
  //---------------------------------------------------------------------------------------------------------------------//
  var orderTabIndexFilter = function() {
    //inicia o primeiro campo como 1 e vai incrementando ...
    var indiceTabIndex = cdIndiceTabIndex();
    //validação para termos certeza que entrou no each
    var blControle = false;

    $("#"+vars.formElement+" #"+vars.filterElement).find('div').each(function(indice, obj) {
      blControle = true;
      //Percorre os objetos filtros
      for(var i = 0; i < obj.children.length; i++) {
        // pega o objeto atual
        var currentObject = obj.children[i];
        // se for o botão 'Remover' continua ...
        if( currentObject.title === 'Remover' ) {
          continue;
        }
        /*
          Se for -1 quer dizer que é o ultimo campo, então precisamos acessar
          +1 filho para chegar no tabindex correto.
          Field: filterValue1
        */
        if( currentObject.tabIndex < 0) {
          var blNumeric = false;
          /* se for tipo numeric tem um tratamento diferenciado */
          if( $(currentObject.children[0]).attr("class") === 'k-widget k-numerictextbox' ) {
            $(currentObject.children[0]).find('input').each(function(item, numericTextBox) {
              numericTextBox.tabIndex = indiceTabIndex;
              blNumeric = true;
            });

            if( blNumeric ) {
              ++indiceTabIndex;
            }
          } else {
            currentObject.children[0].firstChild.tabIndex = indiceTabIndex++;
          }
        } else {
          //Fields: filterFieldX or filterOperator
          currentObject.tabIndex = indiceTabIndex++;
        }
      }
    });

    --indiceTabIndex;

    if( blControle ) {
      vars.filterTabIndex = indiceTabIndex;
    }

  }

  this.construct(options);

}
//---------------------------------------------------------------------------------------------------------------------//