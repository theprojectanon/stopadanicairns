/*

  Default application template.

*/

define([
  "framework",
  "text!template/home.html",
], function (MediumFramework, Template) {

  return MediumFramework.View.extend({

    name: "adani",

    el: {
      selector: ".main",

      bind: {
        '$el:main': '.main',
      },

      on: {

      }
    },

    props: {

    },

    fn: {

      init: function() {
        this.autoBind();
      },

      render: function () {
        this.bind();
        var top = window.pageYOffset || document.documentElement.scrollTop,
            scrollY = top + $('.facebook').eq(0).getBoundingClientRect().top;
        window.scroll(0, scrollY - $('.nav--outer').eq(0).clientHeight);
        $('#nav--toggle').eq(0).checked = false;
      }
    }
  });

});
