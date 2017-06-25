/*

  Application Router

*/

define([
  "framework",
], function (MediumFramework) {
  return MediumFramework.Router.extend({

    name: 'router',

    props: {
      routes: {
        home:     '',
        adani:    {
          title: "What is Adani?",
          route: 'what-is-adani',
        },
        involved: {
          title: "How to get involved",
          route: 'how-to-get-involved',
        },
        'events':   'local-events',
        'news':     'in-the-news',
        'missing':  {
          title: 'Home',
          route: '*missing'
        }
      }
    },

    fn: {
      init: function () {
        /*
          Github Pages: Single Page App Workaround
            - 404 redirects to base url
            - previous URL stored in session data
            - JS redirect would not work with FB
         */
        // if(sessionStorage.redirect) {
        //   history.replaceState(null, null, sessionStorage.redirect);
        //   delete sessionStorage.redirect;
        // }
        this.on(":router:before", this.fn.on.before);
        this.start();
      },

      on: {
        before: function () {
          $('body').attr('data-route-prev', this.props.current ? this.props.current.name : "");
        }
      }
    }
  });

});
