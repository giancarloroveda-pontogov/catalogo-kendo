// MultiSelectBox, Kendo Plugin
// -----------------------------------------------------------
(function ($) {
    var MultiSelectBox = window.kendo.ui.DropDownList.extend({

        init: function (element, options) {
            var me = this;
            // setup template to include a checkbox
            options.template = kendo.template(
                kendo.format('<input type="checkbox" name="{0}" value="#= {1} #" />&nbsp;<label for="{0}">#= {2} #</label>',
                    element.id + "_option_" + options.dataValueField,
                    options.dataValueField,
                    options.dataTextField
                )
            );
            // create drop down UI
            window.kendo.ui.DropDownList.fn.init.call(me, element, options);
            // setup change trigger when popup closes
            me.popup.bind('close', function () {
                var values = me.ul.find(":checked")
                    .map(function () { return this.value; }).toArray();
                // check for array inequality
                if (values < me.selectedIndexes || values > me.selectedIndexes) {
                    me._setText();
                    me._setValues();
                    me.trigger('change', {});
                }
            });
        },

        options: {
            name: "MultiSelectBox"
        },

        selectedIndexes: [],

        _accessor: function (vals, idx) { // for view model changes
            var me = this;
            if (vals === undefined) {
                return me.selectedIndexes;
            }
        },

        value: function (vals) {
            var me = this;
            if (vals === undefined) { // for view model changes
                return me._accessor();
            } else { // for loading from view model
                var checkboxes = me.ul.find("input[type='checkbox']");
                if (vals.length > 0) {
                    // convert to array of strings
                    var valArray = $(vals.toJSON())
                        .map(function() { return this + ''; })
                        .toArray();
                    checkboxes.each(function () {
                        this.checked = $.inArray(this.value, valArray) !== -1;
                    });
                    me._setText();
                    me._setValues();
                }
            }
        },

        _select: function(li) { }, // kills highlighting behavior
        _blur: function () { }, // kills popup-close-on-click behavior

        _setText: function () { // set text based on selections
            var me = this;
            var text = me.ul.find(":checked")
                .map(function () { return $(this).siblings("label").text(); })
                .toArray();
            me.text(text.toString().replace(/,/g, ', '));
        },
        _setValues: function () { // set selectedIndexes based on selection
            var me = this;
            var values = me.ul.find(":checked")
                .map(function () { return this.value; })
                .toArray();
            me.selectedIndexes = values;
        }

    });

    window.kendo.ui.plugin(MultiSelectBox);

})(jQuery);