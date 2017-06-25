/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework) {

  return MediumFramework.View.extend({

    name: "video",

    el: {
      selector: ".video",

      bind: {
        '$el:iframe': '.video iframe',
        '$el:player': '.video video'
      },

      on: {
        
      }
    },

    props: {

    },

    fn: {

      init: function() {
        // return;
        this.bind();

        this.props.$el.player.on('playing', this.fn.on.ready);

        $(window).on('resize', this.fn.on.resize);
        this.fn.on.resize();
      },

      on: {
        resize: function () {
          var player = this.props.$el.player.eq(0),
          size = player.dataset.srcSizes.split(",").reduce(function (size, variation) {
            if(size) return size;
            var split = variation.split("|"),
                width = split[1] ? +split[1] : 0;
            return window.innerWidth<=width ? split[0] || "" : size;
          }, "");

          if(size===this.props.size) return;
          this.props.size = size;

          player.dataset.size = size;
          player.muted = true;
          player.src = size ? player.dataset.src.replace(/\.[^.]+$/, '_' + size + '$&') : player.dataset.src;
        },

        ready: function () {
            this.$el.eq(0).dataset.ready = "";
        },
      }
    }
  });

});
