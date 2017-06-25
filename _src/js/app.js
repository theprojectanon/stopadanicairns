/*

  Default application template.

*/

define([
  "framework",
  "controller/router",
  "view/home",
  "view/adani",
  "view/hero",
  "view/video",
  "view/signup",
], function (MediumFramework, Router, HomeView, AdaniView, HeroView, VideoView, SignupView) {

  return MediumFramework.Module.extend({

    name: 'app',

    fn: {
      init: function () {

        HomeView.init();
        AdaniView.init();
        HeroView.init();
        VideoView.init();
        SignupView.init();
        Router.init();

      }
    }

  });
});
