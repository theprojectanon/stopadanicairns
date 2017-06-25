/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework, Template) {

  return MediumFramework.View.extend({

    name: "header",

    el: {
      selector: ".header",

      bind: {
        '$el:hero': '.hero',
        '$el:title': '.hero--items',
      },

      on: {

      }
    },

    props: {

    },

    fn: {

      init: function() {
        this.bind();
        this.fn.update();
      },

      update: function () {
        clearTimeout(this.props.timeout);
        this.props.$el.title.removeClass('reverse');
        this.props.$el.title.eq(0).dataset.active = (+this.props.$el.title.eq(0).dataset.active % 5) + 1;
        this.props.timeout = setTimeout(function () {
          this.props.$el.title.addClass('reverse');
          this.props.timeout = setTimeout(this.fn.update, 1500);
        }.bind(this), 7000);
      },

      render: function () {

      }
    }
  });

});
