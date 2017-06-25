/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework, Template) {

  return MediumFramework.View.extend({

    name: "signup",

    el: {
      selector: "body",

      bind: {
        '$el:signup:container': '.signup',
        '$el:signup:form': '.signup form',
        '$el:signup:name': '#name',
        '$el:signup:email': '#email',
        '$el:signup:botcheck': '#noname',
      },

      on: {
        'submit': {
          delegate: '.signup form',
          fn: 'on:submit'
        },
        'focusin.signup focusout.signup': {
          delegate: '.signup input',
          fn: 'on:focus'
        },
        'input.signup': {
          delegate: '.signup input',
          fn: 'on:input'
        },
        'click.reset': {
          delegate: '.overlay--error .button--generic',
          fn: 'on:reset'
        }

      }
    },

    props: {

    },

    fn: {

      init: function() {
        this.bind();

        this.on(":router:involved", this.fn.render);
      },

      on: {
        focus: function (e) {
          if(e && e.type=="focusin") this.props.$el.signup.container.addClass('focus');
          else this.props.$el.signup.container.removeClass('focus');
        },

        input: function (e) {
          this.props.name = this.props.$el.signup.name.eq(0).value,
          this.props.email = this.props.$el.signup.email.eq(0).value;
          if(this.props.name || this.props.email) this.props.$el.signup.container.addClass('open');
          else this.props.$el.signup.container.removeClass('open');
          if(e) e.target.parentElement.dataset.value = e.target.value;
        },

        submit: function (e) {
          e.preventDefault();
          if(!this.props.name || !this.props.email || this.props.$el.signup.botcheck.eq(0).value) return;

          var fname = this.props.name.replace(/^(\S*)\s?.*/, '$1').toLowerCase(),
          lname = this.props.name.replace(/^(\S*)\s?(.*)/, '$2').toLowerCase(),
          data = {
            FNAME: fname.slice(0,1).toUpperCase() + fname.slice(1),
            LNAME: lname.split(" ").map(function (name) {
              return name.slice(0,1).toUpperCase() + name.slice(1);
            }).join(" "),
            EMAIL: this.props.email.toLowerCase(),
          };

          this.fn.state("loading");

          // submit form (json-p)
          var fn = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 5),
              script = document.createElement('script');
              
          window[fn] = function (e) {
            delete window[fn];
            if(e.result && e.result==="success") this.fn.state("success");
            else this.fn.state("error");
          }.bind(this);

          script.src = [this.props.$el.signup.form.eq(0).action + fn, this._.serialise(data)].join("&");
          $('head').eq(0).appendChild(script);

          /*require([this.props.$el.signup.form.eq(0).action + '&' + this._.serialise(data)], function (e) {
            if(e.result && e.result==="success") this.fn.state("success");
            else this.fn.state("error");
          }.bind(this));*/
        },

        reset: function (e) {
          e.preventDefault();
          this.fn.state("");
        }
      },

      state: function (state) {
        this.props.$el.signup.container.eq(0).dataset.state = state;
      },

      render: function () {
        this.props.$el.signup.container.eq(0).scrollIntoView({
          behaviour: 'smooth'
        });
        $('#nav--toggle').eq(0).checked = false;
      }
    }
  });

});
