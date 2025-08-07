/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	config.FloatingPanelsZIndex = 1000000;
  config.uiColor = '#e4edff';
  config.allowedContent = true;

  config.toolbar_Document = [
    ['Undo','Redo','-','Source','-','Cut','Copy','Paste','PasteText','PasteFromWord','-','Find','Replace','-','SelectAll'],
    ['SpellChecker', 'Scayt','-','Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ],
    ['NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],'/',
    ['BidiLtr','BidiRtl','textindent','-','Link','Unlink','-','TextColor','BGColor'],
    ['Image','Table','Border','HorizontalRule','Smiley','SpecialChar','-','Styles','Format','Font','FontSize','-','ShowBlocks']
  ];
  config.toolbar_Inline = [
    ['Paste','PasteText','PasteFromWord','-','Bold','Italic','Underline','Strike','Subscript','Superscript','-','NumberedList','BulletedList','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','textindent','-','Link','Unlink','-','TextColor','BGColor','-','Image','Table','Border']
  ];
  config.toolbar_HeaderFooter = [
    ['Bold','Italic','Underline','Strike'],
    ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl','textindent','-','TextColor','BGColor','-','Font','FontSize','-','Image','Table','Border','-','Sourcedialog']
  ];

  config.pasteFromWordRemoveFontStyles = "true";
  config.cloudServices_tokenUrl = true;
  config.cloudServices_uploadUrl = true;
  config.extraPlugins = ['bidi','textindent'];
};
