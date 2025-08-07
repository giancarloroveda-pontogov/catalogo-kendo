 /*******************************************************************************************************************/
/*Biblioteca com funções utilitárias para os sistemas da Pontogov                                                  */
/*Programadores: Jonny Gubler                                                                                      */
/*             :                                                                                                   */
/*Ultima Atualização: 19/07/2016                                                                                   */
/*******************************************************************************************************************/

//-----------------------------------------------------------------------------------------------------------------//
//Adicionando a interação da tecla 'Enter' para alternar entre um campo e outro no formulário.
//-----------------------------------------------------------------------------------------------------------------//
IntContEnter = 0;
StrLastObj = '';
$(document).on('keydown', 'input, select, button, textarea, .k-dropdown, .k-input, .k-button', function(e) {
  
  if(((e.keyCode == 27 || e.which == 27) || e.keyCode == 13 || e.keyCode == 9) && $(this).parents().hasClass("ms-drop") === false){
    
    //Carregando o Form da Tela da Ação
    var StrFormId = $(this).parents('form:first').attr("id");

    //Carregando o Tab Index do campo Atual. Por padrão, busca da maneira abaixo
    var IntTabIndex = parseInt($(this).attr('tabindex'));
    
    //Caso for um campo multipleselect, tratar de maneira adequada
    if($(this).parent().attr('class') == 'ms-parent '){
      IntTabIndex = $(this).closest(".ms-parent").find(".ms-choice").attr('tabindex');
    }
    
    //Caso seja um Botão Executa a ação de Click e não pula para o Próximo Campo
    if($(this).hasClass("k-button") == true){
      return;
    }

    //Buscando o Maior TabIndex do Form
    var IntMaxTabIndex = 0;
    $('#'+StrFormId+' [tabindex]').each(function(ObjElement){
      if(parseInt($(this).attr("tabindex")) != 0 && parseInt($(this).attr("tabindex")) > IntMaxTabIndex)
        IntMaxTabIndex = parseInt($(this).attr("tabindex"));
    });

    //Quando for TextArea
    if($(this).attr('id') != StrLastObj){
      StrLastObj = $(this).attr('id');
      IntContEnter = 1;
    }
    else{
      IntContEnter = IntContEnter+1
    }

    if (($(this).is("textarea") == true && IntContEnter == 3) || $(this).is("textarea") == false){

      IntContEnter = 0;
      $(this).val($.trim($(this).val()));

      if(e.shiftKey){
        for (i = IntMaxTabIndex; i < 1; i--) {
          if(i < IntTabIndex){
            var ObjNext = $('#'+StrFormId+' [tabindex='+i+']').not('.k-input-disabled,.k-state-disabled');
            if(ObjNext != undefined){

              if( $(ObjNext).is(":text") == true)
                $('#'+StrFormId+' [tabindex='+i+']').select();
              else
                $('#'+StrFormId+' [tabindex='+i+']').focus();

              return false;

            }
          }
          else if (i == 1){
            setTimeout(function(){
              $('#'+StrFormId+' [tabindex='+IntMaxTabIndex+']').select();
            },50);
          }
        }
      }
      else{
        for (i = 0; i <= IntMaxTabIndex; i++) {
          if(i > IntTabIndex){
            
            var ObjNext = $('#'+StrFormId+' [tabindex='+i+']').not('.k-input-disabled,.k-state-disabled');  

            if($(ObjNext).attr("tabindex") != undefined && ObjNext.is(':disabled') == false && ObjNext.hasClass('disabled') == false){

              //Verificando op Tipo de Campo
              var StrTipoCampo = $(ObjNext).next().attr("data-role");
              var StrIdCampo = $(ObjNext).next().attr("id");

              //Caso Seja Campo do Tipo Numeric Text Box
              if (StrTipoCampo == 'numerictextbox'){
                var Input = $('#'+StrFormId+' #'+StrIdCampo);

                Input.on('focus', function () {
                    var imput = $(this);
                    setTimeout(function () { imput.select(); });
                });

                $('#'+StrFormId+' [tabindex='+i+']').focus();

              }
              else{

                if( $(ObjNext).is(":text") == true)
                  $('#'+StrFormId+' [tabindex='+i+']').select();
                else
                  $('#'+StrFormId+' [tabindex='+i+']').focus();

              }

              return false;

            }
          }
          else if (i == IntMaxTabIndex){
            setTimeout(function(){
              $('#'+StrFormId+' [tabindex=1]').select();
            },50);
          }
        }
      }
    }
  //Trabalhando com os elementos que existem dentro do campo Multiple-Select.  
  }else if($(this).parents().hasClass("ms-parent") === true){
    
    //buscando as informações necessárias para acessar o componente pai dos demais componentes que compõem o campo, podendo assim utilizar suas funções padrões. 
    var objMultipleSelect = $(this).closest('.ms-parent').parent().children();
    var StrFormId = $(this).parents('form:first').attr("id");
    var objCampoMultipleSelect = $("#"+StrFormId+" #"+objMultipleSelect.attr('id'));
    
    var flLeaveOptionsByTop = false;
    
    //Caso seja um campo Multiple-Select que não contenha um campo de pesquisa:
    if($(this).closest('div').children('div').children().hasClass('ms-search') == false){
      //Especificando que ele somente exibirá as opções ao pressionar a tecla 'Espaço'.
      //if(e.which == 32 || e.keyCode == 32){
      //  objCampoMultipleSelect.multipleSelect('open');
        //Como não há o campo de pesquisa, precisamos realizar o foco na primeira opção manualmente.
      //  $(this).next('div').children().children().first().children().children().select();  
      //}
      
      //Essa variável será usada para guardar o valor da primeira opção do campo.
      firstCheckboxInputValue = $(this).parents().children('li').first().children().children('input').attr('value');
      //if((e.which == 9 || e.keyCode == 9) && (e.which == 160 || e.keyCode == 160) || (e.which == 16 || e.keyCode == 16) && $(this).attr('value') == firstCheckboxInputValue){
//        flLeaveOptionsByTop = true;
//        objCampoMultipleSelect.multipleSelect('close');
//      }
      
    }
    
    //Caso o elemento atual seja um componente que é exibido na abertura do campo Multiple-Select 
    if($(this).parents().hasClass('ms-drop') && $(this).parents().hasClass('ms-search') == false){
      
      //Essa variável será usada para guardar o valor da última opção do campo.
      var lastCheckboxInputValue = $(this).closest("ul").children().not('.ms-no-results').last().last().prevObject.children().children().attr('value');
      
      //Fecha as opções do campo ao pressionar a tecla 'Enter'.
      if(e.which == 13 && e.keyCode == 13){
        objCampoMultipleSelect.multipleSelect('close');
      }
      
      //Após chegar no último item(option) do multiple-select, ao apertar Tab, irá fechar o campo.
      if(e.which != 32 && e.keyCode != 32 && $(this).attr('value') == lastCheckboxInputValue){
        objCampoMultipleSelect.multipleSelect('close');
      }else if(e.which == 32 || e.keyCode == 32 && $(this).attr('value') == lastCheckboxInputValue){
        if($(this).is(':checked') == false){
          $(this).prop('checked', true); 
          $(this).focus();
        }else{
          $(this).prop('checked', false);  
          $(this).focus();
        }          
      }
      
      //Após fechar o campo, irá seguir os passos abaixo para buscar o próximo campo habilitado para que seja dado o foco.
      
      //Pegando o Tabindex do campo multiple-select atual.
      IntTabIndex = $(this).closest(".ms-parent").find(".ms-choice").attr('tabindex');
      
      //Caso seja um Botão Executa a ação de Click e não pula para o Próximo Campo
      if($(this).hasClass("k-button") == true){
        return;
      }

      //Buscando o Maior TabIndex do Form
      var IntMaxTabIndex = 0;
      $('#'+StrFormId+' [tabindex]').each(function(ObjElement){
        if(parseInt($(this).attr("tabindex")) != 0 && parseInt($(this).attr("tabindex")) > IntMaxTabIndex)
          IntMaxTabIndex = parseInt($(this).attr("tabindex"));
      });

      //Quando for TextArea
      if($(this).attr('id') != StrLastObj){
        StrLastObj = $(this).attr('id');
        IntContEnter = 1;
      }
      else{
        IntContEnter = IntContEnter+1
      }

      if (($(this).is("textarea") == true && IntContEnter == 3) || $(this).is("textarea") == false){

        IntContEnter = 0;
        $(this).val($.trim($(this).val()));

        if(e.shiftKey){
          
        }
        else{
          for (i = 0; i <= IntMaxTabIndex; i++) {
            
            if(i > IntTabIndex){
              
              if(flLeaveOptionsByTop){
                i = IntTabIndex;  
              }
                          
              var ObjNext = $('#'+StrFormId+' [tabindex='+i+']').not('.k-input-disabled,.k-state-disabled');  

              if($(ObjNext).attr("tabindex") != undefined && $('#'+StrFormId+' [tabindex='+i+']').is(':disabled') == false){

                //Verificando op Tipo de Campo
                var StrTipoCampo = $(ObjNext).next().attr("data-role");
                var StrIdCampo = $(ObjNext).next().attr("id");

                //Caso Seja Campo do Tipo Numeric Text Box
                if (StrTipoCampo == 'numerictextbox'){
                  var Input = $('#'+StrFormId+' #'+StrIdCampo);

                  Input.on('focus', function () {
                      var imput = $(this);
                      setTimeout(function () { imput.select(); });
                  });
                  if(e.which != 32 && e.keyCode != 32 && $(this).attr('value') == lastCheckboxInputValue){
                    $('#'+StrFormId+' [tabindex='+i+']').focus();
                  }else if(e.which == 13 || e.keyCode == 13){
                    $('#'+StrFormId+' [tabindex='+i+']').focus();
                  }  
                }
                else{

                  if( $(ObjNext).is(":text") == true){
                    if(e.which != 32 && e.keyCode != 32 && $(this).attr('value') == lastCheckboxInputValue){
                      $('#'+StrFormId+' [tabindex='+i+']').select();
                    }else if(e.which == 13 || e.keyCode == 13){
                      $('#'+StrFormId+' [tabindex='+i+']').select();
                    }  
                  }else{
                    if(e.which != 32 && e.keyCode != 32 && $(this).attr('value') == lastCheckboxInputValue){
                      $('#'+StrFormId+' [tabindex='+i+']').focus();
                    }else if(e.which == 13 || e.keyCode == 13){
                      $('#'+StrFormId+' [tabindex='+i+']').focus();
                    }    
                  }
                }

                return false;

              }
            }
            else if (i == IntMaxTabIndex){
              setTimeout(function(){
                $('#'+StrFormId+' [tabindex=1]').select();
              },50);
            }
          }
        }
      }
    }
  }
})
.keyup(function(e) {// Feito assim para corrigir o z-index do menu quando se fecha uma tela de inclusão usando o 'ESC'
  if (e.key === "Escape") { // escape key maps to keycode `27`
    //$("#KndMenu").css("z-index", "10001");
    setZIndexCorrectly();
  }
});
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Notificação do Tipo Informação
//-----------------------------------------------------------------------------------------------------------------//
function NtfInfo(StrMessage){

  var popupNotification = $("#popNotificacao").kendoNotification({
    button: true,
    autoHideAfter: 5000,
  }).data("kendoNotification");

  StrMessage = '<strong>Informação</strong> <br><br>'+StrMessage;

  popupNotification.show(StrMessage, "info");
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Notificação do Tipo Atenção
//-----------------------------------------------------------------------------------------------------------------//
function NtfAlert(StrMessage){
  var popupNotification = $("#popNotificacao").kendoNotification({
    button: true,
    autoHideAfter: 4000,
  }).data("kendoNotification");

  StrMessage = '<strong>Atenção!!!</strong><br><br>'+StrMessage+'<br>';

  popupNotification.show(StrMessage, "warning");
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Notificação do Tipo Sucesso
//-----------------------------------------------------------------------------------------------------------------//
function NtfSucces(StrMessage){
  var popupNotification = $("#popNotificacao").kendoNotification({
    button: true,
    autoHideAfter: 2000,
  }).data("kendoNotification");

  StrMessage = '<strong>Sucesso!!!</strong><br><br>'+StrMessage+'<br><br>';

  popupNotification.show(StrMessage, "success");
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Notificação do Tipo Erro
//-----------------------------------------------------------------------------------------------------------------//
function NtfError(StrMessage){
  var popupNotification = $("#popNotificacao").kendoNotification({
    button: true,
    autoHideAfter: 10000,
  }).data("kendoNotification");

  StrMessage = '<strong>Erro</strong> <br><br>'+StrMessage+'<br><br>';

  popupNotification.show(StrMessage, "error");
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Dialog do Tipo Informação
//-----------------------------------------------------------------------------------------------------------------//
function DlgfInfo(StrMessage){
  (new FrontBox).alert(StrMessage);
  setTimeout(function(){
    $(".frontbox-btn").focus();
  }, 500);
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Dialog do Tipo Atenção
//-----------------------------------------------------------------------------------------------------------------//
function DlgAlert(StrMessage){
  (new FrontBox).warning(StrMessage);
  setTimeout(function(){
    $(".frontbox-btn").focus();
  }, 500);
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Dialog do Tipo Sucesso
//-----------------------------------------------------------------------------------------------------------------//
function DlgSucces(StrMessage){
  (new FrontBox).success(StrMessage);
  setTimeout(function(){
    $(".frontbox-btn").focus();
  }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abre uma Dialog do Tipo Erro
//-----------------------------------------------------------------------------------------------------------------//
function DlgError(StrMessage){
  (new FrontBox).error(StrMessage);
  setTimeout(function(){
    $(".frontbox-btn").focus();
  }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que abere a Notificação/Dialog de Acordo com o tipo
//-----------------------------------------------------------------------------------------------------------------//
function Message(FlDisplay,FlTipo,StrMessage){

  //Verificando o Tipo de Display (Notificação ou Dialog)
  if (FlDisplay == 'ntf'){ //Notificação
    if (FlTipo == 'A')
      NtfAlert(StrMessage)
    else if (FlTipo == 'S')
      NtfSucces(StrMessage)
    else if (FlTipo == 'I')
      NtfInfo(StrMessage)
    else if (FlTipo == 'E')
      NtfError(StrMessage)
  }
  else{ //Dialog
    if (FlTipo == 'A')
      DlgAlert(StrMessage)
    else if (FlTipo == 'S')
      DlgSucces(StrMessage)
    else if (FlTipo == 'I')
      OpenInfo(StrMessage)
    else if (FlTipo == 'E')
      DlgError(StrMessage)
  }
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que redimenciona os Grid de Busca de Acordo com a altura da Janela
//-----------------------------------------------------------------------------------------------------------------//
function ResizeGrid(strName) {
  $("#Win"+strName+" .k-filter").each(function(){
    var filter = $(this);
    var objGrid = $("#Grd"+strName);
    //Buscando o tipo de Componente que pode ser grid ou listview
    var widGrid = kendo.widgetInstance(objGrid,kendo.ui);
    if(widGrid){
      setTimeout(function(){
        var divFilter = filter.height();
        var winHeight = $("#Win"+strName).height();

        widGrid.wrapper.height(winHeight - divFilter - 10);
        widGrid.resize();

      },200);

    }
  });
}

//-----------------------------------------------------------------------------------------------------------------//
//Faz o resize da janela para adequação correta da tela de visualização
//-----------------------------------------------------------------------------------------------------------------//
function ResizeGridToPreview(strName) {

  var intAltura         = $('#Win'+strName).height();
  var strFieldValid     = $('#frm'+strName+' .k-filter .k-bg-blue > table');

  var intHeightTabStrip = ( validaResizeScreen(strName) ) ? intAltura - 256 : intAltura - 230;

  $("#Win"+strName+" .k-filter").each(function() {

    var filter = $(this);
    var objGrid = $("#Grd"+strName);
    //Buscando o tipo de Componente que pode ser grid ou listview
    var widGrid = kendo.widgetInstance(objGrid,kendo.ui);
    if(widGrid) {
      widGrid.wrapper.height( intHeightTabStrip );
      widGrid.resize();
    }
  });
}

//-----------------------------------------------------------------------------------------------------------------//
//Faz a validação com a quantidade de filtros usados para setar corretamente o tamanho
//-----------------------------------------------------------------------------------------------------------------//
function validaResizeScreen( strName ) {

  var blCtrValid = false;
  var idFirst = $('#frm'+strName+' .k-filter .k-bg-blue > table').length;

  if( idFirst >= 2 ) {
    blCtrValid = true;
  }
  else if(!blCtrValid) {
    var secund = $('#frm'+strName+' .k-filter .k-bg-blue #flt'+strName+' > div').length;
    blCtrValid = secund >= 2 ;
  }

  return blCtrValid;
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que redimenciona os Grid de Busca de Acordo com a altura da Janela
//-----------------------------------------------------------------------------------------------------------------//
function resizeEditor(strNmRotina,strNmImput){

  setTimeout(function(){
    var MnuHeight = $("#frm"+strNmRotina+" .mce-top-part").height();
    //var MnuHeight = 69;
    var WinHeight = $("#Win"+strNmRotina).height();
    $("#frm"+strNmRotina+" .mce-container").addClass('pgEditorNotBorder');
    $("#frm"+strNmRotina+" #"+strNmImput+"_ifr").height((WinHeight-MnuHeight)-38);
  }, 400)


}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que ajusta o tamanho do spliter de acordo com o tamanho do monitor
//-----------------------------------------------------------------------------------------------------------------//
function ResizeSplitter() {

  var Splitter = $("#KndSplitter").data("kendoSplitter");
  var BrowserWindow = $(window);

  var HeaderFooterHeight = $("#DivHeader").height() + $("#DivMenu").height() + $("#DivFooter").height();
  Splitter.wrapper.height(BrowserWindow.height() - HeaderFooterHeight);
  Splitter.resize();

  $("#DivWindowArea").height($("#DivCentro").height()-26);
  $("#MenuAcordian").height($("#DivCentro").height()-2);

  $(".acordian").each(function(){
    $(this).height($("#MenuAcordian").height()-78);
  });

  $(".k-widget .k-window").each(function(){
    var WinName = $(this).find('.k-background-window:eq(0)').attr('id');
    if($(this).find('.k-background-window:eq(0)').attr('data-status') == 'M'){
      $(this).height($("#DivWindowArea").height()-40);
    }

    if($(this).find('.k-background-window:eq(0)').attr('data-status') == 'N'){
      CenterWindow(WinName);
    }

    var DivFilter = $(this).find(".k-filter");
    var WinHeight = $(this).height();

    var DivGrid = $(this).find(".k-grid").data("kendoGrid");

    if (DivGrid) {
      DivGrid.wrapper.height(WinHeight - DivFilter.height());
      DivGrid.resize();
    }

  });

}

//-----------------------------------------------------------------------------------------------------------------//
//Função que ajusta o tipo de condições de acordo com o tipo de campo do Filtro
//-----------------------------------------------------------------------------------------------------------------//
function SetCondition(strForm,objElement){

  /*****************************************************/
  /*Tipos disponíveis
  /*int -> Inteiro
  /*str -> String
  /*dat -> Date
  /*val -> Decimal
  /*****************************************************/

  var strDataType = objElement.value().substr(0,3);
  var objArgumento1 = $("#"+strForm+" #dsArgumento1");
  var objArgumento2 = $("#"+strForm+" #dsArgumento2");
  var strObjType = $("#"+strForm+" #nmFiltro").attr("data-role");

  var divArgumento = $("#"+strForm+" #divArgumento");

  var widget1 = kendo.widgetInstance(objArgumento1,kendo.ui);
  var widget2 = kendo.widgetInstance(objArgumento2,kendo.ui);

  if (widget1){widget1.destroy();}
  if (widget2){widget2.destroy();}

  var LastTabIndex = parseInt($("#"+strForm+" #flComparacao").parent().attr("tabindex"));
  var NextTabIndex = LastTabIndex+1;

  divArgumento.html('<input type="text" id="dsArgumento1" tabindex="-1" name="dsArgumento1" /> <input type="text" id="dsArgumento2" tabindex="-1" name="dsArgumento2"/>');

  $("#"+strForm+" #dsArgumento1").attr("tabindex",NextTabIndex);
  $("#"+strForm+" #dsArgumento1").prev().attr("tabindex",NextTabIndex);

  if (strDataType == 'int'){

    var objInt1 = $("#"+strForm+" #dsArgumento1");
    var objInt2 = $("#"+strForm+" #dsArgumento2");

    var optData = [
                    {value: "=#", text: "Igual a"},
                    {value: "%#", text: "Inicia Com"},
                    {value: "#%", text: "Termina Com"},
                    {value: "##", text: "Contenha"},
                    {value: "N#", text: "Não Contenha"},
                    {value: "!#", text: "Diferente de"},
                    {value: ">#", text: "Maior Que"},
                    {value: "<#", text: "Menor Que"},
                    {value: "*#", text: "Entre"},
                  ];

    objInt1.kendoNumericTextBox({min: 0,format: "#"});
    objInt2.kendoNumericTextBox({min: 0,format: "#"});

    objInt2.data("kendoNumericTextBox").wrapper.hide();
  }

  if(strDataType == 'str'){

    var objStr1 = $("#"+strForm+" #dsArgumento1")
    var objStr2 = $("#"+strForm+" #dsArgumento2")

    var optData = [
                    {value: "&&", text: "Contenha"},
                    {value: "%&", text: "Inicia Com"},
                    {value: "&%", text: "Termina Com"},
                    {value: "N&", text: "Não Contenha"},
                    {value: "!&", text: "Diferente de"},
                    {value: "=&", text: "Igual a"}
                  ];

    objStr1.kendoMaskedTextBox();
    objStr2.kendoMaskedTextBox();

    objStr1.closest("span.k-datepicker").width(150);
    objStr2.data("kendoMaskedTextBox").wrapper.hide();
  }

  if(strDataType == 'dat'){
    var objDat1 = $("#"+strForm+" #dsArgumento1");
    var objDat2 = $("#"+strForm+" #dsArgumento2");

    var optData = [
                    {value: "=D", text: "Igual a"},
                    {value: ">D", text: "Maior que"},
                    {value: "<D", text: "Menor que"},
                    {value: "!D", text: "Diferente de"},
                    {value: "*D", text: "Entre"}
                  ];

    objDat1.kendoDatePicker({format:"dd/MM/yyyy"});
    objDat1.kendoMaskedTextBox({mask: '00/00/0000'});

    objDat2.kendoDatePicker({format:"dd/MM/yyyy"});
    objDat2.kendoMaskedTextBox({mask: '00/00/0000'});

    objDat2.data("kendoDatePicker").wrapper.hide();
  }

  if(strDataType == 'val'){

    var objVal1 = $("#"+strForm+" #dsArgumento1");
    var objVal2 = $("#"+strForm+" #dsArgumento2");

    var optData = [
                    {value: "=$", text: "Igual a"},
                    {value: "!$", text: "Diferente de"},
                    {value: ">$", text: "Maior Que"},
                    {value: "<$", text: "Menor Que"},
                    {value: "$$", text: "Contenha"},
                    {value: "*$", text: "Entre"}
                  ];

    objVal1.kendoNumericTextBox({decimals: 2,spinners: false});
    objVal2.kendoNumericTextBox({decimals: 2,spinners: false});

    objVal1.closest("span.k-datepicker").width(150);
    objVal2.closest("span.k-datepicker").width(150);


    objVal2.data("kendoNumericTextBox").wrapper.hide();
  }

  var objComparacao = "";

  if (strObjType == "combobox"){
    objComparacao = $("#"+strForm+" #flComparacao").data("kendoComboBox");
  }
  else if (strObjType == "dropdownlist"){
    objComparacao = $("#"+strForm+" #flComparacao").data("kendoDropDownList");
  }

  objComparacao.dataSource.data(optData);
  objComparacao.dataSource.query();
  objComparacao.select(0);

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que ajusta o tipo de operação da consulta de acordo com o tipo de campo do Filtro (Novo)
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que seta os campos de argumento de acordo com a Condição Selecionada
//-----------------------------------------------------------------------------------------------------------------//
function SetArgumento(strForm,objElement){

  var objArgumento2 = $("#"+strForm+" #dsArgumento2");
  var widget2 = kendo.widgetInstance(objArgumento2,kendo.ui);

  var LastTabIndex = parseInt($("#"+strForm+" #flComparacao").parent().attr("tabindex"));
  var NextTabIndex = LastTabIndex+2;

  if(widget2){

    $("#"+strForm+" #dsArgumento2").attr("tabindex",-1);
    $("#"+strForm+" #dsArgumento2").prev().attr("tabindex",-1);

    if(widget2.options.name == "DatePicker"){
      $("#"+strForm+" #dsArgumento2").parent().parent().hide();
      $("#"+strForm+" #dsArgumento2").data("kendoDatePicker").wrapper.hide();
    }else if(widget2.options.name == "NumericTextBox"){
      $("#"+strForm+" #dsArgumento2").data("kendoNumericTextBox").wrapper.hide();
    }else if(widget2.options.name == "MaskedTextBox"){
      $("#"+strForm+" #dsArgumento2").data("kendoMaskedTextBox").wrapper.hide();
    }
  }

  if(objElement.value() == '*#'){
    $("#"+strForm+" #dsArgumento2").data("kendoNumericTextBox").wrapper.show();
    $("#"+strForm+" #dsArgumento2").attr("tabindex",NextTabIndex);
    $("#"+strForm+" #dsArgumento2").prev().attr("tabindex",NextTabIndex);
  }
  else if(objElement.value() == '*D'){
    $("#"+strForm+" #dsArgumento2").data("kendoDatePicker").wrapper.show();
    $("#"+strForm+" #dsArgumento2").parent().parent().show();
    $("#"+strForm+" #dsArgumento2").attr("tabindex",NextTabIndex);
    $("#"+strForm+" #dsArgumento2").prev().attr("tabindex",NextTabIndex);
  }
  else if (objElement.value() == '*$'){
    $("#"+strForm+" #dsArgumento2").data("kendoNumericTextBox").wrapper.show();
    $("#"+strForm+" #dsArgumento2").attr("tabindex",NextTabIndex);
    $("#"+strForm+" #dsArgumento2").prev().attr("tabindex",NextTabIndex);
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função para abrir Relatórios que tenham Orige do BIRT
//-----------------------------------------------------------------------------------------------------------------//
function OpenReport(idRelatorio,dsParams){

  //Buscando os dados do Relatório
  $.ajax({
    dataType: "json",
    url: "sistema/controller/report/ctrReport.php?action=getReport&idRelatorio="+idRelatorio,
    success: function(report){

      //Verificando se a janela do relatório já existe. Se existe, será fechada para abrir novamente com parametros atualizados
      if($("#Win"+report.nmidentificador).length){
        CloseWindow('Win'+report.nmidentificador);
      }

      //Abrir janela com delay, para permitir verificação de janela aberta
      setTimeout(function(){
        //Sempre abrir janela na Área central do Sistema
        $("#DivWindowArea").append("<div id='Win"+report.nmidentificador+"' class='k-background-window' style='padding-top: 0px;overflow:hidden'></div>");
        //Abrir janela
        var Win = $('#Win'+report.nmidentificador).kendoWindow({
          title: report.nmrelatorio,
          visible: false,
          resizable: false,
          modal: false,
          draggable: false,
          height: $("#DivWindowArea").height() - 26,
          width: "99.6%",
          actions: ["Minimizar","Close"],
          content: 'sistema/controller/report/ctrReport.php?action=listReport&'+dsParams+'&idRelatorio='+idRelatorio,
          appendTo: "#DivWindowArea",
          close: function(e){
            setTimeout(function(){
              Win.data("kendoWindow").destroy();
              $("#btn"+report.nmidentificador).remove();
              //Verificar se não existe nenhuma outra janela Modal antes de alterar o Z-Index do Menu
              //$("#KndMenu").css("z-index","11000");
            }, 200);
          }
        });

        //Ao Clicar no Botão de Minimizar
        $('#Win'+report.nmidentificador).data("kendoWindow").wrapper.find(".k-i-minimizar").parent().click(function (e) {
          $('#Win'+report.nmidentificador).parent().fadeOut('fast');
        });

        //Adicionando o Icone a Janela
        $('#Win'+report.nmidentificador).data("kendoWindow").wrapper.find(".k-window-title").prepend("<span class='k-i-window k-i-l2-c9' data-view='"+report.nmidentificador+"'></span>");

        //Montando o Botão da Barra de Ferramentas
        if (!($("#btn"+report.nmidentificador).length)){
          var alt = report.nmrelatorio;
          var strDsTitulo = "";

          if (alt.length > 22){
            strDsTitulo = alt.substring(0,24)+'...';
          }
          else{
            strDsTitulo = alt;
          }

          var MenuWindow = $("#MenuJanelas").data("kendoMenu");

          MenuWindow.append([
            {
              text: '<button class="k-button" onClick="RestoreWindow(\''+report.nmidentificador+'\')">'+strDsTitulo+'</button>',
              encoded: false,
              attr: {
                'id': 'btn'+report.nmidentificador,
                'title': alt
              },

            }
          ]);

          $("#MenuJanelas").kendoMenu({scrollable: true});

        }

        $('#Win'+report.nmidentificador).data("kendoWindow").open();

        var windowWidget = $('#Win'+report.nmidentificador).data("kendoWindow");
        kendo.ui.progress(windowWidget.element, true);

      },200);
    }
  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função para abrir Relatórios que tenham Orige do BIRT com Parâmetros via POST
//Obs.: Função Utilizada nos casos onde são enviados muitos parâmetros a um relatório, e os mesmos ultrapassam o
//limite de tamanho da requisição via GET ex.: govgesta/view/viwConfiguraRelComparativoArrecadacaoDoisExercicios.php
//-----------------------------------------------------------------------------------------------------------------//
function OpenReportByPost(idRelatorio,rptParams){
  //Buscando os dados do Relatório
  $.ajax({
    dataType: "json",
    url: "sistema/controller/report/ctrReport.php?action=getReport&idRelatorio="+idRelatorio,
    success: function(report){
      //Verificando se a janela do relatório já existe. Se existe, será fechada para abrir novamente com parametros atualizados
      if($("#Win"+report.nmidentificador).length){
        CloseWindow('Win'+report.nmidentificador);
      }
      //Abrir janela com delay, para permitir verificação de janela aberta
      setTimeout(function(){
        //Sempre abrir janela na Área central do Sistema
        $("#DivWindowArea").append("<div id='Win"+report.nmidentificador+"' class='k-background-window' style='padding-top: 0px;overflow:hidden'></div>");

        //Abrir janela
        var Win = $('#Win'+report.nmidentificador).kendoWindow({
          title: report.nmrelatorio,
          visible: false,
          resizable: false,
          modal: false,
          draggable: false,
          height: $("#DivWindowArea").height()-26,
          width: "99.6%",
          actions: ["Minimizar","Close"],
          appendTo: "#DivWindowArea",
          close: function(e){
            setTimeout(function(){
              Win.data("kendoWindow").destroy();
              $("#btn"+report.nmidentificador).remove();
              //Verificar se não existe nenhuma outra janela Modal antes de alterar o Z-Index do Menu
              //$("#KndMenu").css("z-index","11000");
            }, 200);
          }
        });

        //Ação que atualiza a tela via POST
        $('#Win'+report.nmidentificador).data("kendoWindow").refresh({
          url: "sistema/controller/report/ctrReport.php",
          type: "POST",
          data: {
            action: "listReportByPost",
            idRelatorio: idRelatorio,
            dsParametros: rptParams
          }
        });

        //Ao Clicar no Botão de Minimizar
        $('#Win'+report.nmidentificador).data("kendoWindow").wrapper.find(".k-i-minimizar").parent().click(function (e) {
          $('#Win'+report.nmidentificador).parent().fadeOut('fast');
        });

        //Adicionando o Icone a Janela
        $('#Win'+report.nmidentificador).data("kendoWindow").wrapper.find(".k-window-title").prepend("<span class='k-i-window k-i-l2-c9' data-view='"+report.nmidentificador+"'></span>");

        //Montando o Botão da Barra de Ferramentas
        if (!($("#btn"+report.nmidentificador).length)){
          var alt = report.nmrelatorio;
          var strDsTitulo = "";

          if (alt.length > 22){
            strDsTitulo = alt.substring(0,24)+'...';
          }
          else{
            strDsTitulo = alt;
          }

          var MenuWindow = $("#MenuJanelas").data("kendoMenu");

          MenuWindow.append([
            {
              text: '<button class="k-button" onClick="RestoreWindow(\''+report.nmidentificador+'\')">'+strDsTitulo+'</button>',
              encoded: false,
              attr: {
                'id': 'btn'+report.nmidentificador,
                'title': alt
              },

            }
          ]);

          $("#MenuJanelas").kendoMenu({scrollable: true});

        }

        $('#Win'+report.nmidentificador).data("kendoWindow").open();

        var windowWidget = $('#Win'+report.nmidentificador).data("kendoWindow");
        kendo.ui.progress(windowWidget.element, true);

      },200);
    }
  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função para abrir Arquivo Pdf em Janela do Sistema
//-----------------------------------------------------------------------------------------------------------------//
function OpenPdfInWindow(nmJanela,dsTitulo,dsEnderecoPdf,flTipo){

  //Sempre abrir janela na Área central do Sistema
  $("#DivWindowArea").append("<div id='Win"+nmJanela+"' class='k-background-window' style='padding-top: 0px;overflow:hidden'></div>");

  //Abrir janela
  var Win = $('#Win'+nmJanela).kendoWindow({
    title: dsTitulo,
    visible: false,
    resizable: false,
    modal: false,
    draggable: false,
    height: $("#DivWindowArea").height()-40,
    width: "99%",
    actions: ["Minimizar","Close"],
    content: 'sistema/controller/report/ctrPdf.php?dsEnderecoPdf='+dsEnderecoPdf+'&nmJanela='+nmJanela,
    appendTo: "#DivWindowArea",
    close: function(e){
      setTimeout(function(){
        Win.data("kendoWindow").destroy();
        $("#btn"+nmJanela).remove();
        //Verificar se não existe nenhuma outra janela Modal antes de alterar o Z-Index do Menu
        //$("#KndMenu").css("z-index","11000");
        //Telas de etapas de fluxogramas exigem conclusão ao fechar a tela da etapa, validação pelo tipo de fluxograma
        switch(flTipo){
          case "J":
            ConcluirEtapaAvaliacaoProjeto();
            break;
          case "P":
            ConcluirEtapaParecerPrestacaoConta();
            break;
          case "A":
            ConcluirEtapaAtoAdmissao();
            break;
          case "C":
            ConcluirEtapaComunicadoInterno();
            break;
          case "N":
            ConcluirEtapaNotificacao();
            break;
          case "R":
            ConcluirEtapaRecomendacao();
            break;
          case "E":
            ConcluirEtapaAuditoriaExecutada();
            break;
        }
      }, 200);
    }
  });
  $('#Win'+nmJanela).data("kendoWindow").open();

}

//-----------------------------------------------------------------------------------------------------------------//
//Função para abrir Arquivo Pdf em Janela do Sistema
//-----------------------------------------------------------------------------------------------------------------//
function ShowPdfInWindow(nmJanela,dsTitulo,dsEnderecoCtr,dsAction,idRegistro,flTipo,flTipoVinculo){

  //Sempre abrir janela na Área central do Sistema
  $("#DivWindowArea").append("<div id='Win"+nmJanela+"' class='k-background-window' style='padding-top: 0px;overflow:hidden'></div>");

  //Abrir janela
  var Win = $('#Win'+nmJanela).kendoWindow({
    title: dsTitulo,
    actions: ["refresh"],
    visible: false,
    resizable: true,
    modal: false,
    draggable: true,
    height: $("#DivWindowArea").height()-40,
    width: "99%",
    actions: ["Minimizar","Close"],
    content: 'controleinterno/view/report/viwPdf.php?dsEnderecoCtr='+dsEnderecoCtr+'action='+dsAction+'&idRegistro='+idRegistro+'&nmJanela='+nmJanela+'&flTipoVinculo='+flTipoVinculo,
    appendTo: "#DivWindowArea",
    close: function(e){
      setTimeout(function(){
        Win.data("kendoWindow").destroy();
        $("#btn"+nmJanela).remove();
        //Verificar se não existe nenhuma outra janela Modal antes de alterar o Z-Index do Menu
        //$("#KndMenu").css("z-index","11000");
        //Telas de etapas de fluxogramas exigem conclusão ao fechar a tela da etapa, validação pelo tipo de fluxograma
        switch(flTipo){
          case "J":
            ConcluirEtapaProjetoTransferencia();
            break;
          case "P":
            ConcluirEtapaPrestacaoConta();
            break;
        }
        
      }, 200);
    },
  });
  $('#Win'+nmJanela).data("kendoWindow").open();

}

//-----------------------------------------------------------------------------------------------------------------//
//Função para abrir Arquivo Pdf em Janela do Sistema
//-----------------------------------------------------------------------------------------------------------------//
function ShowPdfInDynamicWindow(nmJanela,dsTitulo,dsEnderecoCtr,dsAction,dsParam){

  //Sempre abrir janela na Área central do Sistema
  $("#DivWindowArea").append("<div id='Win"+nmJanela+"' class='k-background-window' style='padding-top: 0px;overflow:hidden'></div>");

  //Passe sempre os parâmetros separados por duas barras verticais " || ", para seja possível reconhecê-los e trata-los na viwPdfWindow
  //Caso os parâmetros seja passados separados por '&' o php vai quebrar a string e vai desorganizar

  //Abrir janela
  var Win = $('#Win'+nmJanela).kendoWindow({
    title: dsTitulo,
    visible: false,
    resizable: false,
    modal: false,
    draggable: false,
    height: $("#DivWindowArea").height()-40,
    width: "100%",
    actions: ["Minimizar","Close"],
    content: 'global/view/pdfwindow/viwPdfWindow.php?dsEnderecoCtr='+dsEnderecoCtr+'action='+dsAction+'&dsParam='+dsParam+'&nmJanela='+nmJanela,
    appendTo: "#DivWindowArea",
    close: function(e){
      setTimeout(function(){
        Win.data("kendoWindow").destroy();
        $("#btn"+nmJanela).remove();
      }, 200);
    }
  });
  $('#Win'+nmJanela).data("kendoWindow").open();

}

//-----------------------------------------------------------------------------------------------------------------//
//Função para abrir janela
//-----------------------------------------------------------------------------------------------------------------//
function OpenWindow(IdJanela,FlModal,DsAcao,callback){

  //Carregar os dados da Janela
  $.ajax({
    dataType: "json",
    url: "sistema/controller/janela/ctrJanela.php?action=GetWindowProperties&idJanela="+IdJanela+"&",
    success: function(janela){

      if($("#Win"+janela.nmjanela).length){
        $("#Win"+janela.nmjanela).data("kendoWindow").destroy();
        $("#btn"+janela.nmjanela).remove();
      }

      DsLocal = "";

      //Se a janela não estiver aberta
      if(FlModal == false){
        setZIndexCorrectly();
        DsLocal = "#DivWindowArea";
      }
      else{
        DsLocal = "#Body";
      }

      var StrClass = 'k-background-window';
      if (IdJanela == 62)
        StrClass = 'k-process-loading';


      var winStatus = 'N'; //Normal
      if (janela.flmaximizada == 'true')
        winStatus = 'M'; //Maximizada

      //Altura e Largura da Janela
      var WinHeight = 0;
      var WinWidth = 0;

      //Verificando se é modal
      var FlArrastavel = true;
      if(FlModal == false && janela.flmaximizada == 'true'){
        WinHeight = $("#DivWindowArea").height() - 26 ;
        WinWidth = "99.6%";
        FlArrastavel = false;
        var arrActions = ["Minimizar","Close"]
      }
      else{
        WinHeight = janela.cdaltura;
        WinWidth = janela.cdlargura;
        var arrActions = ["Close"];
        FlArrastavel = true;
      }

      $(DsLocal).append("<div id='Win"+janela.nmjanela+"' data-windowid='"+IdJanela+"' class='"+StrClass+"' data-status='"+winStatus+"' style='overflow:hidden; ' tabindex='-1' ></div>");

      var Win = $('#Win'+janela.nmjanela).kendoWindow({
        title: janela.dstitulo,
        visible: false,
        resizable: false,
        modal: FlModal,
        draggable: FlArrastavel,
        height: WinHeight,
        width: WinWidth,
        actions: arrActions,
        content: janela.dsurl+'?action='+DsAcao+'&',
        appendTo: DsLocal,
        refresh: function() {
          $("#Win"+janela.nmjanela+" .k-toolbar .k-button-group:first").before('<div class="k-spacer k-toolbar-first-visible">&nbsp;</div>');
        },
        close: function(e) {

          setTimeout(function(){

            if(callback != undefined){
              callback();
            }

            if( Win.data("kendoWindow") != undefined ) {
              Win.data("kendoWindow").destroy();
            }

            //Removendo o Botão da Barra de Janelas
            var MenuWindow = $("#MenuJanelas").data("kendoMenu");
            MenuWindow.remove("#btn"+janela.nmjanela);

          }, 200);
        }
      });

      //Ao Clicar no Botão de Minimizar
      $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-i-minimizar").parent().click(function (e) {
        $('#Win'+janela.nmjanela).parent().fadeOut('fast');
      });

      //Adicionando o Icone a Janela
      $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-title").prepend("<span class='k-i-window "+janela.nmicone+"' data-view='"+janela.nmjanela+"'></span>");

      //Adicionando o Botão de Favoritos
      if (janela.flfavorito == 'S'){

        //Verificando se já está em Favoritos
        if (janela.flestafavorito == 'S')
          $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").prepend('<a role="button" class="k-button k-bare k-button-icon k-window-action " aria-label="Adicionar ou Remover de Favoritos" style="padding:2px;vertical-align:top" onClick="SetFavorito('+janela.idjanela+')"><img src="img/icons/icn_esta_favorito.png" border="0" title="Adicionar ou Remover de Favoritos" onClick="SetFavoritoIcon(this)"></a>');
        else
          $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").prepend('<a role="button" class="k-button k-bare k-button-icon k-window-action " aria-label="Adicionar ou Remover de Favoritos" style="padding:2px;vertical-align:top" onClick="SetFavorito('+janela.idjanela+')"><img src="img/icons/icn_favorito.png" border="0" title="Adicionar ou Remover de Favoritos" onClick="SetFavoritoIcon(this)"></a>');
      }

      if (janela.dshelplink != ""){
        //Adicinando o Ícone de Help
        $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").prepend('<a role="button" href="'+janela.dshelplink+'" target="_blank" class="k-button k-bare k-button-icon k-window-action" aria-label="Ajuda" style="padding:2px;vertical-align:top"><img src="img/icons/icn_help.png" border="0"></a>');
      }

      //Adicionando o Icone no Cursor caso seja Modal
      if(FlModal == true){
        $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-header").addClass("k-cursor-move");
        $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-title").addClass("k-cursor-move");
      }
      else{
        $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-header").removeClass("k-cursor-move");
        $('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-title").removeClass("k-cursor-move");
      }

      //Ajustando o Tabindex do Botão de Fechar da Janela
      $("a[aria-label*='Close']" ).attr("tabindex",-1);

      // Se for uma tela de consulta
      if(!FlModal) {
        setTimeout(function() {
          // Adicionar o event ao click do botão fechar na consulta. [x]
          $('#Win'+janela.nmjanela).parent().find("a[aria-label*='Close']").on('click', function() {
            setZIndexCorrectly();
          });
          // Adicionar o event ao click do fechar
          $('#Win'+janela.nmjanela).find('#BtnFechar').on('click', function() {
            setZIndexCorrectly();
          });
        }, 500);
      }

      //Montando o Botão da Barra de Ferramentas
      if (!($("#btn"+janela.nmjanela).length)){
        var alt = janela.dstitulo;
        var strDsTitulo = "";

        if (alt.length > 22){
          strDsTitulo = alt.substring(0,24)+'...';
        }
        else{
          strDsTitulo = alt;
        }

        var MenuWindow = $("#MenuJanelas").data("kendoMenu");

        MenuWindow.append([
          {
            text: '<button class="k-button" onClick="RestoreWindow(\''+janela.nmjanela+'\')">'+strDsTitulo+'</button>',
            encoded: false,
            attr: {
              'id': 'btn'+janela.nmjanela,
              'title': alt,
              'role': "img"
            },

          }
        ]);

        $("#MenuJanelas").kendoMenu({scrollable: true});

      }

      if(FlModal == false && janela.flmaximizada == 'true'){
        $('#Win'+janela.nmjanela).data("kendoWindow").open();
      }

      // setTimeout responsavel por setar o z-index do menu corretamente ao fechar uma janela de cadastro pelo x (Fechar)
      // botão superior direito
      setTimeout(function() {

        // Percorre as janelas abertas ...
        $('.k-widget.k-window .k-window-titlebar').each(function(idx, obj) {

          // Procura pela janela de cadastro
          if( obj.children[0].id.indexOf('Cadastro') > 0 ) {
            // valida se encontrou mesmo a tela
            if( obj.children[1] !== undefined ) {
              // pega o botão x (Fechar) e adiciona o evento do click
              obj.children[1].children[0].addEventListener('click', function() {
                // Altera o z-index do menu
                setZIndexCorrectly();
              }, true);
            }
          }

        });

        // setTimeout responsavel por setar corretamento o label dos botões auxiliares de janela no canto superior direito
        setTimeout(function(){
          $($('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").children()[1]).attr("role","img");
          $($('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").children()[1]).attr("aria-label","");
          $($('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").children()[1]).attr("title","Minimizar");
          
          $($('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").children()[2]).attr("role","img");
          $($('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").children()[2]).attr("aria-label","");
          $($('#Win'+janela.nmjanela).data("kendoWindow").wrapper.find(".k-window-actions").children()[2]).attr("title","Fechar");
        },300);
      }, 300);
    }
  });

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que restaura as janelas ao Clicar nos botões da barra de Janelas
//-----------------------------------------------------------------------------------------------------------------//
function RestoreWindow(nmjanela){
  $('#Win'+nmjanela).data("kendoWindow").open();
  setZIndexCorrectly();
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Função que seta o index do dropdown do menu
//-----------------------------------------------------------------------------------------------------------------//
function setZIndexCorrectly() {
  setTimeout(function() {

    var maxZIndexScreen = 10001;
    $('#DivCentro #DivWindowArea > div').each(function(idx, objMenu) {
      if( objMenu.style.zIndex > maxZIndexScreen ) {
        maxZIndexScreen = parseInt(objMenu.style.zIndex);
      }
    });

    if( $('.k-overlay').length === 1 ) {
      maxZIndexScreen += 1;
    }

    $('#KndMenu')[0].style.zIndex = maxZIndexScreen;

  }, 250);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função para abrir janela de Forma Manual, sem que se busque do cadastro de Janelas
//-----------------------------------------------------------------------------------------------------------------//
function OpenWindowManual(NmJanela,DsTitulo,DsUrl,NmIcone,FnOnClose,CdAltura,CdLargura,FlModal,FlArrastavel){
  if(FlModal == false){
    DsLocal = "#DivWindowArea";
  }
  else{
    DsLocal = "#Body";
    //$("#KndMenu").css("z-index","100");
  }

  $(DsLocal).append("<div id='Win"+NmJanela+"' class='k-background-window' style='padding-top: 0px;overflow:hidden'></div>");

  var Win = $('#Win'+NmJanela).kendoWindow({
    title: DsTitulo,
    content: DsUrl,
    appendTo: DsLocal,
    height: CdAltura,
    width: CdLargura,
    modal: FlModal,
    draggable: FlArrastavel,
    visible: false,
    resizable: false,
    actions: ["Minimizar","Close"],
    close: function(e) {
      setTimeout(function(){

        if (FnOnClose != ''){
          FnOnClose.call();
        }

        Win.data("kendoWindow").destroy();
        $("#btn"+NmJanela).remove();
        //Verificar se não existe nenhuma outra janela Modal antes de alterar o Z-Index do Menu
        //$("#KndMenu").css("z-index","11000");
      }, 200);
    }
  });


  //Ao Clicar no Botão de Minimizar
  $('#Win'+NmJanela).data("kendoWindow").wrapper.find(".k-i-minimizar").click(function(e) {
    $('#Win'+NmJanela).parent('.k-widget .k-window').hide('slow');
  });

  //Adicionando o Icone a Janela
  $('#Win'+NmJanela).data("kendoWindow").wrapper.find(".k-window-title").prepend("<span class='k-i-window "+NmIcone+"' data-view='"+NmJanela+"'></span>");

  //Montando o Botão da Barra de Ferramentas
  if (!($("#btn"+NmJanela).length)){
    var alt = DsTitulo;
    var text = "";

    if (alt.length > 22){
      text = alt.substring(0,24)+'...';
    }
    else{
      text = alt;
    }

    var s = $('<button id="btn'+NmJanela+'" type="button" style="margin-left: 2px;">'+alt+'</button>').appendTo($('#DivWindowBar')).html(text);
    $("#btn"+NmJanela).kendoButton();
    s.bind('click', {w:this}, function(e){
      $('#Win'+NmJanela).data("kendoWindow").open();
    });
  }

  if (FlModal == false){
    $('#Win'+NmJanela).data("kendoWindow").open();
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função para retornar o mês por extenso
//-----------------------------------------------------------------------------------------------------------------//
function mesExtenso(cdMes){
  var arrMes = [null,'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  return arrMes[cdMes];
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Abre a tela de Login do Sistema caso tenha expirado a seção
//-----------------------------------------------------------------------------------------------------------------//
function ReLogin(){
  //$("#KndMenu").css("z-index","100");
  $('#WinReLogin').kendoWindow({
    title: 'Login de Acesso',
    resizable: true,
    modal: true,
    draggable: true,
    width: 353,
    height: 454,
    content: 'sistema/view/login/viwReLogin.php',
    actions: []
  }).data("kendoWindow").center().open();
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que formata uma data de forma inverssa ao que chegou de entrada
//Entrada: 21/12/2017 Saída 2017-12-21
//Entrada: 2017-12-21 Saída 21/12/2017
//-----------------------------------------------------------------------------------------------------------------//
function FormatDate(strParamDate){
  //Verificando o formato de Entrada
  var strDate = strParamDate;
  var strTest = strDate.substring(2,3);
  var strResult = "";

  if (strTest == "/"){ //Deve retornar aaaa-mm-dd
    strResult = strDate.substring(6,10)+"-"+strDate.substring(3,5)+"-"+strDate.substring(0,2);
  }
  else{ //Deve Retornar dd/mm/aaaa
    strResult = strDate.substring(8,10)+"/"+strDate.substring(5,7)+"/"+strDate.substring(0,4);
  }

  return strResult;
}

//-----------------------------------------------------------------------------------------------------------------//
// Função que verifica os privilégios para botões
// @param Fltipo(Char(1)) -> Tipo de Botão [B]Button [T]Tool Button
// @param NmForm(String) -> Nome do Form (Obs. caso seja FlTipo "T" deverá ser adicionado o nome da barra de ações Ex:"#frmConsultaCidade #BarAcoes")
// @param NmButton(String) -> Nome do Botão
// @param IdRotina(Integer) -> Id da Rotina
// @param FlTipoAcesso(Char(1)) -> Flag do Tipo de acesso [C]Consultar [I]Inclusão [A]Alteração [E]Exclusão
//-----------------------------------------------------------------------------------------------------------------//
function GetAccess(Fltipo,NmForm,NmButton,IdRotina,FlTipoAcesso){
  //Verificando o Tipo
  if (Fltipo == "T"){ //Caso seja um Botão da Barra de Ações

    //Buscando o Privilégio para o Id da Rotina e Tipo de Acesso
    $.ajax({
      url: "sistema/controller/privilegio/ctrPrivilegio.php?action=GetAccess&idRotina="+IdRotina+"&",
      dataType: "json",
      method: "GET",
      success: function(data){

        if (FlTipoAcesso == "C"){//Condição para Consulta
          if (data.flconsulta == "S")
            $(NmForm).data("kendoToolBar").enable(NmButton, true);
          else
            $(NmForm).data("kendoToolBar").enable(NmButton, false);
        } else if (FlTipoAcesso == "I"){//Condição para Inclusão
          if (data.flinclusao == "S")
            $(NmForm).data("kendoToolBar").enable(NmButton, true);
          else
            $(NmForm).data("kendoToolBar").enable(NmButton, false);
        } else if (FlTipoAcesso == "A"){//Condição para Alteração
          if (data.flalteracao == "S")
            $(NmForm).data("kendoToolBar").enable(NmButton, true);
          else
            $(NmForm).data("kendoToolBar").enable(NmButton, false);
        } else if (FlTipoAcesso == "E"){//Condição para Exclusão
          if (data.flexclusao == "S")
            $(NmForm).data("kendoToolBar").enable(NmButton, true);
          else
            $(NmForm).data("kendoToolBar").enable(NmButton, false);
        } else if (FlTipoAcesso == "X"){//Condição Abertura da Tela de Edição (Usado pois o Usuário pode Ter Privilégios ou só de Alteração ou só de Exclusão de Um Registro)
          if (data.flalteracao == "S" || data.flexclusao == "S")
            $(NmForm).data("kendoToolBar").enable(NmButton, true);
          else
            $(NmForm).data("kendoToolBar").enable(NmButton, false);
        }

      }
    });

  }
  else{ //Caso seja um Botão Normal

  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Seta os Privilégios de Acordo com o Módulo e Rotina
//-----------------------------------------------------------------------------------------------------------------//
function SetAccess(Fltipo,NmForm,NmButton,BlStatus){
  var BlStatus = (BlStatus === true);
  if (Fltipo == "T"){ //Caso seja um Botão da Barra de Ações
    $(NmForm).data("kendoToolBar").enable(NmButton, BlStatus);
  }

  if (Fltipo == "B"){ //Caso seja um Botão Simples
    var Element = NmForm+' '+NmButton;
    $(Element).data("kendoButton").enable(BlStatus);
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função para adicionar Zeros a Frente de Um numero
//-----------------------------------------------------------------------------------------------------------------//
function lPad(value, length) {
  return (value.toString().length < length) ? lPad("0"+value, length):value;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que ajusta o tipo de condições de acordo com o tipo de campo do Filtro
//-----------------------------------------------------------------------------------------------------------------//
function SetPeriodoByTipo(objResult,objElement){


  var FlTipoPeriodo = objElement.value();

  switch (FlTipoPeriodo) {
    case 'M': //Mensal
      var optData = [
                      {value: "", text: ""},
                      {value: "1", text: "Janeiro"},
                      {value: "2", text: "Fevereiro"},
                      {value: "3", text: "Março"},
                      {value: "4", text: "Abril"},
                      {value: "5", text: "Maio"},
                      {value: "6", text: "Junho"},
                      {value: "7", text: "Julho"},
                      {value: "8", text: "Agosto"},
                      {value: "9", text: "Setembro"},
                      {value: "10", text: "Outubro"},
                      {value: "11", text: "Novembro"},
                      {value: "12", text: "Dezembro"}
                    ];
      break;
    case 'B': //Bimestral
      var optData = [
                      {value: "", text: ""},
                      {value: "1", text: "1º Bimestre"},
                      {value: "2", text: "2º Bimestre"},
                      {value: "3", text: "3º Bimestre"},
                      {value: "4", text: "4º Bimestre"},
                      {value: "5", text: "5º Bimestre"},
                      {value: "6", text: "6º Bimestre"}
                    ];
      break;
    case 'T': //Trimestral
      var optData = [
                      {value: "", text: ""},
                      {value: "1", text: "1º Trimestre"},
                      {value: "2", text: "2º Trimestre"},
                      {value: "3", text: "3º Trimestre"},
                      {value: "4", text: "4º Trimestre"}
                    ];
      break;
    case 'Q': //Quadrimestral
      var optData = [
                      {value: "", text: ""},
                      {value: "1", text: "1º Quadrimestre"},
                      {value: "2", text: "2º Quadrimestre"},
                      {value: "3", text: "3º Quadrimestre"}
                    ];
      break;
    case 'S': //Semestral
      var optData = [
                      {value: "", text: ""},
                      {value: "1", text: "1º Semestre"},
                      {value: "2", text: "2º Semestre"}
                    ];
      break;
    case 'A': //Anual
      var optData = [
                      {value: "", text: ""},
                      {value: "1", text: "Exercício Atual"}
                    ];
      break;
  }

  objResult.kendoDropDownList({
     dataTextField: "text",
     dataValueField: "value"
  });

  objResult.data("kendoDropDownList").dataSource.data(optData);
  objResult.data("kendoDropDownList").dataSource.query();
  objResult.data("kendoDropDownList").select(0);

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Funçao que retira os pontos de um valor e troca a vírgula por ponto
//Autor: Jonny Gubler
//Entrada: 1.235,75
//Saída: 1235.75
//-----------------------------------------------------------------------------------------------------------------//
function FmtVlrToFloat(valor) {
  valor = valor.replace('.','');
  valor = valor.replace('.','');
  valor = valor.replace('.','');
  valor = valor.replace('.','');
  valor = valor.replace('.','');
  valor = valor.replace('.','');
  valor = valor.replace('.','');
  valor = valor.replace('.','');
  valor = valor.replace(',','.');
  return valor;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Funçao troca o ponto por vírgula e adiciona pontos para as centenas, milhares etc
//Autor: Jonny Gubler
//Entrada: 1235.25
//Saída: 1.235,25
//-----------------------------------------------------------------------------------------------------------------//
function FmtVlrToString(valor){
  if (valor){
    valor = Math.round(valor*Math.pow(10,2))/Math.pow(10,2);
    x = 0;
    if(valor<0) {
      valor = Math.abs(valor);
      x = 1;
    }
    if(isNaN(valor)) valor = "0";
      cents = Math.floor((valor*100+0.5)%100);
    valor = Math.floor((valor*100+0.5)/100).toString();
    if(cents < 10) cents = "0" + cents;
      for (var i = 0; i < Math.floor((valor.length-(1+i))/3); i++)
         valor = valor.substring(0,valor.length-(4*i+3))+'.'
               +valor.substring(valor.length-(4*i+3));
    ret = valor + ',' + cents;
    if (x == 1) ret = ' - ' + ret;
    return ret;
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que formata uma data da forma inversa independente da entrada
//Ex.: Entrada 01/05/2000 Saída 2000-05-01
//     Entrada 2000-05-01 Saída 01/05/2000
//-----------------------------------------------------------------------------------------------------------------//
function FmtData(strParamDate){
  //Verificando o formato de Entrada
  var strDate = strParamDate;
  var strTest = strDate.substring(2,3);
  var strResult = "";

  if (strTest == "/"){ //Deve retornar aaaa-mm-dd
    strResult = strDate.substring(6,10)+"-"+strDate.substring(3,5)+"-"+strDate.substring(0,2);
  }
  else{ //Deve Retornar dd/mm/aaaa
    strResult = strDate.substring(8,10)+"/"+strDate.substring(5,7)+"/"+strDate.substring(0,4);
  }

  return strResult;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Funçao que valida se a Data é válida
//@autor Jonny Gubler
//@params elemento -> Objeto input
//@example onBlur(ValidaData(this,this.value()))
//-----------------------------------------------------------------------------------------------------------------//
function ValidaData(campo,valor) {
  var date=valor;
  var ardt=new Array;
  var ExpReg=new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}");
  ardt=date.split("/");
  erro=false;

  if (campo.value != ""){
    if ( date.search(ExpReg)==-1){
      erro = true;
      }
    else if (((ardt[1]==4)||(ardt[1]==6)||(ardt[1]==9)||(ardt[1]==11))&&(ardt[0]>30))
      erro = true;
    else if ( ardt[1]==2) {
      if ((ardt[0]>28)&&((ardt[2]%4)!=0))
        erro = true;
      if ((ardt[0]>29)&&((ardt[2]%4)==0))
        erro = true;
    }
    if (erro) {
      (new FrontBox).warning("A Data informada é inválida!").callback(function(){
        setTimeout(campo.focus(),100);
      });
    }
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Funçao que valida se o CPF é válido
//@autor Jonny Gubler
//@params elemento -> Objeto input
//@example onBlur(ValidaCpf(this))
//-----------------------------------------------------------------------------------------------------------------//
function ValidaCpf(elemento, callBack) {

    var teste = 0;

    var blUseCallBack = ( typeof callBack === 'function' );

    var cpf          = (blUseCallBack) ? elemento.value()       : elemento.value;
    var strIdElement = (blUseCallBack) ? elemento.element[0].id : elemento.id;

    if (cpf != ''){
      cpf = cpf.replace(/[^\d]+/g,'');

      if(cpf == '') return;

      // Elimina CPFs invalidos conhecidos
      if (cpf.length != 11 ||
          cpf == "00000000000" ||
          cpf == "11111111111" ||
          cpf == "22222222222" ||
          cpf == "33333333333" ||
          cpf == "44444444444" ||
          cpf == "55555555555" ||
          cpf == "66666666666" ||
          cpf == "77777777777" ||
          cpf == "88888888888" ||
          cpf == "99999999999")
          teste = 1;

      // Valida 1o digito
      add = 0;
      for (i=0; i < 9; i ++)
          add += parseInt(cpf.charAt(i)) * (10 - i);
      rev = 11 - (add % 11);
      if (rev == 10 || rev == 11)
          rev = 0;
      if (rev != parseInt(cpf.charAt(9)))
          teste = 1;

      // Valida 2o digito
      add = 0;
      for (i = 0; i < 10; i ++)
          add += parseInt(cpf.charAt(i)) * (11 - i);
      rev = 11 - (add % 11);
      if (rev == 10 || rev == 11)
          rev = 0;
      if (rev != parseInt(cpf.charAt(10)))
          teste = 1;

    if (teste > 0){
      (new FrontBox).warning("&raquo; O <strong>CPF</strong> informado é inválido!").callback(function(){
        setTimeout(strIdElement+'.focus()',100);
      });
    }
    else if( blUseCallBack ) {
      callBack();
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Funçao que valida se o CNPJ é válido
//@autor Jonny Gubler
//@params elemento -> Objeto input
//@example onBlur(ValidaCnpj(this))
//-----------------------------------------------------------------------------------------------------------------//
function ValidaCnpj(elemento, callBack, blShowMessage = true) {

  var blUseCallBack = ( typeof callBack === 'function' );

  var cnpj         = (blUseCallBack) ? elemento.value()       : elemento.value;
  var strIdElement = (blUseCallBack) ? elemento.element[0].id : elemento.id;
  var blOk         = true;

  if (cnpj != ""){
    var valida = new Array(6,5,4,3,2,9,8,7,6,5,4,3,2);
    var dig1= new Number;
    var dig2= new Number;

    exp = /\.|\-|\//g
    cnpj = cnpj.toString().replace( exp, "" );

    cnpj = (cnpj.indexOf('_') > -1) ? '00000000000000' : cnpj;

    var digito = new Number(eval(cnpj.charAt(12)+cnpj.charAt(13)));

    for(i = 0; i<valida.length; i++){
      dig1 += (i>0? (cnpj.charAt(i-1)*valida[i]):0);
      dig2 += cnpj.charAt(i)*valida[i];
    }
    dig1 = (((dig1%11)<2)? 0:(11-(dig1%11)));
    dig2 = (((dig2%11)<2)? 0:(11-(dig2%11)));

    if(((dig1*10)+dig2) != digito){
      blOk = false;
      if( blShowMessage ) {
        (new FrontBox).warning("&raquo; O <strong>CNPJ</strong> informado é inválido!").callback(function(){
          setTimeout(elemento.id+'.focus()',100);
        });
      }
    }
    else if(cnpj == "00000000000000"){
      blOk = false;
      if( blShowMessage ) {
        (new FrontBox).warning("&raquo; O <strong>CNPJ</strong> informado é inválido!").callback(function(){
          setTimeout(elemento.id+'.focus()',100);
        });
      }
    }

    if( blUseCallBack ) {
      callBack(blOk);
    }

  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Funçao que Valida se o Email é válido
//@autor Jonny Gubler
//@params elemento -> Objeto input
//@example onBlur(ValidaEmail(this))
//-----------------------------------------------------------------------------------------------------------------//
function ValidaEmail(elemento){
  mail = elemento.value;
  if(mail != ""){
    var er = RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if(er.test(mail) == false){
      (new FrontBox).warning("O E-mail informado é inválido!").callback(function(){
        setTimeout(elemento.id+'.focus()',100);
      });
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------//


//-----------------------------------------------------------------------------------------------------------------//
//Função para Centralizar Janelas que não sejam Modais e Não sejam Maximizadas
//Atenção, Utilizar esta função apenas para estes casos.
//-----------------------------------------------------------------------------------------------------------------//
function CenterWindow(StrWindowName){
  var top = parseFloat($('#DivWindowArea').height()/2) - parseFloat($('#'+StrWindowName).parent().height()/2);
  var left = parseFloat($('#DivWindowArea').width()/2) - parseFloat($('#'+StrWindowName).parent().width()/2);
  $('#'+StrWindowName).parent().css({top: top,left: left});
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Instancia o Componente de Editor
//-----------------------------------------------------------------------------------------------------------------//
function CreateEditor(strNmRotina,strNmImput,arrTemplates){

  //Verificando se já existe editor ativo com o mesmo nome
  var objEditor = tinyMCE.get(strNmImput);
  if(objEditor !== null ) {
    objEditor.remove();
  }

  var objEditor = tinyMCE.init({
    selector: '#frm'+strNmRotina+' #'+strNmImput,
    height: 100,
    width : '100%',
    theme: 'modern',
    language_url : 'js/tinymce/pt_BR.js',
    statusbar: false,
    language : 'pt_BR',
    plugins: 'visualblocks code print preview searchreplace autolink directionality visualblocks visualchars fullscreen link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount colorpicker textpattern help paste noneditable',
    toolbar1: 'styleselect |sizeselect fontselect fontsizeselect bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | template',
    image_advtab: true,
    noneditable_noneditable_class: "divNotEditable",
    fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 24pt 36pt",
    templates: arrTemplates,
    external_plugins: { "nanospell": "https://sistema.govgestao.com.br/js/tinymce/nanospell/plugin.js" },
    nanospell_server:"php",
    nanospell_dictionary: "pt_br",
    nanospell_ignore_block_caps: true,
    content_css: [
      'css/reports.css', 'css/libreport.css'
    ],
    paste_data_images: true,
    images_upload_handler: function (blobInfo, success, failure) {
      success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
    },
    style_formats: [
      {title: 'Texto Não Formatado', selector:'p', classes:'pgEditorNotFormated'},
      //{title: 'Parágravo', selector:'p', classes:'pgEditorIndent'},
      {title: 'Parágrafo', selector:'p', styles:{'text-indent': '50px'}}, //inserindo por conta da exportação para Word
      {title: 'Quadro', selector:'div', classes:'pgEditorBox'},
      {title: 'Blocks', items: [
        { title: 'p', block: 'p' },
        { title: 'div', block: 'div' },
        { title: 'pre', block: 'pre' }
      ]},
    ],
    table_default_styles: { //inserindo por conta da exportação para Word 
      'border-collapse': 'collapse',
      'width': '100%',
      'border': '1px solid black',
    },
    init_instance_callback : function(){

      resizeEditor(strNmRotina,strNmImput);

    },
  });

  return objEditor;

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Instancia o Componente de Editor
//-----------------------------------------------------------------------------------------------------------------//
function CreateEditorIN20(strNmRotina,strNmImput,arrTemplates){

  //Verificando se já existe editor ativo com o mesmo nome
  var objEditor = tinyMCE.get(strNmImput);
  if(objEditor !== null ) {
    objEditor.remove();
  }

  var objEditor = tinyMCE.init({
    selector: '#frm'+strNmRotina+' #'+strNmImput,
    height: 100,
    width : '100%',
    theme: 'modern',
    language_url : 'js/tinymce/pt_BR.js',
    statusbar: false,
    language : 'pt_BR',
    convert_urls: false,
    plugins: 'visualblocks code print preview searchreplace autolink directionality visualblocks visualchars fullscreen link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount colorpicker textpattern help paste image',
    toolbar1: 'styleselect |sizeselect fontselect fontsizeselect bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | template',
    image_advtab: true,
    fontsize_formats: "8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 24pt 36pt",
    templates: arrTemplates,
    content_css: [
      'css/reports.css', 'css/libReport.css'
    ],
    paste_data_images: true,
    style_formats: [
      {title: 'Texto Não Formatado', selector:'p', classes:'pgEditorNotFormated'},
      {title: 'Parágrafo', selector:'p', classes:'pgEditorIndent'},
      {title: 'Quadro', selector:'div', classes:'pgEditorBox'},
      {title: 'Blocks', items: [
        { title: 'p', block: 'p' },
        { title: 'div', block: 'div' },
        { title: 'pre', block: 'pre' }
      ]},
    ],
    init_instance_callback : setTimeout(function(){resizeEditor(strNmRotina,strNmImput)}, 500)
  });

  return objEditor;

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Instancia o Componente de Editor para envio de Emails
//-----------------------------------------------------------------------------------------------------------------//
function CreateEditorEmail(strNmRotina,strNmImput,arrTemplates){

  //Verificando se já existe editor ativo com o mesmo nome
  var objEditor = tinyMCE.get(strNmImput);
  if(objEditor !== null ) {
    objEditor.remove();
  }

  var objEditor = tinyMCE.init({
    selector: '#frm'+strNmRotina+' #'+strNmImput,
    height: 300,
    menubar : false,
    width : '100%',
    theme: 'modern',
    language_url : 'js/tinymce/pt_BR.js',
    statusbar: false,
    language : 'pt_BR',
    convert_urls: false,
    paste_data_images: true,
    plugins: [
    'advlist autolink lists link image charmap print preview anchor textcolor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table contextmenu paste code help wordcount'
    ],
    toolbar: 'bold italic forecolor backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
    image_advtab: true,
    templates: arrTemplates,
    //init_instance_callback : setTimeout(function(){resizeEditor(strNmRotina,strNmImput)}, 500)
  });

  return objEditor;

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Exibe as Propriedades da Janela e da Rotina
//-----------------------------------------------------------------------------------------------------------------//
function ShowWindowDetail(event,nmjanela,idrotina,nmview=""){
  if(event.ctrlKey && event.keyCode==120){
    var strIdJanela = $("#Win"+nmjanela).attr("data-windowid");
    var strIdRotina = idrotina;
    var strFlTecnico = "N";
    var strNmRotina = "";
    var strMessage = "";


    //Buscando os dados da Janela
    $.ajax({
      dataType: "json",
      url: "sistema/controller/janela/ctrJanela.php?action=GetWindowProperties",
      data:{
        idJanela: strIdJanela
      },
      success: function(jsnJanela){
        strNmJanela = jsnJanela.nmjanela;

        //Buscando os dados da Rotina
        $.ajax({
          dataType: "json",
          url: "sistema/controller/rotina/ctrRotina.php?action=LoadProperties",
          data:{
            idRotina: strIdRotina
          },
          success: function(jsnData){
            strNmRotina = jsnData.nmrotina;
            strIdGrupoModuloRotina = jsnData.idgrupomodulorotina;
            strNmGrupoModuloRotina = jsnData.nmgrupomodulorotina;
            strFlTecnico = jsnData.fltecnico;

            var strView = nmview;
            var strView = strView.replace("/home/aplicacao/sisgov/", "");

            strMessage = strMessage+'<table width="100%" border="0" cellspacing="0" cellpadding="1" style="word-break: break-all;">';
            strMessage = strMessage+'  <tr><td style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size:11px;font-weight:bold;">Dados da Janela:</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace; font-size:11px; padding-left:15px">Id: '+strIdJanela+'</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Nome: '+jsnJanela.nmjanela+'</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Título: '+jsnJanela.dstitulo+'</td></tr>';

            if (strFlTecnico == 'S'){
              strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Url: '+jsnJanela.dsurl+'</td></tr>';
              strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Ação: '+jsnJanela.dsacao+'</td></tr>';
              strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Icone: '+jsnJanela.nmicone+'</td></tr>';
              strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px;">View: '+strView+'</td></tr>';
            }

            strMessage = strMessage+'  <tr><td style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size:11px;font-weight:bold;">Dados da Rotina:</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Id: '+strIdRotina+'</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Nome: '+strNmRotina+'</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size:11px;font-weight:bold;">Dados do Grupo:</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Id: '+strIdGrupoModuloRotina+'</td></tr>';
            strMessage = strMessage+'  <tr><td style="font-family: Courier New, Courier, monospace;font-size:11px; padding-left:15px">Nome: '+strNmGrupoModuloRotina+'</td></tr>';
            strMessage = strMessage+'</table>';

            DlgfInfo(strMessage);

          }
        });

      }
    });
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Formata a Máscara do Telefone de Acordo com o Tamanho (Para separar Fixo de Celular)
//-----------------------------------------------------------------------------------------------------------------//
function CheckFone(ObjectId){
  var strFone = $(ObjectId).data("kendoMaskedTextBox").value();
  if (strFone != ''){
    strFone = strFone.replace(/\D/g,"");
    var strLength = strFone.length;
    if (strLength <= 10)
      strFone = strFone.replace(/^(\d{2})(\d)/g,"($1) $2");
    else
      strFone = strFone.replace(/^(\d{2})(\d)/g,"($1)$2");
    strFone = strFone.replace(/(\d)(\d{4})$/,"$1-$2");
    $(ObjectId).data("kendoMaskedTextBox").value(strFone);
  }
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que Seleciona um Registro após Cadastrar o Mesmo
//-----------------------------------------------------------------------------------------------------------------//
function ChangeInfo(StrNmForm,StrNmFiltro,StrIdRegistro){

  //Verifica se a tela de consulta utiliza os campos antigos ou novos de filtro
  if($("#frm"+StrNmForm+" #filterField1")[0] === undefined){
    $("#frm"+StrNmForm+" #nmFiltro").data("kendoDropDownList").value(StrNmFiltro);
    $("#frm"+StrNmForm+" #nmFiltro").data("kendoDropDownList").trigger("change");
    $("#frm"+StrNmForm+" #dsArgumento1").data("kendoNumericTextBox").value(StrIdRegistro);
  }
  else {
    $("#frm"+StrNmForm+" #filterField1").data("kendoDropDownList").value(StrNmFiltro);
    $("#frm"+StrNmForm+" #filterField1").data("kendoDropDownList").trigger("change");
    $("#frm"+StrNmForm+" #filterValue1").data("kendoNumericTextBox").value(StrIdRegistro);
  }

  $("#frm"+StrNmForm+" #BtnPesquisar").click();

  setTimeout(function(){
    $("#frm"+StrNmForm+" #Grd"+StrNmForm).data("kendoGrid").select('tr:not(.k-grouping-row)');
    $("#frm"+StrNmForm+" #BtnSelecionar").click();
  }, 300);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função auxiliar para Setar a Classe de Obrigatoriedade e Habilitar ou Desabilitar Campos
//-----------------------------------------------------------------------------------------------------------------//
function SetRequired(objCampo,bolHabilitado,BolObrigatorio){

  objCampoKendo = kendo.widgetInstance(objCampo);

  if (objCampoKendo == undefined){ //Quando não forem campos do Kendo

    if (objCampo[0].multiple == true) { //Quando for Multiple Select

      //Verificando se o campo deve esta Habilitado ou Desabilitado
      if (bolHabilitado == true){
        objCampo.multipleSelect('enable');
        objCampo.multipleSelect('checkAll');
      }
      else{
        objCampo.multipleSelect('disable');
        objCampo.multipleSelect('uncheckAll');
      }

      //Verificando se o Campo é Obrigatório
      if (BolObrigatorio == true) {
        objCampo.parent().prev("td").addClass("k-required");
      }
      else{
        objCampo.parent().prev("td").removeClass("k-required");
      }

    }
    else{
      //Verificando se o campo deve esta Habilitado ou Desabilitado
      if (bolHabilitado == true){
        objCampo.attr('readonly', false);
        objCampo.removeClass("k-input-disabled");
      }
      else{
        objCampo.attr('readonly', true);
        objCampo.addClass("k-input-disabled");
      }

      //Verificando se o Campo é Obrigatório
      if (BolObrigatorio == true) {
        objCampo.parent().prev("td").addClass("k-required");
      }
      else{
        objCampo.parent().prev("td").removeClass("k-required");
      }
    }

  }
  else{

    strTipoCampo = objCampoKendo.ns;

    if (strTipoCampo = '.kendoDropDownList') {

      //Verificando se o campo deve esta Habilitado ou Desabilitado
      if (bolHabilitado == true){
        objCampo.data("kendoDropDownList").enable(true);
      }
      else{
        objCampo.data("kendoDropDownList").enable(false);
      }

      //Verificando se o Campo é Obrigatório
      if (BolObrigatorio == true) {
        objCampo.parent().parent().prev("td").addClass("k-required");
      }
      else{
        objCampo.parent().parent().prev("td").removeClass("k-required");
      }

    }

  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que seta o Tipo de Operador para as novas Consultas
//-----------------------------------------------------------------------------------------------------------------//
function SetOperator(strForm,objElement){

  /*****************************************************/
  /*Tipos disponíveis
  /*int -> Inteiro
  /*str -> String
  /*dat -> Date
  /*val -> Decimal
  /*****************************************************/

  var strDataType = objElement.dataItem().dataType;
  var objArgumento1 = $("#"+strForm+" #dsArgumento1");
  var objArgumento2 = $("#"+strForm+" #dsArgumento2");
  var strObjType = $("#"+strForm+" #nmFiltro").attr("data-role");

  var divArgumento = $("#"+strForm+" #divArgumento");

  var widget1 = kendo.widgetInstance(objArgumento1,kendo.ui);
  var widget2 = kendo.widgetInstance(objArgumento2,kendo.ui);

  if (widget1){widget1.destroy();}
  if (widget2){widget2.destroy();}

  var LastTabIndex = parseInt($("#"+strForm+" #flComparacao").parent().attr("tabindex"));
  var NextTabIndex = LastTabIndex+1;

  divArgumento.html('<input type="text" id="dsArgumento1" tabindex="-1" name="dsArgumento1" /> <input type="text" id="dsArgumento2" tabindex="-1" name="dsArgumento2"/>');

  $("#"+strForm+" #dsArgumento1").attr("tabindex",NextTabIndex);
  $("#"+strForm+" #dsArgumento1").prev().attr("tabindex",NextTabIndex);

  if (strDataType == 'integer'){

    var objInt1 = $("#"+strForm+" #dsArgumento1");
    var objInt2 = $("#"+strForm+" #dsArgumento2");

    var optData = [
                    {value: "eq", text: "Igual a"},
                    {value: "neq", text: "Diferente de"},
                    {value: "startswith", text: "Inicia Com"},
                    {value: "endswith", text: "Termina Com"},
                    {value: "contains", text: "Contenha"},
                    {value: "doesnotcontain", text: "Não Contenha"},
                    {value: "gt", text: "Maior Que"},
                    {value: "lt", text: "Menor Que"}
                  ];

    objInt1.kendoNumericTextBox({min: 0,format: "#"});
    objInt2.kendoNumericTextBox({min: 0,format: "#"});

    objInt2.data("kendoNumericTextBox").wrapper.hide();
  }

  if(strDataType == 'string'){

    var objStr1 = $("#"+strForm+" #dsArgumento1")
    var objStr2 = $("#"+strForm+" #dsArgumento2")

    var optData = [
                    {value: "contains", text: "Contenha"},
                    {value: "startswith", text: "Inicia Com"},
                    {value: "endswith", text: "Termina Com"},
                    {value: "doesnotcontain", text: "Não Contenha"},
                    {value: "neq", text: "Diferente de"},
                    {value: "eq", text: "Igual a"}
                  ];

    objStr1.kendoMaskedTextBox();
    objStr2.kendoMaskedTextBox();

    objStr1.closest("span.k-datepicker").width(150);
    objStr2.data("kendoMaskedTextBox").wrapper.hide();
  }

  if(strDataType == 'date'){
    var objDat1 = $("#"+strForm+" #dsArgumento1");
    var objDat2 = $("#"+strForm+" #dsArgumento2");

    var optData = [
                    {value: "eq", text: "Igual a"},
                    {value: "gt", text: "Maior que"},
                    {value: "lt", text: "Menor que"},
                    {value: "neq", text: "Diferente de"}
                  ];

    objDat1.kendoDatePicker({format:"dd/MM/yyyy"});
    objDat1.kendoMaskedTextBox({mask: '00/00/0000'});

    objDat2.kendoDatePicker({format:"dd/MM/yyyy"});
    objDat2.kendoMaskedTextBox({mask: '00/00/0000'});

    objDat2.data("kendoDatePicker").wrapper.hide();
  }

  if(strDataType == 'val'){

    var objVal1 = $("#"+strForm+" #dsArgumento1");
    var objVal2 = $("#"+strForm+" #dsArgumento2");

    var optData = [
                    {value: "eq", text: "Igual a"},
                    {value: "neq", text: "Diferente de"},
                    {value: "gt", text: "Maior Que"},
                    {value: "lt", text: "Menor Que"}
                  ];

    objVal1.kendoNumericTextBox({decimals: 2,spinners: false});
    objVal2.kendoNumericTextBox({decimals: 2,spinners: false});

    objVal1.closest("span.k-datepicker").width(150);
    objVal2.closest("span.k-datepicker").width(150);


    objVal2.data("kendoNumericTextBox").wrapper.hide();
  }

  var objComparacao = "";

  if (strObjType == "combobox"){
    objComparacao = $("#"+strForm+" #flComparacao").data("kendoComboBox");
  }
  else if (strObjType == "dropdownlist"){
    objComparacao = $("#"+strForm+" #flComparacao").data("kendoDropDownList");
  }

  objComparacao.dataSource.data(optData);
  objComparacao.dataSource.query();
  objComparacao.select(0);

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Carrega os Filtros para as novas Consultas
//-----------------------------------------------------------------------------------------------------------------//
function LoadFilter(formElement, filterElement){

  var arrFilter = [];

  $("#"+formElement+" #"+filterElement+" .filterItem" ).each(function(index) {

    intIndex = $(this).attr("data-value");

    var strFilterField = $("#"+formElement+" #filterField"+intIndex).data("kendoDropDownList").value();
    var strFilterOperator = $("#"+formElement+" #filterOperator"+intIndex).data("kendoDropDownList").value();
    var strFilterValue = $("#"+formElement+" #filterValue"+intIndex).val();
    var strFilterValue = $.trim(strFilterValue);

    if (strFilterValue != ''){
      arrFilter.push({field: strFilterField, operator: strFilterOperator, value: strFilterValue});
    }

  });

  return arrFilter;

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Definição do problema: Ao acessar uma tela pelo btnPesquisar (de qualquer consulta) é aberta uma consulta para selecionar o registro. Em alguns casos
// como a coluna de descrição/nome é definido com o widthGrid: '' (Vazio) pode acontecer da coluna não aparecer, dai foi feita essa validação.

// Valida se a coluna de descrição da consulta está sem width, caso sim, seta um valor padrão para garantir que o registro da coluna
// especifica apareça para o usuario.
//-----------------------------------------------------------------------------------------------------------------//
function ValidateColumnSize(strFormName) {

  var strTypeKendo = GetTypeSearch('frm'+strFormName, 'Grd'+strFormName);

  if( strTypeKendo != 'kendoTreeList' ) {

    var objGrdQuery  = $('#frm'+strFormName + ' #Grd'+strFormName);
    var grid         = objGrdQuery.data(strTypeKendo);
    var columnsGrid  = grid.columns;

    for(var i = 0; i < columnsGrid.length; i++) {
      var intWidthField = $('#frm'+strFormName+' th[data-field="'+columnsGrid[i].field+'"]').width();
      // Valida se a coluna não possui width e se a coluna no grid não está visivel
      if( (columnsGrid[i].width === undefined) && !(intWidthField > 0) ) {
        // Se cair aqui quer dizer que essa coluna não esta visivel para o usuario na consulta, por isso é setado o vlaor
        grid.resizeColumn(grid.columns[i], 200);
        break;
      }
    }

  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Adiciona os Botões no Grid de Exportação
//-----------------------------------------------------------------------------------------------------------------//
function LoadGridExportActions(strForm, strGrid, blFromConsulta) {
  
  // Pega o tipo da consulta se é grid ou treelist por exemplo
  var strTypeKendo = GetTypeSearch(strForm, strGrid);

  // Pega o objecto conforme o tipo
  var objGrid = $("#"+strForm+" #"+strGrid).data(strTypeKendo);

  var strFormName = strForm.replace('frm', '');

  // Se vier de uma tela de cadastro valida o tamanho da coluna
  if(!blFromConsulta) {
    ValidateColumnSize(strFormName);
  }

  // Valida se existe configuração para a tela atual
  var strClassBtnDelStateScreen = (!getBlHasStateScreen(strFormName)) ? ' k-state-disabled ' : '';

  var pagerElement = objGrid.pager;
  //var pagerElement = objGrid.pager.element;

  // Se for undefined quer dizer que a tela é um treelist
  if( pagerElement != undefined ) {
      
    pagerElement = pagerElement.element;

    if (!pagerElement.find(".pg-export-actions").length) {

      // Usado para criar os botoes de salvar e excluir o state da tela
      var strBtnSaveDeleteStateScreen = '';

      if(getBlUseStateScreen(strFormName) && blFromConsulta) {

        strBtnSaveDeleteStateScreen = '<div class="k-button" role="img" onclick="SaveStateScreen(\''+strForm+'\');" style="margin-left: 0px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Salvar configurações padrões da tela"><span class="k-pg-icon k-i-l1-c5"></span></div>'+
                                      '<div class="k-button'+strClassBtnDelStateScreen+'" role="img" onclick="DeleteStateScreen(\''+strForm+'\',\''+strGrid+'\');" id="deleteStateScreen" style="margin-left: 0px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Excluir configurações padrões da tela"><span class="k-pg-icon k-i-l9-c4"></span></div>';
      }

      var strExportActions = '';

      // Se for a consulta de pessoa não vamos criar a exportação para pdf e xls
      if( strFormName === 'ConsultaPessoa' ) {
        strExportActions = '<div class="pg-export-actions">'+strBtnSaveDeleteStateScreen+'<div>';
      }
      else {

        strExportActions = '<div class="pg-export-actions">'+
                           '<div class="k-button" role="img" onclick="ExportGridToPdf(\''+strForm+'\',\''+strGrid+'\')" style="margin-left: 5px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Exportar para Pdf"><span class="k-pg-icon k-i-l9-c8"></span></div>'+
                           '<div class="k-button" role="img" onclick="ExportGridToXls(\''+strForm+'\',\''+strGrid+'\')" style="margin-left: 0px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Exportar para Xls"><span class="k-pg-icon k-i-l12-c4"></span></div>'+
                           strBtnSaveDeleteStateScreen+
                           '<div>';
      }

      pagerElement.append(strExportActions);
    }
  }
  else {

    // Valida se a div com as ações ja existe, caso ainda nao foi criado cria...
    var blExistGridPager = $('#'+strForm+' #'+strGrid).find('[id="grid-pager-without-pagination"]').length > 0;
    if(!blExistGridPager) {

      var strExportActions = '<div id="grid-pager-without-pagination" class="k-pager-wrap k-grid-pager k-widget k-floatwrap" data-role="pager" style="text-align: right;position: absolute; width: 100%; bottom: 0px;">'+
                             '<div class="pg-export-actions" style="width: 100%;padding-right: 1px;">'+
                                '<div class="k-button" onclick="ExportGridToPdf(\''+strForm+'\',\''+strGrid+'\')" style="margin-left: 5px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Exportar para Pdf"><span class="k-pg-icon k-i-l9-c8"></span></div>'+
                                '<div class="k-button" onclick="ExportGridToXls(\''+strForm+'\',\''+strGrid+'\')" style="margin-left: 0px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Exportar para Xls"><span class="k-pg-icon k-i-l12-c4"></span></div>'+
                                '<div class="k-button" onclick="SaveStateScreen(\''+strForm+'\',\''+strGrid+'\')" style="margin-left: 0px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Salvar configurações padrões da tela"><span class="k-pg-icon k-i-l1-c5"></span></div>'+
                                '<div class="k-button'+strClassBtnDelStateScreen+'" onclick="DeleteStateScreen(\''+strForm+'\',\''+strGrid+'\')" id="deleteStateScreen" style="margin-left: 0px;padding-left: 4px !important;padding-right: 3px !important; padding-top: 3px !important; padding-bottom: 3px !important;" title="Excluir configurações padrões da tela"><span class="k-pg-icon k-i-l9-c4"></span></div>'+
                                '<div></div>'+
                               '</div>'+
                            '</div>';

      $('#'+strForm+' #'+strGrid).append(strExportActions);
    }

  }

  setCorrectHeightGrid(strFormName);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Seta o valor no grid para fazer a correção da altura
//-----------------------------------------------------------------------------------------------------------------//
function setCorrectHeightGrid(strQueryName) {

  var intGrid = $('#frm'+strQueryName+' #Grd'+strQueryName+'').height();
  //var intGridHeader = $('#frm'+strQueryName+' #Grd'+strQueryName+' .k-grid-header-wrap.k-auto-scrollable').height();
  var intGridHeader = $('#frm'+strQueryName+' #Grd'+strQueryName+' .k-grid-header-wrap').height();
  var intBarFooter = $('#frm'+strQueryName+' #Grd'+strQueryName+' .k-pager-wrap.k-grid-pager.k-widget.k-floatwrap').height();
  var intGridFooter = $('#frm'+strQueryName+' #Grd'+strQueryName+' .k-grid-footer').height();

  intGridFooter = ( parseInt(intGridFooter) > 0) ? (intGridFooter + 5) : 3;

  var intHeightGrid = ((intGrid - intGridHeader) - intBarFooter) - intGridFooter;

  $('#frm'+strQueryName+' #Grd'+strQueryName+' .k-grid-content.k-auto-scrollable').height(intHeightGrid);
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que retorna o tipo do grid. Ex.: Grid ou TreeList
//-----------------------------------------------------------------------------------------------------------------//
function GetTypeSearch(strForm, strGrid) {

  var objCurrent   = $("#"+strForm+" #"+strGrid);
  var strTypeKendo = objCurrent[0].dataset.role;

  if( strTypeKendo === 'grid' ) {
    strTypeKendo = 'kendoGrid';
  }
  else if( strTypeKendo === 'treelist' ) {
    strTypeKendo = 'kendoTreeList';
  }

  return strTypeKendo;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que Clica no pesquisar
//-----------------------------------------------------------------------------------------------------------------//
function dispatchClickButtonPesquisar(strForm) {

  var blEnable = $('#'+strForm+' .k-bg-blue.screen-filter-content #BarAcoes #BtnEditar').attr('class').indexOf('k-state-disabled') > 0;

  if( ! blEnable ) {
    var objBtnPesquisar = $('#'+strForm+' #BtnPesquisar');

    if( objBtnPesquisar.length ) {
      setTimeout(function() {
        objBtnPesquisar.click();
      }, 500);
    }
  }
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que Exporta o Conteudo de um Grid para Pdf
//-----------------------------------------------------------------------------------------------------------------//
function ExportGridToPdf(strForm, strGrid) {
  // Pega o tipo, se é grid ou listtree por exemplo
  var strTypeKendo = GetTypeSearch(strForm, strGrid);
  // Exporta para pdf
  $("#"+strForm+" #"+strGrid).data(strTypeKendo).saveAsPDF();
  
  dispatchClickButtonPesquisar(strForm);
}

//-----------------------------------------------------------------------------------------------------------------//
//Função que Exporta o Conteúdo de um Grid para Xls
//-----------------------------------------------------------------------------------------------------------------//
function ExportGridToXls(strForm,strGrid){
  // Pega o tipo, se é grid ou listtree por exemplo
  var strTypeKendo = GetTypeSearch(strForm, strGrid);  
  // Exporta para xls
  $("#"+strForm+" #"+strGrid).data(strTypeKendo).saveAsExcel();
  
  dispatchClickButtonPesquisar(strForm);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que seta as propriedades da exportação do Grid para Pdf
//-----------------------------------------------------------------------------------------------------------------//
function SetPdfOptions(strTitle){

  //Montando o Nome do Arquivo Pdf
  var strFileName =  strTitle.replace(/\s/g, '');

  var options = {
    author:"PontoGOV Sistemas Ltda",
    creator:"Sistema GOVGestão",
    date:new Date(),
    fileName: strFileName+".pdf",
    //title: strTitle,
    allPages: true,
    avoidLinks: true,
    paperSize: "A4",
    margin: { top: "3cm", left: "1cm", right: "1cm", bottom: "1cm" },
    landscape: true,
    repeatHeaders: true,
    template: $("#pdf-page-template").html(),
    scale: 0.6
  };
  
  return options;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Carrega os filtros extras para o array de filtros principais
//-----------------------------------------------------------------------------------------------------------------//
function loadFilterExtra(arrFilter, filterExtra) {

  for( var i = 0; i < filterExtra.length; i++ ) {
    arrFilter.push(filterExtra[i]);
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Esse cara realiza os filtros compostos da consulta juntando os filtros padroes e o filtro realizado pela coluna.
//-----------------------------------------------------------------------------------------------------------------//
function mountFilteredScreen(comesFrom, e, className, arrDataSource, DtsConsulta, filterExtra) {

  e.preventDefault();

  // filterDefault vem do filtro padrao da tela
  if( comesFrom === 'filterDefault' ) {
    // Carrega os filtros usados em tela
    var arrFilter = LoadFilter('frm'+className, 'flt'+className);
    // Carrega os filtros extras caso existir
    if(filterExtra != undefined) {
      loadFilterExtra(arrFilter, filterExtra);
    }
    // Seta o type no object, usado no controller
    setDataTypeObjectFilter(arrFilter, arrDataSource);
    // Pega o tipo de tela
    var strTypeKendo = GetTypeSearch('frm'+className, 'Grd'+className);
    // se for do tipo treelist
    if( strTypeKendo === 'kendoTreeList' ) {
      // Chama o controller e realiza os filtros...
      DtsConsulta.read(arrFilter);
    }
    else {
      // Chama o controller e realiza os filtros...
      DtsConsulta.filter(arrFilter);
    }
  }
  // filterColumn vem do filtro realiado na coluna do grid da consulta
  else if( comesFrom === 'filterColumn' ) {

    // Se nao existir filtro nao faz nada.
    if( e.filter == undefined ) {
      return;
    }
    // Pega os valores do filtro que foram selecionados
    var arrFiltersScreen = e.filter.filters;
    // Marca no objeto de onde esse filtro esta vindo. Necessario no controller para validacao de filtro
    for( var x = 0; x < arrFiltersScreen.length; x++ ) {
      arrFiltersScreen[x].comeTo = 'column';
    }

    // Pega os filtros padroes realiado em tela
    getFilterOnScreen(arrFiltersScreen, className);
    // Seta o type no object, usado no controller
    setDataTypeObjectFilter(arrFiltersScreen, arrDataSource);
    // Carrega os filtros extras caso existir
    if(filterExtra != undefined) {
      loadFilterExtra(arrFiltersScreen, filterExtra);
    }
    // Pega o tipo de tela
    var strTypeKendo = GetTypeSearch('frm'+className, 'Grd'+className);
    // se for do tipo treelist
    if( strTypeKendo === 'kendoTreeList' ) {
      // Chama o controller e realiza os filtros...
      DtsConsulta.read({
        filter: e.filter.filters
      });
    }
    else {
      // Chama o controller e realiza os filtros...
      DtsConsulta.filter({
        filter: e.filter.filters
      });
    }

    // Esconde o menu do filtro dropdown
    $(".k-animation-container").hide();
  }

  // Limpa os campos da visualização
  clearFieldsOnScreen( className, arrDataSource );

  // Desabilita o botão mostrar log da visualização
  disableButtonLog(className);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Limpa os campos da tela de visualização ao clicar no botão pesquisar
//-----------------------------------------------------------------------------------------------------------------//
function clearFieldsOnScreen( strScreenName, arrDataSource ) {

  var selectorPath = '#frm'+strScreenName;

  arrDataSource.forEach(function(tabName, indice, array) {
    // Pega o nome do campo atual
    var strCurrentField = '#' + arrDataSource[indice].name + 'Preview';

    if( treatBooleanValue(arrDataSource[indice].showPreview) ) {
      var objCurrentField = $( selectorPath + ' ' + strCurrentField);
      if( objCurrentField[0] != undefined ) {
        $( selectorPath + ' ' + strCurrentField).val('');
      }
    }
  });

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Desabilita o botão de acesso ao log do registro selecionado
//-----------------------------------------------------------------------------------------------------------------//
function disableButtonLog(className) {

  var objBtnInfoLog = ( $('#frm'+className+' #BtnInfoLogRegistroCliente').length === 1) ?
                        $('#frm'+className+' #BtnInfoLogRegistroCliente') :
                        $('#frm'+className+' #BtnInfoLogRegistro');

  if( objBtnInfoLog.length ) {
    objBtnInfoLog.addClass('k-state-disabled');
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Pega os filtros usados na tela e adiciona ao filtro da coluna da consulta
//-----------------------------------------------------------------------------------------------------------------//
function getFilterOnScreen(arrFiltersScreen, className) {
  //Pega os filtros usados na tela
  var arrFilter = LoadFilter('frm'+className, 'flt'+className);

  for(var i = 0; i < arrFilter.length; i++) {
    arrFiltersScreen.push(arrFilter[i]);
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Seta o type e alias nos objects para serem usados no controller
//-----------------------------------------------------------------------------------------------------------------//
function setDataTypeObjectFilter(arrFiltersScreen, arrDataSource) {
  /*
  Percorre o filtro usado em tela
  */
  for(var x = 0; x < arrFiltersScreen.length; x++) {
    var currentFilter = arrFiltersScreen[x];

    /*
    Percorre os campos instanciados na viw e compara os valores
    com o filtro setado em tela para pegar o type do object atual
    */
    for(var y = 0; y < arrDataSource.length; y++) {
      // Se o filtro extra tiver o mesmo nome que o campos do datasource
      if( arrDataSource[y]['name'] === currentFilter['field'] ) {

        // Se não foi informado no filtro pega do datasource
        if( currentFilter.type === undefined ) {
          currentFilter.type = arrDataSource[y]['type'];
        }

        // Se não foi informado no filtro pega do datasource
        if( currentFilter.alias === undefined ) {
          currentFilter.alias = arrDataSource[y]['alias'];
        }
        break;
      }
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Busca todos os elementos que terão tela de visualização
//-----------------------------------------------------------------------------------------------------------------//
function getAllElements( strScreenName ) {

  var arrTabPreview = [];

  $('#botton'+strScreenName+' #tabStrip'+strScreenName+' > ul').children("li").each(function() {
    /*
      Pega o id de todos os campos que terão um tab
    */
    arrTabPreview.push( $(this)[0].id );
  });

  return arrTabPreview;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Método responsavel por setar a altura da tab de preview
//-----------------------------------------------------------------------------------------------------------------//
function setHeightTabContent( strScreenName ) {

  var blUseStateScreenTabContent = getBlUseStateScreen(strScreenName);

  if(blUseStateScreenTabContent) {

    setHeightTabStripTreeList(strScreenName);

  }
  else if(!blUseStateScreenTabContent) {
    var strHeight = '130px';

    $('#botton'+strScreenName+' #tabStrip'+strScreenName).children("div").each(function(idx, objTabDados) {
      $('#' + objTabDados.id).css({
        'height': strHeight,
        'padding': '3px'
      });
    });
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Seta o height da tabstrip do preview do tipo treelist
//-----------------------------------------------------------------------------------------------------------------//
function setHeightTabStripTreeList(strScreenName) {
  var arrIndiceTabTreeList = [];

  // Percorre as divs com ids tabDados... para identificar qual é treelist
  $('#frm'+strScreenName+' #botton'+strScreenName+' #tabStrip'+strScreenName+' > div').each(function(idx, objTabStrip) {
    // se é treelist, insere o indice da tab no array
    if( objTabStrip.dataset.role === 'treelist' ) {
      arrIndiceTabTreeList.push(idx);
    }
  });

  // percorre a lista existente
  $('#frm'+strScreenName+'  #botton'+strScreenName+' #tabStrip'+strScreenName+' > ul > li').each(function(idx, objTabDados) {
    // verifica se o indice atual esta contido no array da lista do treelist
    if( arrIndiceTabTreeList.includes(idx) ) {
      // se sim, adiciona o evento de click
      $('#'+objTabDados.id).click(function() {
        // percorre as divs com o conteudo do preview
        $('#frm'+strScreenName+' #botton'+strScreenName+' #tabStrip'+strScreenName+' > div').each(function(idx, objTabStrip) {
          // verifica se o indice da div atual esta contido no array com os indices do treelist
          if( arrIndiceTabTreeList.includes(idx) ) {

            setTimeout(function() {
              // pega o conteudo do preview que pe treelist
              var objCurrentBotton = $('#frm'+strScreenName+' #'+objTabStrip.id);
              // pega o estilo atual
              var strCurrentStyle = objCurrentBotton.attr('style');
              // adiciona novos estilo ao estilo atual
              strCurrentStyle += 'background-color: #FFF !important; overflow: hidden !important; padding: 0px 0px 0px 0px;';
              // seta o estilo na aba do preview
              objCurrentBotton.attr('style', strCurrentStyle);
              // seta a altura correta no preview que usa treelist
              $('#frm'+strScreenName+' #'+objTabStrip.id+' .k-grid-content.k-auto-scrollable').css({'height' : 'calc(100% - 18px)'});
            }, 50);

          }
        });
      });
    }
  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que faz a chamada para algumas propriedades serem setadas na tab strip
//-----------------------------------------------------------------------------------------------------------------//
function setSomeThings( strScreenName ) {

  setHeightTabContent( strScreenName );

  //Seta a altura máxima do botton
  setMaxHeightBotton( strScreenName );

  //Faz o resize
  $(window).resize(function() {
    ResizeGridToPreview( strScreenName );
  });
  //Faz o resize
  ResizeGridToPreview( strScreenName );

  actionWindowTrigger( strScreenName );

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que faz os ajustes de posicionamento na tela
//-----------------------------------------------------------------------------------------------------------------//
function actionWindowTrigger( strScreenName ) {
  if( ! getBlUseStateScreen( strScreenName ) ) {
    setTimeout(function() {
      $(window).trigger('resize');
    }, 450);
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que seta o max-height da div botton
//-----------------------------------------------------------------------------------------------------------------//
function setMaxHeightBotton( strScreenName ) {
  $('#frm'+strScreenName+' #botton'+strScreenName).css({ 'max-height': '550px' });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Seta o focus no ultimo campo do filtro
//-----------------------------------------------------------------------------------------------------------------//
function setFocusFirstField( strScreenName, intIndice ) {

  if( strScreenName != undefined ) {
    var strScreenCad = strScreenName.replace('Consulta', 'Cadastro');
    // Se foi chamado através de uma tela de cadastro nao precisa setar o field
    // pois a tela ativa é a de cadastro, não a de consulta
    if( $('#frm'+strScreenCad).length > 0 ) {
      return;
    }
  }
  // Se nao foi passado o nome da tela nao faz nada...
  else {
    return;
  }

  var strPath = '';
  intIndice   = 0;

  if( intIndice != undefined ) {
    if( intIndice > 0 ) {
      strPath = "#Win"+strScreenName+" #frm"+strScreenName+" #flt"+strScreenName+" #filterValue"+intIndice;
    }
    else {
      intIndice = $("#frm"+strScreenName+" #flt"+strScreenName+" > div:last").attr('data-value');
      strPath   = "#Win"+strScreenName+" #frm"+strScreenName+" #flt"+strScreenName+" #filterValue"+intIndice;
    }

    setTimeout(function() {

      var strTypeField  = $(strPath).attr('data-role');

      switch(strTypeField) {

        case 'numerictextbox':
          $(strPath).data("kendoNumericTextBox").focus();
        break;
        case 'datepicker':
          $(strPath).data("kendoDatePicker").element.focus();
        break;
        case 'timepicker':
          $(strPath).data("kendoTimePicker").element.focus();
        break;

        default:
          // Esse trecho de codigo faz com que o cursor fique no final da string qnd seta o focus
          $(strPath).focus();
          var strCurrentValue = $(strPath).val();
          $(strPath).val('');
          setTimeout(function() {
            $(strPath).val(strCurrentValue);
          }, 1);
      }

    }, 200);
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//  Faz o controle dos métodos para a criação dos campos na tela de visualização
//  Os campos serão criados dentro da area de visualização de acordo com
//  os objetos passados por parametro.

//  CUIDADO!!
//  ESSE MÉTODO DEVE SER CHAMADO 1 ÚNICA VEZ NA CONSULTA
//  ONDE AS TELAS DE VISUALIZAÇÕES SERÃO CRIADAS COM SUAS ABAS RESPECTIVAMENTE.

//  @param arrDataSource Array de objetos, cada objeto será 1 campo específico
//  @param screenName String com o nome da consulta atual da visualização
//-----------------------------------------------------------------------------------------------------------------//
function createScreenPreview(arrDataSource, strScreenName, blSetFocusFirst = true) {

  // Seta o focus no primeiro campo do filtro ao abrir a tela
  if( blSetFocusFirst ) {
    setFocusFirstField(strScreenName);
  }

  var arrOrderedValues = [];
  var arrTabPreview    = [];
  var strCreatedTable  = '';
  var strCurrentTable  = '';

  // Seta algumas coisas no preview
  setSomeThings( strScreenName );

  // Pega os indices das abas que irão existir, cada li ...
  arrTabPreview = getAllElements( strScreenName );

  for( var x = 0; x < arrTabPreview.length; x++ ) {
    /*
    Toda vez que iniciar o loop precisamos estar com essa variavel limpa
    para não duplicar registros nas abas.
    */
    strCreatedTable = '';

    // Ordena os objetos de acordo com o atributo positionPreview
    arrOrderedValues = sortsValues(arrDataSource, arrTabPreview[x]);

    // Se não existir elementos vamos para o próximo ...
    if( ! arrOrderedValues.length > 0 ) {
      continue;
    }

    for( var i = 0 ; i < arrOrderedValues.length; i++ ) {
      /*
        Se cair aqui, quer dizer que o valor positionPreview esta errado em
        algum objeto na consulta.
      */
      if( arrOrderedValues[i] === undefined ) {
        continue;
      }
      /*
        Se deve ser mostrado na tela de visualização vamos
        criar o campo ...
      */
      if( treatBooleanValue( arrOrderedValues[i].showPreview ) ) {
        strCurrentTable = createTableScreenPreview(arrOrderedValues[i], false, false);
      }

      // Será retornado um valor nesse campo se existir a proxima posição
      var swapped = null;

      /*
        Loop responsável por verificar se existe a ligação entre as informações
        da area de visualização
      */
      do {

        swapped = false;

        if( ( strCurrentTable !== '' ) && ( arrOrderedValues[i + 1] !== undefined ) ) {
          /*
            Se na proxima posição existir uma ligação com a posição anterior
            quer dizer que esses campos devem ser colocados na mesma tr da table

            Ligação: O próximo campo possui o atributo togetherPreview com o valor
            do atributo 'name' do campo anterior. Dessa forma ele sabe que os
            campos devem ficar na mesma TR.
          */
          if( ( arrOrderedValues[i + 1].togetherPreview === arrOrderedValues[i].name) && treatBooleanValue( arrOrderedValues[i + 1].showPreview ) ) {
            /*
              Se as 2 próximas colunas tirevem ligações entre si, quer dizer que será 1
              linha com 3 campos ...
            */
            var blUseTreeColumn = (
              ( arrOrderedValues[i + 2] !== undefined ) && ( arrOrderedValues[i + 2].togetherPreview === arrOrderedValues[i + 1].name ) );

            strCurrentTable += createTableScreenPreview(arrOrderedValues[i + 1], true, blUseTreeColumn);
            /*
              vamos apressar o contador em 1 posição pois já foi
              criado o próximo objeto...
            */
            ++i;
            swapped = true;
          }
        }

      } while( swapped );

      if( strCurrentTable !== '' ) {
        strCreatedTable += finalizesTableCreation(strCurrentTable);
      }
      /*
        Limpa a variavel para termos certeza que não aconteça algo de errado
        no caminho e duplique valores desnecessariamente.
      */
      strCurrentTable = '';
    }

    // Caso existir a variavel vamos criar os objetos em tela.
    if( strCreatedTable !== '' ) {
      $(getNameAppendTable(strScreenName, arrTabPreview[x])).append( strCreatedTable );
    }

    // Cria a ação do click no grid
    createCallClickGrid(arrDataSource, strScreenName, arrTabPreview[x]);
  }

  // Cria as abas na visualização
  createTabStrip( strScreenName );

  // Esconde as colunas do grid de acordo com os parametros passados no objeto
  hideColumnsGrid( arrDataSource, strScreenName );

  // Faz o ajuste do tamanho da janela
  actionWindowTrigger( strScreenName );

  // Cria o evento de click no botão do log de telas do sistema ...
  createClickButtonLog(strScreenName, arrTabPreview[0]);

  // Cria o evento de click no botão do log de telas ...
  createClickButtonLogCliente(strScreenName, arrTabPreview[0]);

  // Cria o splitter da consulta
  createSplitterQuery(strScreenName, arrDataSource[0]['cdalturafiltrotela'], arrDataSource[0]['cdalturavisualizacaotela']);

  // Inicia a estrutura para correto funcionamento do save do sort da tela
  initSortStructure();
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Aqui vamos verificar se existe o botão BtnInfoLogRegistro
// Esse botão deve existir somente na primeira aba de visualização e sera criado dinamicamente
// dentro da estrutura de criação de campos
//-----------------------------------------------------------------------------------------------------------------//
function createClickButtonLog(strScreenName, indiceTabPreview) {

  var btnInfoLogRegistro = $(getNameAppendTable(strScreenName, indiceTabPreview) + ' #BtnInfoLogRegistro');
  if( btnInfoLogRegistro[0] !== undefined ) {

    // Criar a ação para chamar a tela de logs do sistema...
    btnInfoLogRegistro.click(function() {

      // Altera para o nome da tabela. ex.: idcliente to tbcliente
      var strNameTable = $(this).data('nmTable');
      // Pega o nome da coluna. ex.: idcliente
      var idRegistro   = $(this).data('idRegistro');

      if( (parseInt(idRegistro) > 0) && (strNameTable != '') ) {
        OpenWindow(1556, false, 'winConsulta&nmTable='+strNameTable+'&idRegistro='+idRegistro);
      }

    });
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Aqui vamos verificar se existe o botão BtnInfoLogRegistroCliente
// Esse botão deve existir somente na primeira aba de visualização e sera criado dinamicamente
// dentro da estrutura de criação de campos
//-----------------------------------------------------------------------------------------------------------------//
function createClickButtonLogCliente(strScreenName, indiceTabPreview) {

  var btnInfoLogRegistroCliente = $(getNameAppendTable(strScreenName, indiceTabPreview) + ' #BtnInfoLogRegistroCliente');
  if( btnInfoLogRegistroCliente[0] !== undefined ) {

    // Criar a ação para chamar a tela de logs do db cliente...
    btnInfoLogRegistroCliente.click(function() {

      // Altera para o nome da tabela. ex.: idcliente to tbcliente
      var strNameTable = $(this).data('nmTable');
      // Pega o nome da coluna. ex.: idcliente
      var idRegistro   = $(this).data('idRegistro');

      if( (parseInt(idRegistro) > 0) && (strNameTable != '') ) {
        OpenWindow(1722, false, 'winConsulta&nmTable='+strNameTable+'&idRegistro='+idRegistro);
      }

    });
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Retorna o height que sera usado no grid da consulta
//-----------------------------------------------------------------------------------------------------------------//
function getHeightGridQuery(strScreenName) {

  if( getBlUseStateScreen(strScreenName) ) {
    return 'inherit';
  }
  else {
    return '283';
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Cria a tab strip na consulta. Seta os estilos css, etc ...
//-----------------------------------------------------------------------------------------------------------------//
function createTabStrip( strScreenName ) {

  var strFrmConsulta    = '#frm'    + strScreenName;
  var strBottonConsulta = '#botton' + strScreenName;
  var strButtonConsulta = $(strFrmConsulta + ' ' + strBottonConsulta + ' > div');

  if( strButtonConsulta[0] != undefined ) {
    var strIdTab = '#' + strButtonConsulta[0].id
    var strFieldTabStrip = strFrmConsulta + ' ' + strIdTab;

    $(strFieldTabStrip).kendoTabStrip({
      animation: false
    }).data("kendoTabStrip");
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Finaliza a criação das tables
//-----------------------------------------------------------------------------------------------------------------//
function finalizesTableCreation(strCurrentTable) {

  var strTable = '';

  strTable = ' <table style="width: 725px;" border="0" cellspacing="2" cellpadding="0"><tr> ';
  strTable += strCurrentTable;
  strTable += ' </tr></table> ';

  return strTable;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Ordena os objetos de acordo com o atributo positionPreview
//-----------------------------------------------------------------------------------------------------------------//
function sortsValues(arrDataSource, strTabName) {

  var arrValues = [];

  for( var i = 0 ; i < arrDataSource.length; i++ ) {
    /*
    Se existir os parametros de show e position do PREVIEW, então vamos
    guardar esse valor para dar inicio a criação da tela de visualização.
    */
    if( ( treatBooleanValue( arrDataSource[i].showPreview ) ) && ( parseInt(arrDataSource[i].positionPreview) > 0 ) && ( arrDataSource[i].indiceTabPreview === strTabName ) ) {
      arrValues[ arrDataSource[i].positionPreview-1 ] = arrDataSource[i];
    }
  }

  if( arrValues.length > 0 ) {
    return arrValues;
  } else {
    return [];
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Método que cria as linhas com o conteudo da visualização
//-----------------------------------------------------------------------------------------------------------------//
function createTableScreenPreview(objContent, blCompoundField, blUseTreeColumn) {

  var strTable           = '';
  var idItem             = objContent.name+'Preview';
  var strWidth           = treatsWidthValue(objContent.widthPreview) + 'px;';
  var strLabel           = objContent.label+':';
  var strStyleTdInput    = '';
  var strStyleTable      = ' style="width: 725px;" border="0" cellspacing="2" cellpadding="0" ';
  var strClassDefault    = ' k-textbox k-input-disabled ';
  var strStyleTdLabel    = ( !blCompoundField ) ? ' width: 120px; text-align:right; ' : ' text-align: right; ';
  var widthLabelPreview  = ( objContent.widthLabelPreview == undefined ) ? '120px' : objContent.widthLabelPreview+'px';
  var stStyleLabel       = ' style="width: '+widthLabelPreview+'; display: inline-block;" ';
  var typeFieldPreview   = objContent.typeFieldPreview;
  var styleDefault       = ' padding: 2px; ';

  if( blUseTreeColumn ) {
    strStyleTdInput = ' width: auto; ';
  } else {
    strStyleTdInput = ( !blCompoundField ) ? ' style="display: inline-flex;" ' : ' style="text-align: right; width: ' + strWidth+'"';
  }

  // Se for textarea vamos setar mais essa propriedade css
  if( objContent.typeFieldPreview === 'textarea' || typeFieldPreview === "html" ) {
    strStyleTdLabel += ' vertical-align: top; ';
  }

  // Concatena style as propriedades
  strStyleTdLabel = ' style=" ' + strStyleTdLabel + ' " ';

  strTable  = ' <td ' + strStyleTdLabel + '> ';
  strTable += ' <label ' + stStyleLabel + '>' + strLabel + '</label> ';
  strTable += ' </td> ';
  strTable += ' <td ' + strStyleTdInput + '> ';

  /*
    Verifica o tipo do campo.
    Se for html ou textarea, cria os campos de maneira diferente.
    Se não houver o tipo informado, gera o input padrão.
  */
  if( typeFieldPreview === "html"){
    var styleHtml = 'border-left-width: 4px !important; text-indent: 1px !important;';
    strTable += '<div id="' + idItem + '" style="' + styleHtml + styleDefault + 'width: 600px; height: 100px; overflow-y: scroll; border-radius: 4px; opacity: 0.6 !important; background-color: #e8e8e8!important;" class="' + strClassDefault + '"></div>';
  }
  else if( typeFieldPreview === "textarea" ) {
    var strHeight = treatsHeightValue(objContent.heightPreview) + 'px';
    strTable += ' <textarea tabindex="" id="' + idItem + '" name="' + idItem + '" class="k-textbox k-input-disabled" readonly="readonly" style="' + styleDefault + ' width: ' + strWidth + ';height: ' + strHeight + ';resize: none;"></textarea> ';
  }
  else {
    strTable += ' <input type="text" id="' + idItem + '" name="' + idItem + '" readonly="readonly" class="' + strClassDefault + '" style="' + styleDefault + ' width: ' + strWidth + '" value="" /> ';
  }

  // Cria o botão para acessar a consulta de logs no sistema ou no cliente (da acordo com a banco fonte dos dados)
  if( objContent.name === 'infologregistro' ) {
    strTable += '<span id="BtnInfoLogRegistro" style="cursor: pointer;width: 24px;height: 24px;margin-left: 5px;" title="Consultar Histórico Completo" data-role="button" class="k-button k-button-icon k-state-disabled" role="button" aria-disabled="false" tabindex="-1"><span class="k-sprite k-pg-icon k-i-l1-c2"></span></span>';
  }
  else if( objContent.name === 'infologregistrocliente' ){
    strTable += '<span id="BtnInfoLogRegistroCliente" role="img" style="cursor: pointer;width: 24px;height: 24px;margin-left: 5px;" title="Consultar Histórico Completo" data-role="button" class="k-button k-button-icon k-state-disabled" role="button" aria-disabled="false" tabindex="-1"><span class="k-sprite k-pg-icon k-i-l1-c2"></span></span>';
  }

  strTable += ' </td> ';

  return strTable;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Trata o valor do tamanho do campo para não haver estouro desnecessário ...
//-----------------------------------------------------------------------------------------------------------------//
function treatsWidthValue(widthPreview) {

  var intValue = null;

  if( widthPreview === undefined ) {
    intValue = 60;
  }
  else if( parseInt(widthPreview) >= 600 ) {
    intValue = 599;
  } else {
    intValue = widthPreview;
  }

  return intValue;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Faz o tratamento do valor da altura do campo
//-----------------------------------------------------------------------------------------------------------------//
function treatsHeightValue(heightPreview) {

  var intValue = null;

  if( heightPreview === undefined ) {
    intValue = 50;
  }
  else if( parseInt(heightPreview) > 100) {
    intValue = 100;
  } else {
    intValue = heightPreview;
  }

  return intValue;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Cria a chamada da função para o click do grid
//-----------------------------------------------------------------------------------------------------------------//
function createCallClickGrid(arrDataSource, strScreenName, indiceTabPreview) {
  var strCurrentFrm = '#frm' + strScreenName;
  var strCurrentGrd = '#Grd' + strScreenName;
  var strFullPath   = strCurrentFrm + ' ' + strCurrentGrd;

  /*
  Pega o click do grid atual
  */
  $( strFullPath ).click(function() {

    var strTypeKendo = GetTypeSearch('frm'+strScreenName, 'Grd'+strScreenName);
    var grdConsultaPadrao = $( strFullPath ).data(strTypeKendo);

    //Verifica o formato de seleção do grid
    if(grdConsultaPadrao.options.selectable == "cell"){
      //Buscando o Índice da Linha selecionada
      var IndiceLinhaSelecionada = grdConsultaPadrao.select().closest("tr");

      //Carregando o ResultSet da Linha Selecionada
      var rstPadrao = grdConsultaPadrao.dataItem(IndiceLinhaSelecionada);
    }
    else{
      var rstPadrao = grdConsultaPadrao.dataItem(grdConsultaPadrao.select());
    }

    // Carrega os dados na visualização da consulta
    if( rstPadrao ) {
      loadFieldsOnScreenPreview( arrDataSource, rstPadrao, strScreenName, indiceTabPreview );

      // Cria o click no button log...
      createDataButtonLog(strScreenName, rstPadrao, indiceTabPreview, arrDataSource);

      // Cria o click no button log do dbcliente...
      createDataButtonLogCliente(strScreenName, rstPadrao, indiceTabPreview, arrDataSource);
    }

  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Cria os valores de data no botão BtnInfoLogRegistro para quando ser clicado abrir a tela corretamente
//-----------------------------------------------------------------------------------------------------------------//
function createDataButtonLog(strScreenName, rstPadrao, indiceTabPreview, arrDataSource) {

  // Pega o campo da lupa que acessa a tela de log ...
  var btnInfoLogRegistro = $(getNameAppendTable(strScreenName, indiceTabPreview) + ' #BtnInfoLogRegistro');

  // Verifica se o campo existe
  if( btnInfoLogRegistro[0] !== undefined ) {

    // Pega a informação do campo Última Alteração que fica na visualização
    // Esse campo contem a informação da ultiima alteração do registro
    var fieldUltimaAlteracao = $(getNameAppendTable(strScreenName, indiceTabPreview)+ ' #infologregistroPreview');

    // Se esse registro existir, vamos habilitar a lupa para consulta, caso contrario desabilita
    if( (fieldUltimaAlteracao[0] != undefined) && (fieldUltimaAlteracao.val() != '') ) {

      // Pega o nome da coluna do id atual ...
      var strNameColumn = arrDataSource[0].name;

      // Pega o valor do registro atual
      var intRegistro   = rstPadrao[strNameColumn];

      // Pega o nome da tabela do registro atual
      var strNameTable  = strNameColumn.replace('id', 'tb');

      // Seta as informações de registro e table para usar posteriormente
      btnInfoLogRegistro.data('idRegistro', intRegistro);
      btnInfoLogRegistro.data('nmTable', strNameTable);

      // Adicionando atributo para possibilitar a leitura do botão
      btnInfoLogRegistro.attr("role","img");      
      
      // Habilita o botão para acessar a tela de consulta de log
      btnInfoLogRegistro.removeClass('k-state-disabled');
    } else {
      // Desabilita o botão de log quando não existir ocorrencia de log ...
      btnInfoLogRegistro.addClass('k-state-disabled');
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Cria os valores de data no botão BtnInfoLogRegistroCliente para quando ser clicado abrir a tela corretamente
//-----------------------------------------------------------------------------------------------------------------//
function createDataButtonLogCliente(strScreenName, rstPadrao, indiceTabPreview, arrDataSource) {

  // Pega o campo da lupa que acessa a tela de log ...
  var btnInfoLogRegistroCliente = $(getNameAppendTable(strScreenName, indiceTabPreview) + ' #BtnInfoLogRegistroCliente');

  // Verifica se o campo existe
  if( btnInfoLogRegistroCliente[0] !== undefined ) {

    // Pega a informação do campo Última Alteração que fica na visualização
    // Esse campo contem a informação da ultiima alteração do registro
    var fieldUltimaAlteracao = $(getNameAppendTable(strScreenName, indiceTabPreview)+ ' #infologregistroclientePreview');

    // Se esse registro existir, vamos habilitar a lupa para consulta, caso contrario desabilita
    if( (fieldUltimaAlteracao[0] != undefined) && (fieldUltimaAlteracao.val() != '') ) {

      // Pega o nome da coluna do id atual ...
      var strNameColumn = arrDataSource[0].name;

      // Pega o valor do registro atual
      var intRegistro   = rstPadrao[strNameColumn];

      // Pega o nome da tabela do registro atual
      var strNameTable  = strNameColumn.replace('id', 'tb');

      // Seta as informações de registro e table para usar posteriormente
      btnInfoLogRegistroCliente.data('idRegistro', intRegistro);
      btnInfoLogRegistroCliente.data('nmTable', strNameTable);

      // Habilita o botão para acessar a tela de consulta de log
      btnInfoLogRegistroCliente.removeClass('k-state-disabled');
    }
    else {
      // Desabilita o botão de log quando não existir ocorrencia de log ...
      btnInfoLogRegistroCliente.addClass('k-state-disabled');
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Função que carrega os valores do grid no preview da consulta (click grid)
//-----------------------------------------------------------------------------------------------------------------//
function loadFieldsOnScreenPreview( arrDataSource, rstPadrao, strScreenName, indiceTabPreview ) {

  // Se existe essa variavel quer dizer que estamos carregando o log do registro de forma manual
  if( parseInt(rstPadrao['idusuariolog']) > 0 ) {

    setRecordLastChangeOnField(rstPadrao, arrDataSource[0].name, strScreenName);
  }

  arrDataSource.forEach(function(currentElement) {

    if( treatBooleanValue(currentElement.showPreview) ) {

      var arrDataObject = Object.keys(rstPadrao);

      for( var i = 0; i < arrDataObject.length; i++ ) {

        //Caso o tipo do elemento for 'html'
        if(currentElement.typeFieldPreview == 'html'){

          var strFieldPreview = '#' + arrDataObject[i] + 'Preview';
          $(getNameAppendTable(strScreenName, indiceTabPreview) + ' ' + strFieldPreview).html( rstPadrao[arrDataObject[i]] );

        }
        else {

          if( currentElement.name == arrDataObject[i] ) {

            // Campo que será setado o valor
            var strFieldPreview = '#' + arrDataObject[i] + 'Preview';
            var strNameField = arrDataObject[i];
            var blIsVlrField = (strNameField.substr(0, 2) === 'vl');
            var xValueFiledPreview = rstPadrao[arrDataObject[i]];
            if(blIsVlrField) {
              if(xValueFiledPreview === 0) {
                xValueFiledPreview = '0,00';
              }
              else {
                // formata o valor numeric
                var strValueTemp = FmtVlrToString(xValueFiledPreview);
                // Se o valor veio como zero, é pq o campo na viw possui o type = 'string', como a alteração do campo valor
                // foi feito posteriormente para o type = 'numeric', ele vem zerado.
                // Então na viw deve ser feito o campo valor com o type numeric e habilitado o filtro
                if( strValueTemp !== '0,00' ) {
                  xValueFiledPreview = strValueTemp;
                }
              }
            }

            $(getNameAppendTable(strScreenName, indiceTabPreview) + ' ' + strFieldPreview).val( xValueFiledPreview );
          }

        }
      }
    }
  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Seta o registro da ultima alteração no campo do preview "Última Alteração"
//-----------------------------------------------------------------------------------------------------------------//
function setRecordLastChangeOnField(rstPadrao, strNameColumn, strScreenName) {

  var idUsuarioLog  = rstPadrao['idusuariolog'];
  var intIdRegistro = rstPadrao[strNameColumn];
  var strTable      = strNameColumn.replace('id', 'tb');

  // Identifica se usa banco do cliente ou nao
  var blCliente = false;
  var btnInfoLogRegistro = $(getNameAppendTable(strScreenName, 'tabDadosGerais') + ' #BtnInfoLogRegistro');
  if( btnInfoLogRegistro[0] === undefined ) {
    btnInfoLogRegistro = $(getNameAppendTable(strScreenName, 'tabDadosGerais') + ' #BtnInfoLogRegistroCliente');
    blCliente = true;
  }

  var strUrl = "sistema/controller/logregistro/ctrLogRegistro.php?action=GetRecordLastChange";
  if(blCliente) {
    strUrl   = "sistema/controller/logregistrocliente/ctrLogRegistroCliente.php?action=GetRecordLastChange";
  }

  $.ajax({
    url: strUrl,
    type: "post",
    async: true,
    data: {
      idUsuarioLog: idUsuarioLog,
      idRegistro: intIdRegistro,
      nmTable: strTable
    },
  }).done(function(strLastChange) {

    if( strLastChange != '' ) {

      var strInfoLogRegistroPreview = (blCliente) ? '#infologregistroclientePreview' : '#infologregistroPreview';
      var objInfoLogRegistroPreview = $('#frm'+strScreenName+' '+strInfoLogRegistroPreview);

      if( objInfoLogRegistroPreview.val() !== strLastChange ) {
        objInfoLogRegistroPreview.val(strLastChange);
      }

      // Seta as informações de registro e table para usar posteriormente
      btnInfoLogRegistro.data('idRegistro', intIdRegistro);
      btnInfoLogRegistro.data('nmTable', strTable);

      // infologregistroPreview
      btnInfoLogRegistro.removeClass('k-state-disabled');
    }

  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Pega a descrição do campo para setar os valores
//-----------------------------------------------------------------------------------------------------------------//
function getNameAppendTable(strScreenName, strCurrentIndice) {
  return '#frm'+strScreenName+' #botton'+strScreenName+' #tabStrip'+strScreenName+' #'+strCurrentIndice+'Visualizacao'+strScreenName;
};
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Cria as colunas no grid
//-----------------------------------------------------------------------------------------------------------------//
function getColumnsQuery(arrDataSource) {

  var objResult = {};
  var arrGrid   = [];
  var arrNameColumns = ['infologregistrocliente', 'infologregistro'];

  // Faz a ordenação do grid para ser criada as colunas de acordo com o atributo orderGrid
  arrDataSource = orderDataGridBySort(arrDataSource, 'orderGrid');
  //Percorre os objetos do array
  Object.keys(arrDataSource).forEach(function(indice) {
    arrGrid.push( addFieldGrid( arrDataSource[indice] ) );
  });

  return arrGrid;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Método responsável por criar o model do data source
//-----------------------------------------------------------------------------------------------------------------//
function getModelDataSource( arrDataSource ) {

  var objModel = {};
  var strType = '';
  var arrTypeNumeric = ['integer', 'numeric'];

  for( var i = 0; i < arrDataSource.length; i++ ) {
    strType = ( arrTypeNumeric.includes(arrDataSource[i].type) ) ? 'number' : 'string';
    objModel[arrDataSource[i].name] = { type: strType };
  }

  return objModel;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Monta o array com os objetos setados para serem aggregate na consulta
// Se a propriedade aggregateGrid existir, quer dizer que o campo é um aggregate
//-----------------------------------------------------------------------------------------------------------------//
function getAggregateData( arrDataSource ) {

  var arrAggregate = [];

  for( var i = 0; i < arrDataSource.length; i++ ) {
    if( arrDataSource[i].aggregateGrid != undefined ) {
      arrAggregate.push({
        field     : arrDataSource[i].name,
        aggregate : arrDataSource[i].aggregateGrid
      });
    }
  }

  return arrAggregate;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Método responsável por criar o model do data source do TreeList
//-----------------------------------------------------------------------------------------------------------------//
function getModelDataSourceTreeList( arrDataSource ) {

  var objModel = {};
  var strType = '';
  var arrTypeNumeric = ['integer', 'numeric'];

  for( var i = 0; i < arrDataSource.length; i++ ) {
    // Pega o type do field
    strType = ( arrTypeNumeric.includes(arrDataSource[i].type) ) ? 'number' : 'string';
    // Pega o nullable do field
    blNullable = ( arrDataSource[i].nullable ) ? arrDataSource[i].nullable : false;

    objModel[arrDataSource[i].name] = {
      field: arrDataSource[i].name,
      type: strType,
      nullable: blNullable
    };
  }

  return objModel;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Monta o objeto das colunas da consulta
//-----------------------------------------------------------------------------------------------------------------//
function addFieldGrid( objCurrent ) {
  var objField = {
    field: objCurrent.name,
    title: ( (objCurrent.labelGrid === undefined) || ( objCurrent.labelGrid === '' ) ) ? objCurrent.label : objCurrent.labelGrid,

    headerAttributes: {
      style: objCurrent.headerAttributesGrid
    },
    attributes: {
      style: objCurrent.attributesGrid
    },

    // Verifica se existe o atributo sortable, se existir, vamos usa-ló
    sortable: ( objCurrent.sortable === undefined ) ? true : treatBooleanValue( objCurrent.sortable ),
    
    editable: ( objCurrent.editable === undefined ) ? function(){ return false; } : function(){ return objCurrent.editable === 'true'; },

    // Se existir template, vamos usa-ló
    template: ( objCurrent.templateGrid === '' ) ? '' : objCurrent.templateGrid,
  }

  // Se existir headerTemplate, vamos usa-ló
  if( objCurrent.headerTemplate != undefined ) {
    objField.headerTemplate = objCurrent.headerTemplate;
  }

  // Adicionando colunas dentro de uma coluna
  if( objCurrent.subColumnGrid != undefined ) {
    objField.columns = objCurrent.subColumnGrid;
  }

  // Se o atributo filterable foi passado como true, ou não foi passado, cria o filterable
  // Se for a coluna infologregistro, não vamos criar o filterable
  if( ((treatBooleanValue(objCurrent.filterable) === true) || (objCurrent.filterable === undefined)) && !isObjectInfoLogRegistro(objCurrent) ) {
    objField.filterable = {
      multi: true, search: true, checkAll: false
    };
  // Se for false nao cria o filterable na coluna do grid
  } else {
    objField.filterable = false;
  }

  // Se width for > 0, vamos setar o valor no objecto
  if( parseInt( objCurrent.widthGrid ) > 0 ) {
    objField.width = parseInt(objCurrent.widthGrid);
  }
  else if(objCurrent.name === 'infologregistrocliente' || objCurrent.name === 'infologregistro') {
    objField.width = 220;
  }

  // Se for o campo com a informação do log, vamos impedir de ser ordenado no grid
  if( isObjectInfoLogRegistro(objCurrent) ) {
    objField.sortable = false;
  }

  // Verifica se usa nullable, se usa seta o valor
  if( objCurrent.nullable !== undefined ) {
    objField.nullable = objCurrent.nullable;
  }

  if( objCurrent.aggregateGrid !== undefined ) {

    var strAggregateType = objCurrent.aggregateGrid;
    var strNameField = objCurrent.name;

    objField.footerTemplate = "<div style='float: right;'>#= kendo.toString(data."+strNameField+"."+strAggregateType+", 'C') #</div>";
  }

  if( objCurrent.aggregateGroupGrid !== undefined ) {
    objField.aggregates = objCurrent.aggregateGroupGrid;
  }

  if( objCurrent.groupHeaderColumnTemplateGrid !== undefined ) {
    objField.groupHeaderColumnTemplate = objCurrent.groupHeaderColumnTemplateGrid;
  }

  if( objCurrent.groupHeaderTemplateGrid !== undefined ) {
    objField.groupHeaderTemplate = objCurrent.groupHeaderTemplateGrid;
  }

  // Formata o campos com o alinhamento correto conforme o tipo, caso o campo nao tenha sido alinhado ainda
  switch(objCurrent.name.substr(0, 2)) {
    case 'vl':
      objField.format = "{0:c}";

      if(objField.headerAttributes.style === undefined) {
        objField.headerAttributes.style = 'text-align:left;';
      }
      if(objField.attributes.style === undefined) {
        objField.attributes.style = 'text-align:right;';
      }
    break;
    case 'dt':
    case 'hr':
    case 'fl':
      if(objField.headerAttributes.style === undefined) {
        objField.headerAttributes.style = 'text-align:center;';
      }
      if(objField.attributes.style === undefined) {
        objField.attributes.style = 'text-align:center;';
      }
    break;
  }

  if( objCurrent.encoded !== undefined ) {
    objField.encoded = (objCurrent.encoded === "false") ? false : true;
  }

  if( objCurrent.editorGrid !== undefined ) {
    objField.editor = window[objCurrent.editorGrid] ;
  }

  return objField;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Se for a coluna do log de registro retorna true
//-----------------------------------------------------------------------------------------------------------------//
function isObjectInfoLogRegistro(objCurrent) {
  var arrField = ['infologregistro', 'infologregistrocliente'];

  return arrField.includes(objCurrent.name);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Filtra para exibir no filtro da consulta somente os campos que devem ser mostrados atraves da propriedade 'visible' || 'visibleFilter'
//-----------------------------------------------------------------------------------------------------------------//
function filterFieldsFilterScreen(arrDataSource) {

  var aroResult = [];
  Object.keys(arrDataSource).forEach(function(indice) {

    if(treatBooleanValue( arrDataSource[indice]['visible'] ) || treatBooleanValue( arrDataSource[indice]['visibleFilter'] )) {
      aroResult.push( arrDataSource[indice] );
    }

  });

  aroResult = orderDataGridBySort( aroResult, 'orderFilter' );

  return aroResult;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Trata o valor booleano, recebe uma string, retorna um boolean
//-----------------------------------------------------------------------------------------------------------------//
function treatBooleanValue(strValue) {
  if( (strValue !== '') && (strValue !== undefined) ) {

    if( typeof(strValue) !== 'string' ) {
      strValue = String(strValue);
    }

    return ( strValue.toUpperCase() === 'TRUE' ) ? true : false;
  }

  return false;
}
//-----------------------------------------------------------------------------------------------------------------//

//Realiza a formatação do texto passado por parâmetro, transformando a primeira letra de cada palavra em maíuscula, e as demais, minúsculas.
function ucWord(dsFrase){
  let str = dsFrase.toLowerCase()
  let re = /(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g
  return str.replace(re, s => s.toUpperCase())
}

//-----------------------------------------------------------------------------------------------------------------//
// Faz a ordenação dos valores para serem colocados no grid de acordo com o atributo orderGrid
//-----------------------------------------------------------------------------------------------------------------//
function orderDataGridBySort(arrData, strNameFilterOrder) {

  var tmp = null;

  for( var i = 0; i < arrData.length; i++ ) {

    if( arrData[i][strNameFilterOrder] !== undefined && (parseInt(arrData[i][strNameFilterOrder]) > 0) ) {

      for( var x = 0; x < arrData.length; x++ ) {
        if( parseInt(arrData[i][strNameFilterOrder]) < parseInt(arrData[x][strNameFilterOrder]) ) {

          tmp = arrData[i];
          arrData[i] = arrData[x];
          arrData[x] = tmp;

        }
      }
    } else {
      /*
        Vamos adicionar o valor como 99 para o bubbleSort funcionar corretamente,
        pois pode haver objetos que não tem a propriedade orderGrid informada e quando for
        fazer a ordenação não vai ter com quem comparar...
      */
      arrData[i][strNameFilterOrder] = '99';
    }
  }

  return arrData;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Da o start na criação dos filtros da tela
//-----------------------------------------------------------------------------------------------------------------//
function createPgFilter(arrDataSource, strNameQuery) {

  var filConsultaPadrao = new pgFilter({
    formElement   : 'frm' + strNameQuery,
    filterElement : 'flt' + strNameQuery,
    fields        : filterFieldsFilterScreen(arrDataSource),
    nameQuery     : strNameQuery,
  });

  $('#frm' + strNameQuery + ' #BtnAddFilter').click(function() {
    filConsultaPadrao.CreateElement();
    setFocusFirstField(strNameQuery);
  });

  if(getBlUseStateScreen(strNameQuery)) {
    setFilterOnScreen(strNameQuery, arrDataSource);
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Método responsavel por agrupar os dados necessarios para esconder as colunas corretas na consulta
//-----------------------------------------------------------------------------------------------------------------//
function hideColumnsGrid(arrDataSource, strScreenName) {

  var arrColumnHide = [];
  var strFrm        = '#frm' + strScreenName;
  var strGrd        = '#Grd' + strScreenName;
  // Retorna o tipo se é grid ou treelist
  var strTypeKendo  = GetTypeSearch('frm'+strScreenName, 'Grd'+strScreenName);
  var objKendoGrid  = $(strFrm + ' ' + strGrd).data(strTypeKendo);

  if( objKendoGrid !== undefined ) {

    arrColumnHide = getColumnsToHidden( arrDataSource );

    for( var i = 0; i < arrColumnHide.length; i++ ) {
      objKendoGrid.hideColumn( parseInt(arrColumnHide[i]) );
    }

  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Pega o indice das colunas que serão ocultadas no grid da consulta
//-----------------------------------------------------------------------------------------------------------------//
function getColumnsToHidden( arrDataSource ) {

  var arrColumnHide = [];

  //Percorre os objetos do array
  Object.keys(arrDataSource).forEach(function(indice) {
    //Se for hiddenGrid = true vamos armazenar o indice para esconder posteriormente
    if( arrDataSource[indice].hiddenGrid !== undefined && treatBooleanValue( arrDataSource[indice].hiddenGrid ) ) {
        arrColumnHide.push( indice );
    }
  });

  return arrColumnHide;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Faz a atualização dos dados do dashboard
// blFirstCall -> Esse parametro foi criado para indicar se deve criar o setTimeout na viwdashboard. 1 - cria; 0 - nao cria.
//----------------------------------------------------------------------------------------------------------------//
function AtualizaDashBoard(blFirstCall = 0) {

  $.ajax({
    dataType: "json",
    url: "global/controller/configuracaomodulo/ctrConfiguracaoModulo.php?action=CheckDashboard",
    success: function(dados){

      if (parseInt(dados.idmodulo) !== 40){

        $("#divDashBoard").hide();
        $("#DivWindowArea").addClass('logo-empresa');

        if (dados.idjanela != undefined && dados.idjanela != 0){
          OpenWindow(dados.idjanela,false,'winConsulta');
        }

      }
      else {
        $("#DivWindowArea").removeClass('logo-empresa');

        // Pega o idcliente no dashboard
        var idClienteDashBoard = $('#divDashBoard #idClienteNotificacaoDashBoard').val();
        var idUsuarioDashBoard = $('#divDashBoard #idUsuarioAssistenteDashBoard').val();

        // Faz o carregamento das informações do dashboard
        $("#divDashBoard").load("convenio/controller/dashboard/ctrDashBoard.php?action=LoadDashBoard&idClienteDashBoard="+idClienteDashBoard+"&idUsuarioDashBoard="+idUsuarioDashBoard+"&blFirstCall="+blFirstCall, function() {

          // Os métodos abaixo destroem e posteriormente criam os gráficos, cada um o seu.
          LoadGraficoQtdeConvenioFinanciamentoAtivo();
          LoadGraficoQuantidadeConvenioStatus();
          LoadGraficoValorConvenioFinanciamentoAtivo();
          LoadGraficoRegularidadeRepasse();

          $("#divDashBoard").show();

        });
      }

    }
  });
}
//-----------------------------------------------------------------------------------------------------------------//

// Usado no processo de salvar o sort das colunas
var objSortFreeze = {};
//-----------------------------------------------------------------------------------------------------------------//
// Faz o carregamento da configuração da consulta
//-----------------------------------------------------------------------------------------------------------------//
function LoadConfigurationQuery(arrDataSource, strScreenName) {

  // Limpa a variavel para nao ficar com os dados anteriores carregados
  objSortFreeze = {};

  let idJanela      = $("#Win"+strScreenName).attr("data-windowid");
  let strPathScreen = '#Win'+strScreenName+' #frm'+strScreenName;
  let blPossuiStateScreen = null;
  let dspai = $(strPathScreen + ' #dsIdPai').val();

  $.ajax({
    url: "sistema/controller/configuracaoconsulta/ctrConfiguracaoConsulta.php?action=LoadConfiguracaoConsulta",
    async: false,
    type: "post",
    data: {
      idJanela: idJanela,
      data: arrDataSource,
      dsPai: dspai
    },
  }).done(function(data) {
    
    let objConfig = {};
    if( ! getBlFromOtherQuery(strScreenName) ) {
      
      // Pega os dados retornados
      let arrData = JSON.parse(data);
      
      // remove o ultimo indice com a configuração e retorna o mesmo
      objConfig = arrData.pop();

      // Se entrar aqui quer dizer que o usuario salvou o estado da tela, e após isso, foi adicionado
      // novas colunas no grid da consulta, então, essa coluna nova não existe no banco, sem isso essa coluna
      // nova nunca iria aparecer na consulta
      if( arrDataSource.length > arrData.length ) {

        for( let i = 0; i < arrDataSource.length; i++ ) {

          let blFind = false;

          for( let x = 0; x < arrData.length; x++ ) {
            if( arrData[x].name === arrDataSource[i].name ) {
              blFind = true;
              break;
            }
          }

          if(!blFind) {
            arrData.push(arrDataSource[i]);
          }
        }

      }

      // recebe os dados para retornar a view
      arrDataSource = arrData;
    }
    else {
      objConfig.blPossuiConfiguracao = false;
    }

    // Verifica se usa o state screen
    blPossuiStateScreen = objConfig.blPossuiConfiguracao;

    // Valida se a tela foi configurada para usar as configurações da consulta.
    $(strPathScreen + ' #Grd'+strScreenName).attr('data-use-state-screen', true);
    // Valida se a tela possui configuração salva para o usuario atual
    $(strPathScreen + ' #Grd'+strScreenName).attr('data-get-state-screen', blPossuiStateScreen);

    $(strPathScreen + ' .k-bg-blue.screen-filter-content #BtnAddFilter').click(() => {
      dispatcheEventAddFilterOnScreen(strScreenName);
    });

  });

  setCssSplitterScreen(strScreenName);

  objSortFreeze['screenName'] = strScreenName;

  return arrDataSource;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Regorna um objecto com os campos sort da tela atual
// arrDefaultSort -> deve ser passado caso não existe dados salvos para carregar e quiser fazer o sort por padrao da tela
//-----------------------------------------------------------------------------------------------------------------//
function getSortDataSource( arrDataSource, arrDefaultSort, strScreenName ) {

  objSortFreeze['arrDefaultSort'] = arrDefaultSort;

  // Pega todos os campos com order
  var arrSortDataSource = arrDataSource.reduce((arrAccumulator, objField) => {

    if( parseInt(objField.ordersort) >= 0 ) {
      arrAccumulator[objField.ordersort] = {
        field : objField.name,
        dir   : objField.nmsort
      }
    }

    return arrAccumulator;
  }, []);

  // quer dizer que foi salvo para nao ordenar por nenhuma coluna
  if( (arrSortDataSource.length === 0) && (parseInt(arrDataSource[0].ordersort) === -1) ) {
    arrSortDataSource = [];
  }
  // Faz a ordenação padrao, a passada pelo parametro
  else if( arrSortDataSource.length === 0 && arrDefaultSort != undefined ) {
    arrSortDataSource = arrDefaultSort;
  }
  // Faz a ordenação conforme o valor salvo
  else {
    // Retorna somente os indices que não são vazios
    let arrNewSortFilteredDataSource = arrSortDataSource.filter(function(objOrder) {
      return objOrder != null;
    });

    objSortFreeze['arrNewSortFilteredDataSource'] = arrNewSortFilteredDataSource;

    arrSortDataSource = arrNewSortFilteredDataSource;
  }

  return arrSortDataSource;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Inicializa os eventos do sort das colunas do grid
//-----------------------------------------------------------------------------------------------------------------//
function initSortStructure() {

  // Valor padrao do sort
  arrDefaultSort = objSortFreeze['arrDefaultSort'];
  // Nome da tela
  strScreenName  = objSortFreeze['screenName'];
  // Valor salvo
  arrNewSortFilteredDataSource = objSortFreeze['arrNewSortFilteredDataSource'];

  // Se nao existe valor nao faz nada
  if (arrDefaultSort === undefined) return;

  // Seta o attr para identificar que usa sort
  $('#frm'+strScreenName+' #Grd'+strScreenName).attr('data-use-sort-screen', true);

  // Inicializa o contador com o indice da coluna
  $('#frm'+strScreenName+' #Grd'+strScreenName + ' .k-grid-header tr[role="row"]').attr('data-idx-column-sort', 0);

  let arrNewDefaultSort;
  if( arrNewSortFilteredDataSource === undefined ) {
    // retorna um array com o nome dos fields usados por padrao para o sort da viw
    arrNewDefaultSort = arrDefaultSort.reduce((arrAccumulator, objSortFields) => {
      // monta o objeto com os dados ...
      arrAccumulator.push({
        field: objSortFields.field
      });

      return arrAccumulator;
    }, []);
  }
  else {
    arrNewDefaultSort = arrNewSortFilteredDataSource;
  }

  // Percorre as colunas do grid
  $('#frm'+strScreenName+' #Grd'+strScreenName + ' .k-grid-header tr[role="row"] > th').each(function(idx, objColumn) {

    // Percorre os campos existentes e seta o indice do sort corretamente
    arrNewDefaultSort.forEach(function(objSort, idx) {
      if( objSort.field === objColumn.getAttribute('data-field') ) {
        updateAttrColumn(objColumn, idx);
      }
    });

    // ao clicar na coluna do grid atualiza os dados
    objColumn.onclick = function(objColumn) {
      updateAttrColumn(objColumn.currentTarget);
    };

  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Responsavel por atualizar a sequencia das variaveis
//-----------------------------------------------------------------------------------------------------------------//
function updateAttrColumn(objColumn, idx) {

  // se foi passado o idx
  if( idx !== undefined ) {
    // seta o valor do attr na coluna atual
    objColumn.setAttribute('data-idx-column-sort', idx);
    // Valida se o valor atual é maior que o valor da row
    if( idx > parseInt(objColumn.parentElement.getAttribute('data-idx-column-sort')) ) {
      // seta o valor do attr na row
      objColumn.parentElement.setAttribute('data-idx-column-sort', idx);
    }
  }
  else {
    // Pega o valor do attr
    let intIdxColumnSort = objColumn.parentElement.getAttribute('data-idx-column-sort');
    // seta o valor do attr na coluna atual
    objColumn.setAttribute('data-idx-column-sort', ++intIdxColumnSort);
    // Valida se o valor atual é maior que o valor da row
    if( intIdxColumnSort > parseInt(objColumn.parentElement.getAttribute('data-idx-column-sort')) ) {
      // seta o valor do attr na row
      objColumn.parentElement.setAttribute('data-idx-column-sort', intIdxColumnSort);
    }
  }
}

//-----------------------------------------------------------------------------------------------------------------//
// Cria o evento para adicionar as linhas na tela e ajustar o tamanho da tela
//-----------------------------------------------------------------------------------------------------------------//
function dispatcheEventAddFilterOnScreen(strScreenName, srtOperator) {

  let strNamePath      = '#Win'+strScreenName+' #frm'+strScreenName;
  let strFilterContent = strNamePath + ' #splConsulta #splHeader .k-bg-blue.screen-filter-content';

  let objDataOperator = {
    operator         : (srtOperator === 'RemoveFilter') ? 'plus' : 'minus',
    beginHeight      : $(strNamePath + ' #splHeader').height(),
    blOwnExtraFilter : $(strFilterContent + ' > table').length >= 2,
    intHeightQuery   : function() {

      if(this.blOwnExtraFilter) {

        let intTotalHeightFilters = 0;
        $(strFilterContent + ' > table').each(function(idx, objFilter) {
          intTotalHeightFilters += objFilter.offsetHeight;
        });

        return (intTotalHeightFilters + 35);
      }
      else {
        return $(strFilterContent + ' #flt'+strScreenName).height() + 35;
      }
    },
    intHeightHeader   : $(strNamePath + ' #splConsulta #splHeader').height(),
    objKendoSplitter  : $(strNamePath + " #splConsulta").data("kendoSplitter"),
    newHeight         : function() {
      let intNewValueHeight = (this.operator === 'plus') ? (this.beginHeight - getHeightDifScreen()) : (this.beginHeight + getHeightDifScreen());

      return intNewValueHeight + 'px';
    },
    blValidHeightData : function() {

      return (this.operator === 'minus') ? (this.intHeightQuery() > this.intHeightHeader) : (this.intHeightQuery() < this.intHeightHeader);
    },
    intLengthFiltersOnScreen : function() {
      let intUseFilterExtra = ($(strFilterContent + ' > table').length === 2);
      let intTotalFilter    = $(strNamePath + ' #splConsulta #splHeader #flt'+strScreenName+' > div').length;

      return (intUseFilterExtra) ? (intTotalFilter + 1) : intTotalFilter;
    },
    intMaxLinesOnFilter : 3,
    isLessThenTreeLines : function() {
      return this.intLengthFiltersOnScreen() <= this.intMaxLinesOnFilter;
    }
  };

  // Entra aqui até a terceira linha do filtro
  if( objDataOperator.isLessThenTreeLines() ) {

    if( ( objDataOperator.objKendoSplitter !== undefined) && objDataOperator.blValidHeightData() ) {
      objDataOperator.objKendoSplitter.size(".k-pane:first", objDataOperator.newHeight());
      resizeKendoSplitterPreviewOnScreen(strScreenName, objDataOperator.operator);
    }

  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Faz o ajuste do height da parte de visualização (Preview). Apenas quando usa kendoSplitter
// Usado para compensar o tamanho quando se adiciona filtro na tela
//-----------------------------------------------------------------------------------------------------------------//
function resizeKendoSplitterPreviewOnScreen(strScreenName, strOperator) {

  let intHeightMiddle = $('#Win'+strScreenName+' #frm'+strScreenName+' #splMiddle').height();
  let intNewHeight    = (strOperator === 'plus') ? (intHeightMiddle + getHeightDifScreen()) : (intHeightMiddle - getHeightDifScreen());

  $("#Win"+strScreenName+" #frm"+strScreenName+" #splConsulta").data("kendoSplitter").size("#splMiddle", intNewHeight);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Altura padrão para calcular a diferença de tamanho da altura, tanto do filtro quanto do preview
//-----------------------------------------------------------------------------------------------------------------//
function getHeightDifScreen() {
  return 26;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Valida se usa as configurações da tela
//-----------------------------------------------------------------------------------------------------------------//
function getBlUseStateScreen(strScreenName) {
  return ($("#Win"+strScreenName+" #frm"+strScreenName+" #splConsulta #splMiddle #Grd"+strScreenName).attr('data-use-state-screen') === 'true');
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Valida se possui configuração salva para a consulta atual
//-----------------------------------------------------------------------------------------------------------------//
function getBlHasStateScreen(strScreenName) {
  return ($("#Win"+strScreenName+" #frm"+strScreenName+" #splConsulta #splMiddle #Grd"+strScreenName).attr('data-get-state-screen') === 'true');
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// 1 - Valida se a tela foi chamada de -> Consultas > Notificações (Por Exemplo, por ser qualquer tela...)
// 2 - Valida se a tela foi chamada de outra tela (botão lupa)
//-----------------------------------------------------------------------------------------------------------------//
function getBlFromOtherQuery(strScreenName) {
  if( $('#Win'+strScreenName+' #frm'+strScreenName+' #blFromConsultaNotificacao').val() === '1' ) {
    return true;
  }
  else {
    return ($('#Win'+strScreenName+' #frm'+strScreenName+' #frmResult').val() != '');
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Seta os filtros na tela que foram salvos na consulta
//-----------------------------------------------------------------------------------------------------------------//
function setFilterOnScreen(strScreenName, arrDataSource, blFromRemove) { 
  
  if( ! getBlFromOtherQuery(strScreenName) ) {
    
    // Percorre os dados em tela e pega somente os valores para os filtros
    var arrNameTipoFilter = arrDataSource.reduce((accumulator, objFilter) => {
      
      // se possui order e não é 99. Obs.: 99 é um valor padrão para quando nao possui uma order definida
      if((objFilter.orderFilter > 0 && objFilter.orderFilter != 99) && objFilter.tipoFilter != undefined){
        
        // monta o objeto com os dados ...
        accumulator[objFilter.orderFilter] = {
          nmnome: objFilter.name,
          nmtipofiltro: objFilter.tipoFilter,
          valorfiltro: objFilter.valorfiltro,
          flselect: objFilter.nmmultipleselect  
        };
      }

      return accumulator;
    }, []);

    let strPathScreen = '#Win'+strScreenName+' #frm'+strScreenName;
               
    // Verifica se encontrou alguma informação
    if(arrNameTipoFilter.length > 0) {

      var blUpdateScreen = false;
      
      // percorre os filtros e monta os mesmos em tela
      arrNameTipoFilter.forEach((objFilter, idx) => {
        
        if(idx > 1 && objFilter.flselect == '') {
          // Adiciona um filtro
          $(strPathScreen+' #BtnAddFilter').click();
        }

        // Caso o idx nao exista quer dizer que o filtro foi removido e esta sendo adicionado
        // novamente, então, devemos procurar o proximo idx valido ...
        if(!($(strPathScreen+' #filterField'+idx).length > 0)) {
          idx = $(strPathScreen+' #flt'+strScreenName+' .filterItem:last').attr('data-value');
        }

        //Verificando se trata-se de filtro padrão
        if(objFilter.flselect == ""){
          
          // Percorre os fields e seta o campo corretamente ...
          $(strPathScreen+' #filterField'+idx+' > option').each((index, objOption) => {
            if( objOption.value === objFilter.nmnome ) {

              let objKendoDropDownList = $(strPathScreen+' #filterField'+idx).data('kendoDropDownList');

              objKendoDropDownList.select(index);
              objKendoDropDownList.trigger("change");

              $(strPathScreen+' #filterOperator'+idx+' > option').each((index, objOption) => {
                if( objOption.value === objFilter.nmtipofiltro ) {
                  $(strPathScreen+' #filterOperator'+idx).data('kendoDropDownList').select(index);

                  if( objFilter.valorfiltro != '' ) {
                    $(strPathScreen+' #filterValue'+idx).val(objFilter.valorfiltro);

                    // se for numeric, precisamos setar o valor no filtro para o mesmo aparecer, caso contrario fica em branco
                    if( parseInt(objFilter.valorfiltro) > 0 && $(strPathScreen+' #filterValue' + idx).attr('data-role') === 'numerictextbox') {
                      $(strPathScreen+' #filterValue'+idx).data("kendoNumericTextBox").focus();
                    }

                    blUpdateScreen = true;
                  }

                  return false;
                }
              });

              return false;
            }
          });  
        }
        else{
          setTimeout(function(){   

            //Verificando se trata-se de multipleSelect ou dropDownList
            if(objFilter.flselect == "MS"){
              
              //Transformando string em array
              var idFiltro = (objFilter.valorfiltro).split(",");
                
              $("#frm"+strScreenName+" #"+objFilter.nmnome).multipleSelect('setSelects',idFiltro);
            }
            else{                                   
              $("#frm"+strScreenName+" #"+objFilter.nmnome).data("kendoDropDownList").value(objFilter.valorfiltro);
            }
            
            $("#frm"+strScreenName+" #BtnPesquisar").click();
            
          },1000);
          
          blUpdateScreen = true;
        }
        
        // Se foi setado algum valor no filtro, vamos atualizar a tela para fazer valer os dados nos filtros ...
        if(blUpdateScreen) {
          $(strPathScreen + " #splConsulta #splHeader .k-bg-blue.screen-filter-content #frm"+strScreenName+" #BtnPesquisar").click();
        }
      });
    }

    if(blFromRemove) {
      setHeightScreen(strScreenName, arrDataSource[0].cdalturafiltrotela, arrDataSource[0].cdalturavisualizacaotela);
    }
  }
  else {
    setHeightScreen(strScreenName);
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Limpa os filtro duplicados e deixa somente os filtros corretos
//-----------------------------------------------------------------------------------------------------------------//
function clearFilterOnScreenAfterSaveStateScreen(arrDataSource, strScreenName) {

  strPathScreen = '#Win'+strScreenName+' #frm'+strScreenName;

  var arrNameFields = arrDataSource.reduce((arrData, objFilter) => {
    // se possui order e não é 99. Obs.: 99 é um valor padrão para quando nao possui uma order definida
    if( (objFilter.ordemfiltro > 0 && objFilter.ordemfiltro != 99) ) {
      // monta o objeto com os dados ...
      arrData.push(objFilter.nome);
    }

    return arrData;
  }, []);

  if( arrNameFields.length ) {

    $(strPathScreen+' #flt'+strScreenName+' > .filterItem').each( (idxFilterItem, objLineFilter) => {

      var idCurrentValue        = objLineFilter.dataset.value;
      var strNameOptionSelected = $(strPathScreen+' #filterField'+idCurrentValue+' > option:selected').val();

      if( arrNameFields.includes(strNameOptionSelected) ) {
        arrNameFields.forEach((strNameFilter, idxDataSorted) => {
          if (strNameFilter === strNameOptionSelected) {
            arrNameFields[idxDataSorted] = null;
            return;
          }
        });
      }
      else {
        objLineFilter.remove();
      }

    });

    if( $(strPathScreen+' .k-bg-blue.screen-filter-content #flt'+strScreenName+' > .filterItem').length === 1 ) {
      $(strPathScreen+' .k-bg-blue.screen-filter-content #BtnCleanFilter').remove();
    }
  }

  setFocusFirstField(strScreenName);

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Pega o valor do sort da coluna atual caso o mesmo exista
//-----------------------------------------------------------------------------------------------------------------//
function getSortFromColumnId(strScreenName, strIdColumn) {
  // Pega o campo atual
  let strClassSort = $('#Grd'+strScreenName+' [data-field="'+strIdColumn+'"] .k-link > span').attr('class');
  let nmsort = '';

  if( strClassSort != undefined ) {

    if( strClassSort.indexOf('desc') > -1 ) {
      nmsort = 'desc';
    }
    else if( strClassSort.indexOf('asc') > -1 ) {
      nmsort = 'asc';
    }
  }

  return nmsort;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Faz o salvamento da tela atual para o usuário atual
//-----------------------------------------------------------------------------------------------------------------//
function SaveStateScreen(strForm) {

  // Nome da consulta
  let strScreenName = strForm.replace('frm', '');
  // Caminho completo para o grid
  let strPathScreen = "#Win"+strScreenName+" #frm"+strScreenName;
  // Pega os filtros usados na tela
  let objFilterUsedOnScreen = getFilterDefaultScreen(strScreenName);

  //Vamos antecipar o pedido de gravação de tela
  let idJanela = $('#Win' + strScreenName).attr('data-windowid');

  kendo.ui.progress($(strPathScreen), true);

  (new FrontBox).yes_no("Deseja <strong>Salvar</strong> as configurações padrões da tela?").callback(function(btn) {
    if(btn == 'sim'){

    // Pega os dados dos filtros multiple select
    let aroFilterSelect = getFilterSelect(strScreenName);
    
    var aroColumnsTemp = new Array();
    
    // Percorre os filtros select e salva o valor do filtro para salvar
    aroFilterSelect.forEach(function(objFilterSelect){
      
      //Transformando em um objeto com duas posições
      const objColumnTemp = Object.assign({}, objFilterSelect);
      
      aroColumnsTemp.push(objColumnTemp);
    });
    
    // Pega a consulta da tela atual
    let objGrdQuery = $(strPathScreen + " #Grd"+strScreenName);
    // Pega o type da tela
    var strTypeKendo = GetTypeSearch(strForm, 'Grd'+strScreenName);
    //Pega o grid
    let grid = objGrdQuery.data(strTypeKendo);
    // Pega as colunas do grid
    let columnsGrid = grid.columns;
    
    //Verificando se possuem filtros para formação das novas colunas
    if(Array.isArray(aroColumnsTemp) == true){    
      (aroColumnsTemp).forEach(function(element,index){
        
        let name = (Object.keys(element))[0];  
        let select = Object.keys(element)[1];
        
        if(select == "flMultipleSelect"){
          typeSelect = "MS";
        }
        else{
          typeSelect = "DD";
        }
        
        var objColumnTemp = {
          "nmnome": name,
          "field": name,
          "cdordemgrid": "",
          "hidden": true,
          "width": 0,
          "ordemfiltro": (index + 2),
          "operadorfiltro": "in",
          "valorfiltro": aroColumnsTemp[index][name],
          "blfiltroselect": true,
          "nmmultipleselect": typeSelect 
        };
        
        //Adicionando as colunas ao grid
        columnsGrid.push(objColumnTemp);
      });
    }                        
    
    // Monta os dados para serem enviados ao controller
    let arrDataFields = [];
    // Totalizador das larguras das colunas
    let intTotalizerWidth = 0;
    // Largura da tela de consulta atual
    let intWidthScreen = objGrdQuery.width()-18;
    // Controla a ordem das colunas
    let intOrderGrid = 1;
    // Indice da ultima coluna visivel que possui tamanho setado
    let idxLastColumnVisibleWithWidth = -1;

    let objSave = {
      intHeightLineDefaultFilter: 28,
      intHeightDif: 2,
      intLimitHeightFilter: 138,
      intValidFilter: function() {
        return (Object.keys(getFilterDefaultScreen(strScreenName)).length) + this.intTotalityExtraFilter();
      },
      intTotalityExtraFilter: function() {
        // retorna o total de filtros adicionais na tela, desconsiderando o filtro: -> filtro padrao de todas as telas
        return ($('#Win'+strScreenName+' #frm'+strScreenName+' .k-bg-blue.screen-filter-content > table').length - 1);
      },
      blOwnExtraFilter: function() {
        return ($('#Win'+strScreenName+' #frm'+strScreenName+' .k-bg-blue.screen-filter-content > table').length >= 2);
      },
      intHeightValidFilter: function() {
        return (this.intValidFilter() * this.intHeightLineDefaultFilter);
      },
      intHeightActionsBar: $('#Win'+strScreenName+' #frm'+strScreenName+' #BarAcoes').height(),
      intHeightHeader: $('#Win'+strScreenName+' #frm'+strScreenName+' #splHeader').height(),
      intHeightCalculated: function() {
        return ((this.intHeightValidFilter() + this.intHeightActionsBar) + this.intHeightDif);
      },
      isKendoTreeList: function() {
        return ( GetTypeSearch('frm'+strScreenName, 'Grd'+strScreenName) === 'kendoTreeList' );
      },
      intSaveHeightFilters: function() {
        // quando a tela possui filtro extra e usa somente 1 filtro
        if(this.blOwnExtraFilter() && this.intValidFilter() === 1) {
          return 85;
        }
        // quando a tela não possui filtro extra e usa somente 1 filtro em tela
        else if(this.intValidFilter() === 1) {
          return 58;
        }
        else if(this.isKendoTreeList()) {
          let intHeightFilterContent = $('#Win'+strScreenName+' #frm'+strScreenName+' .k-bg-blue.screen-filter-content').height();
          let intHeightBarAcoes      = $('#Win'+strScreenName+' #frm'+strScreenName+' .k-bg-blue.screen-filter-content #BarAcoes').height();

          return (intHeightFilterContent + intHeightBarAcoes) + 5;
        }
        // nas situações que é preciso calcular o tamanho do filtro
        else {
          return (this.intHeightCalculated() > this.intLimitHeightFilter) ? this.intLimitHeightFilter : this.intHeightCalculated();
        }
      },
      intHeightPreview: function() {

        let intHeightCurrentGrid = $('#Win'+strScreenName+' #frm'+strScreenName+' #Grd'+strScreenName).height();
        let intHeightHeader    = this.intHeightHeader;

        // quando a tela do filtro é maior que deveria, ou seja, possui 2 linhas de filtros nas o usuário aumentou a area de filtros...
        let intDifLeftHeader  = (intHeightHeader - this.intSaveHeightFilters());
        intDifLeftHeader      = (intDifLeftHeader > 0) ? intDifLeftHeader : 0;

        let intDifFaltaHeader  = 0;
        // quando a tela do filtro é menor do que deveria, ou seja, possui 2 linhas de filtros mas o usuário diminuiu para 1 e salvou...
        if( intHeightHeader < this.intSaveHeightFilters() ) {
          // calcula a diferença para descontar do grid
          intDifFaltaHeader = (this.intSaveHeightFilters() - intHeightHeader);
        }

        return (intHeightCurrentGrid + intDifLeftHeader) - intDifFaltaHeader;

      },
      getDsPai: function() {
        return $('#Win'+strScreenName+' #frm'+strScreenName+' #dsIdPai').val();
      },
      blUseSort: function() {
        return (parseInt($('#frm'+strScreenName+' #Grd'+strScreenName + ' .k-grid-header tr[role="row"]').attr('data-idx-column-sort')) >= 0);
      },
      getSortValueDefault: function(strField) {
        return ['infologregistro', 'infologregistrocliente'].includes(strField) ? null : -1;
      },
      getColumnOrderSort: function(strField) {
        if(this.blUseSort()) {
          let strValue = this.getSortValueDefault(strField);
          //let strValue = -1;
          $('#frm'+strScreenName+' #Grd'+strScreenName + ' .k-grid-header tr[role="row"] > th').each(function(idx, objColumn) {
            // data-dir
            if( (objColumn.getAttribute('data-field') === strField) && (['asc', 'desc'].includes(objColumn.getAttribute('data-dir'))) ) {
              strValue = objColumn.getAttribute('data-idx-column-sort');
              return false;
            }
          });

          return strValue;
        }
      },
      getColumnNmSort: function(strField) {
        if(this.blUseSort()) {
          let strValue = this.getSortValueDefault(strField);
          $('#frm'+strScreenName+' #Grd'+strScreenName + ' .k-grid-header tr[role="row"] > th').each(function(idx, objColumn) {
            // data-field e data-dir - descrição do campo
            if( (objColumn.getAttribute('data-field') === strField) && (['asc', 'desc'].includes(objColumn.getAttribute('data-dir'))) ) {
              strValue = objColumn.getAttribute('data-dir');
              return false;
            }
          });

          return strValue;
        }
      }
    };

    let arrColumnWithoutWidth = [];
    let arrColumnWithoutWidthVisible = [];

    // Valida se existe Mais de 1 coluna sem widthGrid setado, se exisitir precisamos calcular esse valor,
    // pois se ficar sem width, a coluna vai sumir ...
    columnsGrid.forEach(function(columnGrid, indice) {

      let arrInfoLog = ['infologregistro', 'infologregistrocliente'];

      if( (columnGrid.width === undefined) && !(columnGrid.field.includes(arrInfoLog)) ) {
        arrColumnWithoutWidth.push(indice);
        if(columnGrid.hidden != true){
          arrColumnWithoutWidthVisible.push(indice);    
        }
      }

    });

    // Se existe mais de 1 coluna sem width setado precisamos calcular e setar esse valor,
    // para não gerar erro. Isso sera feito apenas se existir + de 1 coluna sem width, e desconsiderando a ultima.
    if( arrColumnWithoutWidth.length > 1 ) {
      for(let i = 0; i < arrColumnWithoutWidth.length-1; i++) {
        let intWidthColumn = columnsGrid[arrColumnWithoutWidth[i]].title.length * 9;
        //columnsGrid[arrColumnWithoutWidth[i]]['width'] = (intWidthColumn > 70) ? intWidthColumn : 70;
      }
    }
    
    // Percorre as colunas do grid e monta os dados para serem gravados
    columnsGrid.forEach(function(columnGrid, indice) {

      let objField = {};

      objField.nome               = columnGrid.field;
      objField.ordemgrid          = intOrderGrid++;
      objField.tamanhogrid        = columnGrid.width;
      objField.escondegrid        = (columnGrid.hidden === true) ? 1 : 0;
      objField.cdalturafiltrotela = objSave.intSaveHeightFilters();
      objField.cdordersort        = objSave.getColumnOrderSort(columnGrid.field);
      objField.nmsort             = objSave.getColumnNmSort(columnGrid.field);

      objField.cdalturavisualizacaotela = objSave.intHeightPreview();
      objField.nmmultipleselect   = '';

      //Verificando se trata-se de filtro Select
      if(columnGrid.blfiltroselect == true){

        objField.ordemfiltro = columnGrid.ordemfiltro;
        objField.operadorfiltro = columnGrid.operadorfiltro;
        objField.valorfiltro = columnGrid.valorfiltro;
        objField.nmmultipleselect = columnGrid.nmmultipleselect; 
      }
      
      // Percorre os filtros da tela e joga os valores em seus respectivos campos para posteriormente salvar ...
      Object.keys(objFilterUsedOnScreen).forEach(function(strNameKey) {
        if( objFilterUsedOnScreen[strNameKey]['name'] === objField.nome ) {
          objField.ordemfiltro    = objFilterUsedOnScreen[strNameKey]['position'];
          objField.operadorfiltro = objFilterUsedOnScreen[strNameKey]['operator'];
          objField.valorfiltro    = objFilterUsedOnScreen[strNameKey]['valuefilter'];
        }
      });
  
      // indice começa com 1
      // Valida se nao é a ultima posição do array
      // Valida se a coluna atual não é hidden
      // Situação: Faz a validação quando existe 1 coluna sem tamanho e as outras possuem tamanho.
      if((columnsGrid[indice] != undefined) && (columnGrid.hidden != true)) {
        if( objField.tamanhogrid > 0 ) {
          intTotalizerWidth += objField.tamanhogrid;
        }
        else {
          idxLastColumnVisibleWithWidth = indice;
        }
      }

      arrDataFields.push(objField);
    });

    var flColumnsWithoutWidth = false;
    
    // Quando a largura das colunas for menor que a tela, devemos calcular a diferenca de tamanho para preencher
    // o grid todo com as colunas, então vamos calcular o que esta 'sobrando' no grid, pegar esse valor e setar
    // na ultima coluna para preenchermos a tela toda ...
    if(intTotalizerWidth < intWidthScreen) {
      // Inicializa a diferença de valor da coluna
      let intDifWidth = 0;
      // Se for -1, quer dizer que todas as colunas possuem largura e não encontrou a posição corretamente
      // então vamos pegar a ultima coluna visivel
      if(idxLastColumnVisibleWithWidth === -1) {
        for(var i = columnsGrid.length-1; i >= 0; i--) {
          if(columnsGrid[i].hidden != true) {
            idxLastColumnVisibleWithWidth = i;
            // Pega o valor atual
            var intWidthColumn = arrDataFields[idxLastColumnVisibleWithWidth].tamanhogrid;
            // Calcula a diferença de valor
            intDifWidth = (intWidthScreen - intTotalizerWidth) + intWidthColumn;
            
            intDifWidth = intDifWidth / arrColumnWithoutWidthVisible.length; 
            flColumnsWithoutWidth = true;
            
            break;
          }
        }
      }
      else {
        // Calcula a diferença de valor
        intDifWidth = (intWidthScreen - intTotalizerWidth);
      }

      let blOwnGroup = grid.dataSource._group.length > 0;
      // Se usa group tira 27px da barra lateral do agrupamento
      if( blOwnGroup ) {
        const widthWraperGroup = 30;
        let intWidthBarGroup = (widthWraperGroup * grid.dataSource._group.length);
        intDifWidth = intDifWidth - intWidthBarGroup;
      }

      if( GetTypeSearch('frm'+strScreenName, 'Grd'+strScreenName) === 'kendoTreeList' ) {

        let idxLastColumnVisible = idxLastColumnVisibleWithWidth;
        // Se o id esta escondido, vamos descer 1 indice
        if( columnsGrid[0].hidden ) {
          idxLastColumnVisible -= 1;
        }

        //Faz o resize manual da coluna pois o kendotreelist não possui o metodo resizeColumn
        let objGroupCol = $('#frm'+strScreenName+' #Grd'+strScreenName).find('col:not(.k-group-col,.k-hierarchy-col):eq('+idxLastColumnVisible+')');
        // seta o tamanho no header do grid
        objGroupCol.css('width', intDifWidth);
        // seta o tamanho no conteudo, nas linhas do grid
        objGroupCol.add($('#frm'+strScreenName+' #Grd'+strScreenName+' .k-grid-content.k-auto-scrollable').find('col:not(.k-group-col):not(.k-hierarchy-col):eq('+idxLastColumnVisible+')')).css('width', intDifWidth);
      }
      else {
        // Seta o valor na tela
        if(flColumnsWithoutWidth){
          for(var j = 0; j <= arrColumnWithoutWidthVisible.length-1 ; j++) {
            grid.resizeColumn(grid.columns[arrColumnWithoutWidthVisible[j]], intDifWidth);
            
            // Seta o valor no modelo
            arrDataFields[arrColumnWithoutWidthVisible[j]].tamanhogrid = intDifWidth;  
          }
        }else{
          grid.resizeColumn(grid.columns[idxLastColumnVisibleWithWidth], intDifWidth);
          
          // Seta o valor no modelo
          arrDataFields[idxLastColumnVisibleWithWidth].tamanhogrid = intDifWidth;
        }    
      }
    }
      //Faz a requisição para gravação dos dados
      $.ajax({
        url: "sistema/controller/configuracaoconsulta/ctrConfiguracaoConsulta.php?action=Gravar",
        type: "post",
        data: {
          idJanela: idJanela,
          data: arrDataFields
        },
      }).done(function(response) {

        clearFilterOnScreenAfterSaveStateScreen(arrDataFields, strScreenName);

        var objKendoSplitter = $(strPathScreen+" #splConsulta").data("kendoSplitter");
        
        if(objKendoSplitter != undefined){
          objKendoSplitter.size(".k-pane:first", arrDataFields[0].cdalturafiltrotela);
          objKendoSplitter.size("#splMiddle", arrDataFields[0].cdalturavisualizacaotela);   
        } 
        
        Message(response.flDisplay, response.flTipo, response.dsMsg);

        let btnDeleteStateScreen = $(strPathScreen + " #Grd"+strScreenName + " #deleteStateScreen");
        btnDeleteStateScreen.removeClass('k-state-disabled');

        //Se o pedido de salvar veio do botão agrupamento, acionamos a janela de agrupamento
        if ($("#"+strForm+" #BtnAgrupaTelaConsulta").attr("data-acionado") == "true"){
          
          $("#"+strForm+" #BtnAgrupaTelaConsulta").attr("data-acionado", "false");
          configAgrupamentoTelaAtual();
        }
        else
        {
          //Caso contrário, mandamos de volta para a tela de origem 
          var strAcaoConsulta = getParamOtherScreen(strScreenName, idJanela);
          OpenWindow(idJanela, false, strAcaoConsulta);
        }

      });
    }
    kendo.ui.progress($(strPathScreen), false);
  });
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Faz o ajuste de altura do treelist. Usado pelo método columnResize, dentro da viw qnd usa o KendoTreeList
//-----------------------------------------------------------------------------------------------------------------//
function columnResizeTreeList(strNameScreen) {
  setCorrectHeightGrid(strNameScreen);
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Monta os filtros salvos como padrão da consulta
//-----------------------------------------------------------------------------------------------------------------//
function getFilterDefaultScreen(strForm) {

  // Array com os filtros selecionados em tela
  let strPathFilterScreen = '#Win'+strForm+' #frm'+strForm+' #flt'+strForm;

  let objFilter = {};

  $('#frm' + strForm + ' #flt' + strForm + ' .filterItem').each(function() {

    let idLine          = $(this).attr('data-value');
    let strNameField    = $(strPathFilterScreen + ' #filterField'+idLine).val();
    let strNameOperator = $(strPathFilterScreen + ' #filterOperator'+idLine).val();
    let strValorFiltro  = $(strPathFilterScreen + ' #filterValue'+idLine).val();

    if( strNameField != '' ) {

      if( objFilter[strNameField] === undefined ) {

        let currentFilter = {};

        currentFilter.name        = strNameField;
        currentFilter.position    = Object.keys(objFilter).length + 1;
        currentFilter.operator    = strNameOperator;
        currentFilter.valuefilter = strValorFiltro;

        objFilter[currentFilter.name] = currentFilter;
      }
    }
  });

  return objFilter;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Retorna uma lista com os filtros multiple select caso exista
//-----------------------------------------------------------------------------------------------------------------//
function getFilterSelect(strForm) {

  var aroUseMultipleSelect = [];
  var aroUseSelect = [];
                            
  //Obtendo todos os filtros select da tela  
  var aroSelect = $("#frm"+strForm+" #splHeader select");
  var aroSelect = jQuery.makeArray(aroSelect);
  var result = Array.isArray(aroSelect);
   
  var aroFilterSelect = []; 
  
  if(result == true){
    $(aroSelect).each(function(index,element){
  
      //Verificando se trata-se de filtro multipleSelect
      $flMultipleSelect = element.multiple;
      
      //Obtendo o id do filtro select da tela
      var idFilterScreen = element.id;
      
      if($flMultipleSelect == true){
        
        aroUseMultipleSelect[idFilterScreen] = $("#frm"+strForm+" #"+idFilterScreen).multipleSelect('getSelects').toString(); 
        aroUseMultipleSelect['flMultipleSelect'] = 'S';
        
        aroFilterSelect.push(aroUseMultipleSelect);
        
        //Limpando o objeto
        aroUseMultipleSelect = [];
      }
      else{
        //Verificando não trata-se de filtro padrão
        if(!(idFilterScreen.match(/filterField/)) && !(idFilterScreen.match(/filterOperator/))){
          aroUseSelect[idFilterScreen] = $("#frm"+strForm+" #"+idFilterScreen).val(); 
          aroUseSelect['flDropDownList'] = 'S'; 
        
          aroFilterSelect.push(aroUseSelect);
          
          //Limpando o objeto
          aroUseSelect = []; 
        }
      }
    });  
  }                            
  
  return aroFilterSelect;

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Deleta as configurações do state screen
//-----------------------------------------------------------------------------------------------------------------//
function DeleteStateScreen(strForm, strGrid) {

  var strScreenName = strForm.replace('frm', '');

  var idJanela = $("#Win"+strScreenName).attr("data-windowid");

  kendo.ui.progress($("#frm"+strScreenName), true);
  (new FrontBox).yes_no("Deseja Realmente <strong>Excluir</strong> as Configurações Padrões da Tela?").callback(function(btn) {
    if (btn == 'sim') {
      $.ajax({
        url: "sistema/controller/configuracaoconsulta/ctrConfiguracaoConsulta.php?action=Delete",
        type: "get",
        data: {
          idJanela: idJanela
        },
      })
      .done(function(response) {

        Message(response.flDisplay, response.flTipo, response.dsMsg);
        // Seleciona o botão
        var btnDeleteStateScreen = $("#frm"+strScreenName+" #Grd"+strScreenName + " #deleteStateScreen");
        btnDeleteStateScreen.addClass('k-state-disabled');

        var strAcaoConsulta = getParamOtherScreen(strScreenName, idJanela);

        OpenWindow(idJanela, false, strAcaoConsulta);
      });
    }
    kendo.ui.progress($("#frm"+strScreenName), false);
  })
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Retorna uma string com o parametro que foram adicionados na viw
//-----------------------------------------------------------------------------------------------------------------//
function getParamOtherScreen(strScreenName, idJanela) {

  let strParam        = '';
  let objParamsFilter = {};

  $.ajax({
    dataType: "json",
    url: "sistema/controller/janela/ctrJanela.php?action=GetDsAcaoJanela",
    async: false,
    type: "post",
    data: {
      idJanela: idJanela
    },
  }).done(function(dsAcao) {

    strParam = dsAcao;

    // Pega todos os campos que estao dentro do frmConsultaComunicado, desconsiderando o que vem depois ...
    $('#Win'+strScreenName+' #frm'+strScreenName+' > input[type=hidden]').each((idx, objInput) => {
      objParamsFilter[objInput.id] = objInput.value;
    });

    // Pega todos os campos que sao id e estao dentro da primeira table com type=text
    $('#Win'+strScreenName+' #frm'+strScreenName+' .k-bg-blue.screen-filter-content > table input[type=text]').each((idx, objInput) => {
      if( objInput.id.substr(0, 2) === 'id' ) {
        objParamsFilter[objInput.id] = objInput.value;
      }
    });

    // Pega todos os campos que sao id e estao dentro da primeira table com type=hidden
    $('#Win'+strScreenName+' #frm'+strScreenName+' .k-bg-blue.screen-filter-content > table input[type=hidden]').each((idx, objInput) => {
      if( objInput.id.substr(0, 2) === 'id' ) {
        objParamsFilter[objInput.id] = objInput.value;
      }
    });

    let idCurrent = objParamsFilter['dsIdPai'];

    // Essa parte pega o valor do id pai e joga na chave do indice atual. Ex.: idCliente ...
    if( idCurrent !== undefined ) {
      let idNewCurrent = idCurrent.replace(idCurrent.substr(2,1), idCurrent.substr(2,1).toUpperCase())
      objParamsFilter[idNewCurrent] = objParamsFilter['idPai'];
    }

    // Monta a string com os parametros que serao passados para o controllador
    Object.keys(objParamsFilter).forEach(function(strIndice, idx, arrValue) {
      strParam += '&'+strIndice+'='+objParamsFilter[arrValue[idx]];
    });

  });

  return strParam;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Declara o Componente Splitter
//-----------------------------------------------------------------------------------------------------------------//
function createSplitterQuery(strScreenName, intAlturaFiltroTela, intAlturaVisualizacaoTela) {

  if( getBlUseStateScreen(strScreenName) ) {

    var objDataHeightScreen = getHeightDataCalcScreen(strScreenName, intAlturaFiltroTela, intAlturaVisualizacaoTela);

    var strPathScreen       = '#Win'+strScreenName+' #frm'+strScreenName;

    $("#frm"+strScreenName+" #splConsulta").kendoSplitter({
      orientation: "vertical",
      panes: [
        {
          resizable: true,
          size: objDataHeightScreen.intAlturaFiltroTela
        }, //Header
        {
          resizable: true,
          size: objDataHeightScreen.intAlturaVisualizacaoTela,
          collapsible: false
        } //Footer
      ],
      resize: function(e) {

        var intDifTabStrip = 50;
        var intTabStrip    = $('#tabStrip'+strScreenName).height() - intDifTabStrip;

        $(strPathScreen+' #botton'+strScreenName+' #tabStrip'+strScreenName+' > div').each(function(idx, obj) {
          if( obj.dataset.role === 'treelist' ) {
            let objStyle = {
              padding: '0px 0px 0px 0px',
              overflow: 'hidden !important'
            }

            let objCurrentBotton = $('#frm'+strScreenName+' #botton'+strScreenName+' #'+obj.id);

            objCurrentBotton.css(objStyle);
            objCurrentBotton.css.backGroundColor = '#FFF !important';

            $('#frm'+strScreenName+' #'+obj.id+' .k-grid-content.k-auto-scrollable').css({'height' : 'calc(100% - 18px)'});

          }
          else {
            $('#frm'+strScreenName+' #botton'+strScreenName+' #'+obj.id).css({'height' : intTabStrip});
          }
        });

        var intHeightHeader = $('#Win'+strScreenName+' #frm'+strScreenName+' #splHeader').height();
        $(strPathScreen+' #splHeader').css({'overflow' : 'hidden'});
        $(strPathScreen+' #splHeader .k-bg-blue.screen-filter-content').css({'maxHeight' : intHeightHeader - 23});

        // Quando o resize do grid for realizado por uma tela que é KendoTreeList, vamos fazer i HeightGrid para corrigir os alinhamentos
        if( GetTypeSearch('frm'+strScreenName, 'Grd'+strScreenName) === 'kendoTreeList' ) {
          setCorrectHeightGrid(strScreenName);
        }
      }
    });

    var intDif          = 7 * 2; // tamanho da barra split
    var intHeightQuery  = parseInt($(strPathScreen+' #splConsulta').height());
    var intHeightFooter = parseInt($(strPathScreen+' #splFooter').height()) + intDif;
    var intHeightData   = parseInt(objDataHeightScreen.intAlturaFiltroTela) + parseInt(objDataHeightScreen.intAlturaVisualizacaoTela);

    // Vamos validar para saber se os dados setados em tela são superiores ao tamanho suportado pelo tamanho do monitor
    // caso seja devemos recalcular esses dados e setar novamente o tamanho da tela.
    if( (intHeightFooter + intHeightData) > intHeightQuery ) {

      var objHeightCalc         = getHeightCalcScreen(strScreenName);
      var objKendoSplitter      = $(strPathScreen+" #splConsulta").data("kendoSplitter");
      intAlturaFiltroTela       = objHeightCalc.intAlturaFiltroTela;
      intAlturaVisualizacaoTela = objHeightCalc.intAlturaVisualizacaoTela;

      objKendoSplitter.size(".k-pane:first", intAlturaFiltroTela);
      objKendoSplitter.size("#splMiddle", intAlturaVisualizacaoTela);
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Calcula a altura da tela
//-----------------------------------------------------------------------------------------------------------------//
function getHeightCalcScreen(strScreenName) {

  // se for 1 nao possui filtros adicionais na tela
  // se for 2, possui filtros adicionais na tela
  // se for 3, possui linhas de filtros adicionais
  var intQuantityLinesFilter = $('#Win'+strScreenName+' #frm'+strScreenName+' .k-bg-blue.screen-filter-content > table').length;

  // case 1
  var intHeightFilterScreen = 59;

  switch(intQuantityLinesFilter) {
    case 2:
      intHeightFilterScreen = 85;
      break;
    case 3:
      intHeightFilterScreen = 111;
      break;
  }

  var intHeightWindow = $('#Win'+strScreenName).height() - intHeightFilterScreen;
  var intHeightFooter = Math.round(intHeightWindow * 0.35);
  var intHeightPreviewScrren = Math.round(intHeightWindow - intHeightFooter);

  return {
    intAlturaFiltroTela : intHeightFilterScreen,
    intAlturaVisualizacaoTela : intHeightPreviewScrren
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Faz o calculo correto da altura do filtro e do conteudo do grid, retorna os valores
//-----------------------------------------------------------------------------------------------------------------//
function getHeightDataCalcScreen(strScreenName, intAlturaFiltroTela, intAlturaVisualizacaoTela) {

  // Se nao exsite valor setado, calcula o valor padrão
  if(((intAlturaFiltroTela === undefined) || (intAlturaVisualizacaoTela === undefined))) {
    var objHeightCalc = getHeightCalcScreen(strScreenName);

    intAlturaFiltroTela       = objHeightCalc.intAlturaFiltroTela;
    intAlturaVisualizacaoTela = objHeightCalc.intAlturaVisualizacaoTela;
  }
  else {
    if( getBlFromOtherQuery(strScreenName) ) {
      var objHeightCalc = getHeightCalcScreen(strScreenName);

      intAlturaFiltroTela       = objHeightCalc.intAlturaFiltroTela;
      intAlturaVisualizacaoTela = objHeightCalc.intAlturaVisualizacaoTela;
    }
    else {
      intAlturaFiltroTela       = intAlturaFiltroTela;
      intAlturaVisualizacaoTela = intAlturaVisualizacaoTela;
    }
  }

  return {
    intAlturaFiltroTela       : intAlturaFiltroTela,
    intAlturaVisualizacaoTela : intAlturaVisualizacaoTela
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Seta todo o css necessário para o correto funcionamento da tela
//-----------------------------------------------------------------------------------------------------------------//
function setCssSplitterScreen(strScreenName) {
  var strPathScreen  = ' #Win'+strScreenName+' #frm'+strScreenName;
  var strStyleCss    = '';
  var objTitleSystem = document.getElementsByTagName("title")[0];
  var blIsGovGestao  = (objTitleSystem.textContent.toLowerCase().search('gov') > 0);
  var strColorSystem = (blIsGovGestao) ? '#e0ecff' : '#e3eeef';

  strStyleCss  = strPathScreen+' #splConsulta #splHeader { background-color: '+strColorSystem+'; position: absolute; } ';
  strStyleCss += strPathScreen+' #BarAcoes { position: absolute; width: 100%; bottom: 0px; } ';
  strStyleCss += strPathScreen+' #splConsulta #splHeader .k-bg-blue.screen-filter-content { max-height: 58px; overflow: auto; } ';
  strStyleCss += strPathScreen+' #splConsulta #splFooter { height: inherit; } ';
  strStyleCss += strPathScreen+' #splConsulta #splFooter > div:nth-child(1) { height: inherit; overflow: hidden; } ';
  strStyleCss += strPathScreen+' #splConsulta #splFooter > div:nth-child(1) .k-tabstrip-wrapper > div { height: inherit; overflow: hidden; } ';
  strStyleCss += strPathScreen+' #botton'+strScreenName+' .k-tabstrip-wrapper { height: inherit; } ';
  strStyleCss += strPathScreen+' .k-item.k-state-default { z-index: 0; } ';
  strStyleCss += '#Win'+strScreenName+' .k-form { height: 99%; } ';
  strStyleCss += '#Win'+strScreenName+' .k-form > form { height: 100%; } ';
  strStyleCss += '#Win'+strScreenName+' .k-form #splConsulta { height: inherit; } ';
  strStyleCss += '#Win'+strScreenName+' .k-form #splConsulta #splMiddle { overflow: hidden; } ';
  strStyleCss += strPathScreen+' .k-header-column-menu.k-state-active { z-index: 0; } ';
  strStyleCss += strPathScreen+' #splConsulta #splMiddle > div { height: 100% !important; } ';
  strStyleCss += strPathScreen+' .k-splitter { border-width: 0px !important; } ';
  strStyleCss += strPathScreen+' .k-i-hbar { margin-top: 2px !important; height: 2px !important; } ';

  objHead     = document.head || document.getElementsByTagName('head')[0],
  objNewStyle = document.createElement('style');
  objNewStyle.type = 'text/css';

  objHead.appendChild(objNewStyle);

  if (objNewStyle.styleSheet) {
    objNewStyle.styleSheet.cssText = strStyleCss;
  }
  else {
    objNewStyle.appendChild(document.createTextNode(strStyleCss));
  }

}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Carrega os valores usados como padrão no filtro, quando usa splitter
//-----------------------------------------------------------------------------------------------------------------//
function LoadFilterSplitter(strScreenName, arrDataSource) {

  var arrFilter = [];

    if( getBlUseStateScreen(strScreenName) ) {

      $("#frm"+strScreenName+" #flt"+strScreenName+" .filterItem" ).each(function() {

        intIndex = $(this).attr("data-value");

        let strFilterField    = $("#frm"+strScreenName+" #filterField"+intIndex).data("kendoDropDownList").value();
        let strFilterOperator = $("#frm"+strScreenName+" #filterOperator"+intIndex).data("kendoDropDownList").value();
        let strFilterValue    = $.trim($("#frm"+strScreenName+" #filterValue"+intIndex).val());

        if (strFilterValue != '') {

          let intIndice = undefined;
          let nmType    = '';
          let strAlias  = '';

          // Pega o indice do filtro atual
          intIndice = arrDataSource.reduce((intIndice, objData, idx) => {
            if( objData.name === strFilterField ) {
              intIndice = idx;
            }
            return intIndice;
          }, intIndice);

          if( intIndice >= 0 ) {
            nmType   = arrDataSource[intIndice].type;
            strAlias = arrDataSource[intIndice].alias;
          }

          let objFilter = {
            field    : strFilterField,
            operator : strFilterOperator,
            value    : strFilterValue,
            type     : nmType
          };

          // se tiver alias seta no object
          if( strAlias != '' ) {
            objFilter.alias = strAlias;
          }

          arrFilter.push(objFilter);
        }

      });

    }

    return arrFilter;
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Função responsavel por setar o width na coluna quando necessario.
//-----------------------------------------------------------------------------------------------------------------//
function setWidthOnShowColumnGrid(objEvent, strScreenName) {

  var blFromInteractionUser = $("#frm"+strScreenName+" #Grd"+strScreenName + " #deleteStateScreen").length > 0;
  var strTypeKendo = GetTypeSearch('frm'+strScreenName, 'Grd'+strScreenName);

  if(blFromInteractionUser && (strTypeKendo != 'kendoTreeList') ) {

    // Pega a consulta
    var objGrdConsulta = $("#frm"+strScreenName+" #Grd"+strScreenName);
    // Pega o grid da tela
    var grid = objGrdConsulta.data(strTypeKendo);
    // Largura da tela visivel
    var intWidthScreen = objGrdConsulta.width() - 40;
    // Pega as colunas do grid
    var columns = grid.columns;

    var objColumns = {};
    objColumns.sumWidthAllColumns = null;
    objColumns.idxColumnWithoutWidth = null;

    objColumns = columns.reduce((objColumns, objColumn) => {

      if(objColumn.hidden != true) {
        if( objColumn.width > 0 ) {
          objColumns.sumWidthAllColumns += objColumn.width;
        }
        else {
          objColumns.fieldColumnWithoutWidth = objColumn.field;
        }
      }

      return objColumns;

    }, objColumns);

    if( objColumns.sumWidthAllColumns > intWidthScreen ) {

      columns.forEach((objColumn, idx) => {
        if( objColumn.field === objColumns.fieldColumnWithoutWidth ) {
          grid.resizeColumn(grid.columns[idx], 266.6);
        }
      });

    }
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Esse método por enquanto não foi implementado, mas futuramente pode ser usado, ja foi criado para
// não termos o trabalho de adiciona-ló posteriormente em todas as views
//-----------------------------------------------------------------------------------------------------------------//
function setWidthOnHideColumnGrid(objEvent, strScreenName) {}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
// Calcula e seta a altura do filtro, grid e automaticamente a visualização
//-----------------------------------------------------------------------------------------------------------------//
function setHeightScreen(strScreenName, cdalturafiltrotela, cdalturavisualizacaotela) {

  let strPathScreen = '#Win'+strScreenName+' #frm'+strScreenName;

  let objDataHeightScreen = getHeightDataCalcScreen(strScreenName, cdalturafiltrotela, cdalturavisualizacaotela);
  let objKendoSplitter    = $(strPathScreen + " #splConsulta").data("kendoSplitter");

  if( objKendoSplitter != undefined ) {
    // Pega a altura do valor atual
    let intHeightFilter = parseInt(objKendoSplitter.size(".k-pane:first"));
    let intDifFilter    = intHeightFilter - parseInt(objDataHeightScreen.intAlturaFiltroTela);
    let intHeightMiddle = parseInt(objKendoSplitter.size("#splMiddle")) + ((intDifFilter > 0) ? intDifFilter : 0);

    objKendoSplitter.size(".k-pane:first", objDataHeightScreen.intAlturaFiltroTela);
    objKendoSplitter.size("#splMiddle", intHeightMiddle);
  }
}
//-----------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------//
//Função que lista e configura os campos de agrupamento das consultas
//-----------------------------------------------------------------------------------------------------------------//
function configAgrupamentoTelaAtual(){
      
  //Pega o nome/id do Form
  var strNmForm = $("form").attr("id");      
  //Tela atual 
  var strTelaAtual = strNmForm.substring(3,strNmForm.length);      
  //Sendo assim o nome do Grid será 
  var strNmGrid = 'Grd'+strTelaAtual;      
  //Pega o nome da tela de consulta
  var campoTelaConsulta = 'Win'+strTelaAtual+'_wnd_title';
  var strNmTelaConsulta = $("#DivWindowArea #"+campoTelaConsulta).text();    
  //Pega o ID da Janela atual
  var nmJanela = "Win"+strTelaAtual;
  var idJanela = $("#"+nmJanela).attr("data-windowid");
          
  //verifica se existem configurações de consulta para a tela atual
  $.post('sistema/controller/agrupamentoconsulta/ctrAgrupamentoConsulta.php?action=ListCamposAgrupamento&idJanela='+idJanela+'&nmJanela='+nmJanela,
    function(response){ 
    //Se possui configuração para essa tela, permite o agrupamento, caso contrário não.
      if (response.blPossuiConfiguracao == true){
                
        //Vamos pegar os nomes e o título dos campos usados para agrupamento, percorrendo o grid.
        var arrColunas = [];
        var grdColunas = $("#"+strNmGrid).data("kendoGrid").columns;
            
        if (grdColunas.length > 0){            
          for (var i=0; i < grdColunas.length; i++){
            var grdColAtual = grdColunas[i];
            
            //validamos a coluna e removemos flTipo, que é o campo multiple select.
            if (grdColAtual != undefined) { 
              if (grdColAtual.field != "flTipo"){
                var objCampos = {'nmcampoconsulta' : grdColAtual.field, 'dstitulo' : grdColAtual.title};
                arrColunas.push(objCampos);   
              }          
            }                 
          }
        }
        //Chamamos a tela que fará a configuração do agrupamento de consultas
        OpenWindow(2599, true, 'winConsulta&strColunas='+JSON.stringify(arrColunas)+'&strNmTelaConsulta='+strNmTelaConsulta+'&idJanela='+idJanela); 
        }
        else
        {
          //Informa que o botão de agrupamento foi acionado
          $("#"+strNmForm+" #BtnAgrupaTelaConsulta").attr("data-acionado", "true");
          SaveStateScreen(strNmForm);  
        }  
    },
      'json'
  );      
}
//-----------------------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------------------//
// Esta função verifica se existe agrupamento de campos configurado para a tela atual
//-----------------------------------------------------------------------------------------------------------------------------//
function getAgrupamentoTelaAtual( arrDataSource ){

  var arrTemp = [];
  var arrGroup = [];
        
  //Verifica se existe configuração de agrupamento para o campo atual
  for( var i = 0; i < arrDataSource.length; i++ ) {
    if (arrDataSource[i].cdordemgrupo > 0 && arrDataSource[i].cdordemgrupo != " "){
      arrTemp[i] = { field: arrDataSource[i].name, cdordemgrupo : arrDataSource[i].cdordemgrupo };
    }
  }
  
  //Configuramos a ordem de agrupamento
  arrTemp.sort(function(campo1, campo2){
    return campo1.cdordemgrupo - campo2.cdordemgrupo;  
  });
  
  //Associamos ao novo array apenas o campo necessário
  for( var i = 0; i < arrTemp.length; i++ ) {
    if (arrTemp[i]){
      arrGroup[i] = { field: arrTemp[i].field};  
    } 
  }
  
  return arrGroup;
}  
//-----------------------------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------------------------//
//Verifica se existe uma configuração de agrupamento para exibir no dataSource
//-----------------------------------------------------------------------------------------------------------------------------//
function verificaAgrupamentoTelaAtual(arrDataSource, agrupamentoPadrao){
      
  var arrGroup = [];
      
  //Acessa a função para verificar se já existe agrupamento personalizado
  var arrTemp = getAgrupamentoTelaAtual(arrDataSource);
  if (arrTemp.length > 0){
    arrGroup = arrTemp;    
  }
  else
  {
    arrGroup = agrupamentoPadrao;  
  } 
  return arrGroup;  
}
//-----------------------------------------------------------------------------------------------------------------------------//