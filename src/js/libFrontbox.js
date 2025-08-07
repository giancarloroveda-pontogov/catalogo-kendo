/**
 * jquery.frontbox v1.0
 * Copyright (C) 2015 Afraware Technology Inc.
 * Licensed under the MIT license.
 * Created by Milad Rahimi [http://miladrahimi.com] on 5 March 2015.
 * http://afraware.com/product/jquery-plugin/frontbox
 * https://github.com/afraware/frontbox
 */
// jQuery Plugin Syntax
function FrontBox() {
    // Properties
    this.id = 1;
    this.obj = '#frontbox_1';
    this.type = "alert";
    this.cb = false;
    // Construct base elements of the dialog box
    this.create = function (message, title, direction) {
        // Check if body does exist or not
        var body = $('body');
        if (!body.length) {
            alert("FrontBox need the body element to perform your request.");
            return;
        }
        // Create a unique ID and object for the box (to support nested boxes)
        for (this.id = 1; $(this.obj).length; this.id++) this.obj = '#frontbox_' + this.id;
        var obj = this.obj;
        // Add the box elements to body
        body.append(
            '<div id="' + obj.substr(1) + '">' +
            '<div class="frontbox-back">' + '<div id="dialog" class="frontbox-main">' +
            '<div class="frontbox-close">x</div>' + '<div class="frontbox-title"></div>' +
            '<div class="frontbox-message"></div>' + '<div class="frontbox-prompt"></div>' +
            '<div class="frontbox-button-bar"></div>' + '</div>' + '</div>' + '</div>'
        );
        // Set Title and Message
        $(obj + ' .frontbox-title').html(title);
        $(obj + ' .frontbox-message').html(message);
        // Set direction RTL if required
        if (direction != undefined && direction == "rtl") {
            $(obj + ' .frontbox-main').css({
                'border-right-width': '5px',
                'border-left-width': '0'
            });
            $(obj + ' .frontbox-close').css({
                'left': '15px',
                'right': 'auto'
            });
            $(obj + ' .frontbox-main').css({
                'direction': 'rtl'
            });
        }
        this.callback();
    };
    // Display the box
    this.display = function () {
        //$(this.obj + ' .frontbox-back').fadeIn('fast'); //Comentado pelo Jonny
        //$(this.obj + ' .frontbox-main').fadeIn('slow'); //Comentado pelo Jonny
        $(this.obj + ' .frontbox-back').show();
        $(this.obj + ' .frontbox-main').show();
    };
    // Disappear
    this.disappear = function () {
        $(this.obj).hide();
        //$(this.obj).fadeOut("fast"); //Comentado pelo Jonny
        //$(this.obj).remove(); //By Jonny!!!
    };
    // Set Callback
    this.callback = function (callback) {
        // Me
        var me = this;
        // If callback is defined
        if (callback && callback.constructor && callback.call && callback.apply) {
            // Notify there is some callback
            this.cb = true;
            // Common: Close Button
            $(document).on("click", me.obj + ' .frontbox-close', function () {
                me.disappear();
                callback("close");
                me.disappear();
            });
            // Text Prompt: Return the answer
            if (me.type == 'text') {
                $(document).on('click', me.obj + ' .frontbox-btn', function () {
                    var ans = $(me.obj + ' input').val();
                    if (ans != '') {
                        var btn = 'ok';
                        callback(btn, ans);
                        me.disappear();
                    }
                });
            }
            // Selection Prompt: Return the answer
            else if (me.type == 'selection') {
                $(document).on('click', me.obj + ' .frontbox-btn', function () {
                    var ans = $(me.obj + ' select').val();
                    if (ans != "_null") {
                        var btn = "ok";
                        callback(btn, ans);
                        me.disappear();
                    }
                });
            }
            // Other me.types: Return the button name
            else {
                $(document).on('click', me.obj + ' .frontbox-btn', function () {
                    callback($(this).val().toLowerCase());
                    me.disappear();
                });
            }
        } else {
            $(document).on("click", me.obj + ' .frontbox-close', function () {
                if (!me.cb) me.disappear();
            }).on("click", me.obj + ' .frontbox-btn', function () {
                if (!me.cb) me.disappear();
            });
        }
    };
    // Message/Alert
    this.alert = function (message, title, direction) {

        if (message == undefined) message = "This is an alert!";
        if (title == undefined) title = "Informação!";
        this.create(message, title, direction);
        $(this.obj + ' .frontbox-button-bar').append('<input type="button" role="img" class="frontbox-btn" value="OK"/><i></i>');
        $(this.obj + ' .frontbox-main').addClass("frontbox-info");
        this.display();
        return this;
    };
    // Message/Success
    this.success = function (message, title, direction) {
        if (message == undefined) message = "The operation done successfully!";
        if (title == undefined) title = "Sucesso!";
        this.create(message, title, direction);
        //$(this.obj + ' .frontbox-button-bar').append('<div class="frontbox-btn">OK</div>');
        $(this.obj + ' .frontbox-button-bar').append('<input type="button" role="img" class="frontbox-btn" value="OK"/>');
        //$(this.obj + ' .frontbox-main').css({'border-color': 'rgb(39,174,96)'});
        $(this.obj + ' .frontbox-main').addClass("frontbox-succes");
        this.display();
        return this;
    };
    // Message/Warning
    this.warning = function (message, title, direction) {
        if (message == undefined) message = "The operation has some consequences!";
        if (title == undefined) title = "Atenção!";
        this.create(message, title, direction);

        var BtnDlg = "BtnDlg"+this.id;
        $(this.obj + ' .frontbox-button-bar').append('<input id="'+BtnDlg+'" role="img" type="button" class="frontbox-btn" value="OK"/>');
        setTimeout(function(){$('#'+BtnDlg).focus();},500);

        $(this.obj + ' .frontbox-main').addClass("frontbox-warning");
        this.display();
        return this;
    };
    // Message/Error
    this.error = function (message, title, direction) {
        if (message == undefined) message = "The operation failed!";
        if (title == undefined) title = "Erro!!!";
        this.create(message, title, direction);

        var BtnDlg = "BtnDlg"+this.id;
        $(this.obj + ' .frontbox-button-bar').append('<input id="'+BtnDlg+'" role="img" type="button" class="frontbox-btn" value="OK"/>');
        setTimeout(function(){$('#'+BtnDlg).focus();},500);

        $(this.obj + ' .frontbox-main').addClass("frontbox-error");
        this.display();
        return this;
    };
    // Question/Yes_No
    this.yes_no = function (message, title, direction) {
        if (message == undefined) message = "Do you want to do this operation?";
        if (title == undefined) title = "Confirmação";
        this.create(message, title, direction);

        var BtnSim = "BtnSim"+this.id;
        var BtnNao = "BtnNao"+this.id;
        
        //$(this.obj + ' .frontbox-button-bar').append('<input name="'+BtnSim+'" id="'+BtnSim+'" class="frontbox-btn" type="button" value="Sim"/>').append('<input id="'+BtnNao+'" type="button" class="frontbox-btn" value="Não"/>');
        $(this.obj + ' .frontbox-button-bar').append('<input type="button" role="img" id="'+BtnSim+'" tabindex="1001" class="frontbox-btn" value="Sim"/>');
        $(this.obj + ' .frontbox-button-bar').append('<input type="button" role="img" id="'+BtnNao+'" tabindex="1002" class="frontbox-btn" value="Não"/>');
        $(this.obj + ' .frontbox-main').addClass("frontbox-info");
        this.display();

        var objBtn = $('#'+BtnSim);

        setTimeout(function(){objBtn.focus();}, 100);
        setTimeout(function(){objBtn.focus();}, 200);
        setTimeout(function(){objBtn.focus();}, 300);
        setTimeout(function(){objBtn.focus();}, 500);
        setTimeout(function(){objBtn.focus();}, 1000);

        return this;
    };
    // Question/OK_Cancel
    this.ok_cancel = function (message, title, direction) {
        if (message == undefined) message = "The operation will getting started.";
        if (title == undefined) title = "Confirmação";
        this.create(message, title, direction);
        $(this.obj + ' .frontbox-button-bar').append('<div class="frontbox-btn">OK</div>').append(
            '<div class="frontbox-btn">Cancel</div>');
        this.display();
        return this;
    };
    // Question/Retry_Ignore_Abort
    this.retry_ignore_abort = function (message, title, direction) {
        if (message == undefined) message = "There is a problem in performing the operation.";
        if (title == undefined) title = "Confirmação";
        this.create(message, title, direction);
        $(this.obj + ' .frontbox-button-bar').append('<div class="frontbox-btn">Retry</div>').append(
            '<div class="frontbox-btn">Ignore</div>').append('<div class="frontbox-btn">Abort</div>');
        this.display();
        return this;
    };
    // Prompt/Text
    this.text = function (message, title, placeholder, direction) {
        if (message == undefined) message = "Enter your text:";
        if (title == undefined) title = "Message";
        if (placeholder == undefined) placeholder = "Enter...";
        this.create(message, title, direction);
        $(this.obj + ' .frontbox-button-bar').append('<div class="frontbox-btn">OK</div>');
        $(this.obj + ' .frontbox-prompt').show().append('<input type="text" placeholder="' + placeholder + '">');
        this.type = "text";
        this.display();
        return this;
    };
    // Prompt/Selection
    this.selection = function (message, title, options, placeholder, direction) {
        if (message == undefined) message = "Select one of these options:";
        if (title == undefined) title = "Message";
        if (placeholder == undefined) placeholder = "Select...";
        if (options == undefined || !$.isArray(options)) options = [];
        this.create(message, title, direction);
        $(this.obj + ' .frontbox-button-bar').append('<div class="frontbox-btn">OK</div>');
        $(this.obj + ' .frontbox-prompt').append(
            '<select title="' + title + '"><option value="_null">' + placeholder +
            '</option></select>').show();
        var id = this.obj;
        $.each(options, function (key, value) {
            value = $.trim(value);
            if (value != '') $(id + ' .frontbox-prompt select').append('<option>' + value + '</option>');
        });
        this.type = "selection";
        this.display();
        return this;
    };
    // The End!
}