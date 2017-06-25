/*

  Default application template.

*/

define([
  "framework",
], function (MediumFramework) {

  return MediumFramework.Module.extend({

    name: "youtube",

    props: {
      _: {
        map: {
          state: ["unstarted", "ended", "playing", "paused", "buffering", "", "video cued"],
          event: {
            infodelivery: "update",
            statechange: "state"
          }
        },
        registered: []
      }
    },

    fn: {

      init: function() {
        $(window).on('message', this.fn.on.msg);
        this.on("register", this.fn.on.register);
        this.on("msg", this.fn.on.send.msg);
        this.on("cmd", this.fn.on.send.cmd);
        this.on("play", this.fn.on.shortcut.play);
        this.on("pause", this.fn.on.shortcut.pause);
        this.on("seek", this.fn.on.shortcut.seek);
        this.on("toggle", this.fn.on.shortcut.toggle);
      },

      register: function ($el, id) {
        if(!$el.src.match(/youtube/)) return console.warn("Not YouTube:", $el);

        var iframe = {
          target: $el,
          origin: $el.src.replace(/\/embed.*/, "")
        };        
        this.props._.registered.push(iframe);
        if(id) {
          iframe.id = id;
          this.props[id].push(iframe);
        }
        iframe.index = this.props._.registered.length;
        this.set(`_:${$el.xpath()}`, iframe);

        $el.on('load', this.fn.on.load);
      },

      send: {
        msg: function ($list, message) {
          this.fn.retrieve($list).forEach(function (iframe) {
            if(message.id) message.id = iframe.index;
            iframe.target.contentWindow
            .postMessage(JSON.stringify(message), iframe.origin);
          }.bind(this));
        },

        cmd: function ($el, command, args) {
          this.fn.send.msg($el, {
            event: "command",
            func: command,
            args: args || [],
            id: true,
          });
        }
      },

      retrieve: function ($el) {
        if( this._.isString($el) ) {
          if($el==="_") return [];
          $el = this.props[ $el ].map(function () {
            return $el.target;
          });
        }
        var $list = this._.isNodeList($el) || this._.isArray($el) ? $el : [$el];
        return $list.map(function ($el) {
          return this.get(`_:${$el.xpath()}`);
        }.bind(this))
        .filter(function (iframe) {
          return !!iframe;
        });
      },

      on: {
        register: function ($list, id) {

          if(id==="_") {
            console.warn("YouTube: invalid registration ID '_'");
            id = false;
          }

          // list is a selector
          if(this._.isString($list)) $list = $($list);

          // list is a single node
          else if(!this._.isNodeList($list)) $list = [$list];

          // make accessible via props
          if(id) this.set(id, this.props[id] || [], false);

          $list.forEach(function ($el) {
            this.fn.register($el, id);
          }.bind(this));
        },

        send: {
          msg: function ($el, message) {
            this.fn.send.msg.apply(this, arguments)
          },

          cmd: function () {
            this.fn.send.cmd.apply(this, arguments)
          }
        },

        shortcut: {
          play: function ($el) {
            this.fn.send.cmd($el, "playVideo");
          },

          pause: function ($el) {
            this.fn.send.cmd($el, "pauseVideo");
          },

          seek: function ($el, time, allowSeekAhead) {
            this.fn.send.cmd($el, "seekTo", [time, allowSeekAhead ? 1 : 0]);
          },

          toggle: function ($el) {
            this.fn.retrieve($el).forEach(function (iframe) {
              this.fn.send.cmd($el, iframe.state === "playing" ? "pauseVideo" : "playVideo");
            }.bind(this));
          },
        },

        msg: function (e) {
          try {
            var data = JSON.parse(e.data);
          } catch(e){ return; }

          var iframe = this.props._.registered[data.id - 1],
          event = data.event.replace(/^on/, "").toLowerCase(),
          ns = [this.props._.map.event[event] || event];

          if(!iframe) return;

          iframe.info = this._.extend(iframe.info || {}, data.info);
          iframe.time = iframe.info.currentTime;
          iframe.state = this.props._.map.state[(iframe.info.playerState || -1) + 1];

          if(iframe.id) ns.push(iframe.id);
          this.trigger(`${ns.join(":")}`, iframe);

          if(iframe.time && !iframe.buffered) {
            iframe.buffered = true;
            ns[0] = "buffered";
            this.trigger(`${ns.join(":")}`, iframe);
          }
        },


        load: function (e) {
          this.fn.send.cmd(e.target, "addEventListener", ["onStateChange"]);
          this.fn.send.msg(e.target, {
            event: "listening",
            id: true,
          });
        }
      }
    }
  });

});
