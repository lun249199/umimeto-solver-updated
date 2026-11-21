if (window.$) {
  // avoid multiple solvers
  if (window.sstop_timer) {
    window.sstop_btn();
  }

  window.sstop_hide_temp_key = 'P'.charCodeAt(0);
  window.sstop_hide_temp_key_selecting = false;
  window.sstop_hide_temp_key_selecting_allowed = true;

  window.update_sstop_hide_temp_key = function () {
    // if the user is selecting the new key
    if (sstop_hide_temp_key_selecting) {
      $('#select_keybind').text('PRESS KEY...');
      $('#select_keybind').parent().css({ 'margin-bottom': '' });
      $('#select_keybind_moreinfo').hide();
    } else {
      charcode = window.sstop_hide_temp_key;
      string = String.fromCharCode(charcode);
      if (charcode == 13) {
        string = '[ENTER]';
      } else if (charcode == ' '.charCodeAt(0)) {
        string = '[SPACE]';
      }

      $('#select_keybind').text(string);
      $('#select_keybind_moreinfo').show();

      if (string.length > 1) {
        $('#select_keybind_moreinfo').children(':first').children(':first').css({ 'padding-left': '4.5rem', width: 'max-content', display: 'inline-block', 'padding-top': '0.7rem' });
        // $($("#select_keybind")[0].parentNode.parentNode).css({"padding-bottom":""})
        $('#select_keybind').parent().css({ 'margin-bottom': '-1rem' });
      } else {
        $($('#select_keybind_moreinfo')[0].children[0].children[0]).css({ 'padding-left': '', width: '', display: '', 'padding-top': '' });
        // $($("#select_keybind")[0].parentNode.parentNode).css({"padding-bottom":"7px"})
        $('#select_keybind').parent().css({ 'margin-bottom': '' });
      }
    }
  };

  document.body.insertAdjacentHTML('beforeend', '<script type="text/javascript" class="sstop-trash" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js"><\/script>');
  document.body.insertAdjacentHTML('beforeend', "<style class='sstop-trash'> @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap'); </style>");

  function LoadCSS (e) { return new Promise(function (n, t) { const o = document.createElement('link'); o.rel = 'stylesheet', o.href = e, o.classList.add('sstop-trash'), document.head.appendChild(o), o.onload = function () { n(); }; }); }

  window.toNodeList = function (arrayOfNodes) {
    const fragment = document.createDocumentFragment();
    arrayOfNodes.forEach(function (item) {
      fragment.appendChild(item.cloneNode());
    });
    return fragment.childNodes;
  };

  window.sstop_timer = {
    running: false,
    iv: 5000,
    timeout: false,
    cb: function () {},
    start: function (cb, iv) {
      const elm = this;
      clearInterval(this.timeout);
      this.running = true;
      if (cb) this.cb = cb;
      if (iv) this.iv = iv;
      this.timeout = setTimeout(function () { elm.execute(elm); }, this.iv);
    },
    execute: function (e) {
      if (!e.running) return false;
      e.cb();
      if (e.running) {
        e.start();
      }
    },
    stop: function () {
      this.running = false;
    },
    set_interval: function (iv) {
      clearInterval(this.timeout);
      this.start(false, iv);
    }
  };

  window.sstop_paused = false;

  function range (start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    const length = Math.max(Math.ceil((stop - start) / step), 0);
    const range = Array(length);

    for (let idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  window.sstop_alert = function (message) {
    console.log('[umimeto-solver]: ' + message);
    alert('[umimeto-solver]\n\n' + message);
  };

  // create slide_menu
  document.body.insertAdjacentHTML('beforeend', `
<div class="nav-slide" style="box-sizing: content-box;">
  <div class="btn-slide"></div>
  <div class="nav-body">
      <div class="head-slide">Main Settings</div>
      <div class="body-slide">
          <ul class="nav">
              <li><div style="padding-top: 1px;"><button type='button' style='position: relative; margin: 5px auto auto; display: block;' id='sstop_button' class='tooltip fade' data-title='Completely remove the solver' onclick='window.sstop_btn()'>STOP<br>ANSWERING</button></div></li>
              <li><div id="sstop_slider_div" class="tooltip fade" data-title="Answering speed"><input onmouseover="sstop_fs_info_text.show();" onmouseleave="sstop_fs_info_text.hide()" oninput="sstop_fs_info_text.set(&quot;'The answering delay is ' + sstop_slider.value() + ' ms'&quot;); if (!window.sstop_paused) {window.sstop_timer.set_interval(window.sstop_slider.value());}" id="sstop_slider" style="margin: 5px auto auto; display: block;" type="range" min="300" max="4000" value="-700"></div></li>
              <li><div><button class='tooltip fade' data-title='Toggle the solver state' type='button' style='z-index: 0 !important; position: relative; margin: 5px auto auto; display: block; height: 1.5rem;' id='sstop_pause_button' onclick='window.sstop_pause_btn(this)'><i class="fa fa-pause hv-black"></i></button></div></li>
              <li><p style="text-align: center; text-align: center; display: grid;" class="cur-default" ><i style="font-size: 0.78rem;" id="sstop_status">(playing)</i></p></li>
          </ul>
      </div>
  </div>
  <div class="nav-body">
      <div class="head-slide">Additional Settings</div>
      <div class="body-slide">
          <ul class="nav">
              <li style="padding-bottom: 7px;">
                <div style="padding-top: 5px; margin: 5px auto auto; display: block; padding-left: 5px;">
                  <span style="font-size: 0.9rem;color: #34495e;font-weight: 510;">Key to temporarily hide the menu: </span>
                  <button data-title="Use this keybind when you quicky need to completely hide the menu" id="select_keybind" class="tooltip fade bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" style="">
                    P
                  </button>
                  <div id="select_keybind_moreinfo" style="display: inline-flex;">
                    <div style="display: block; width: 4rem; height: 1.5rem; line-height: 1em;position: relative;top: -0.5rem;">
                      <span style="font-size: 0.8rem;color: #34495e; opacity: 0.6;">(click to change)</span>
                    </div>
                  </div>
                </div>
              </li>
          </ul>
      </div>
  </div>
  <div class="nav-body">
      <div class="head-slide">Additional Info</div>
      <div class="body-slide">
          <ul class="nav">
              <li style="padding-bottom: 7px;">
                <p style="display: grid; color: #34495e; margin-bottom: 0; margin: 3px; line-height: 1.2;" class="cur-default">
                  <span>
                    • Use scroll wheel when hovering over speed slider to quickly change the speed
                  </span>
                  <span style="margin-top: 10px;">
                    • Press <span style="font-weight:bolder;">SPACE</span> to quickly pause answering
                  </span>
                </p>
              </li>
          </ul>
      </div>
  </div>
</div>
`);

  LoadCSS('https://netdna.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css').then(function () {
    // do stuff

  });

  LoadCSS('https://mp3martin.github.io/umimeto-solver/assets/jquery-slide-menu/jquery-slide-menu.css').then(function () {
    // do stuff

  });

  const slide_menu_script = document.createElement('script');
  slide_menu_script.onload = function () {
    $('.nav-slide').SlideMenu({
      speedLR: 200,
      speedUD: 300,
      expand: true
    });

    setTimeout(function () {
      let sstop_slider_scroll = document.getElementById('sstop_slider');
      try {
        sstop_slider_scroll.addEventListener('wheel', function (e) {
          if (e.deltaY < 0) {
            this.valueAsNumber += 100;
          } else {
            this.value -= 100;
          }
          e.preventDefault();
          e.stopPropagation();
          this.oninput();
        });
      } catch (e) {}

      try {
        sstop_slider_scroll.addEventListener('mousedown', function (event) {
          if (event.button == 1 || event.buttons == 4) {
            this.value = -700 + window.sstop_slider.min;
          }
        });
      } catch (e) {}

      sstop_slider_scroll = null;
    }, 100);

    setTimeout(function () {
      try {
        $('#sstop_slider').attr('value', Number($('#sstop_slider').attr('value')) + window.sstop_slider.min);
        $($('p .cur-default, .nav-no-hover').slice(-1)[0]).css({ 'margin-bottom': '3px', 'margin-top': '5px' });

        $(window).on('keypress', function (event) {
          key = String.fromCharCode(event.keyCode).toUpperCase().charCodeAt(0);
          // if the user is not typing into text input box
          if (!$('input[type=text]').is(':focus')) {
            // if we are waiting for a new keybind to be set
            if (sstop_hide_temp_key_selecting) {
              event.preventDefault();

              sstop_hide_temp_key = key;
              sstop_hide_temp_key_selecting = false;
              window.update_sstop_hide_temp_key();

              if (String.fromCharCode(key) === ' ') {
                // $("#select_keybind").click()
                // window.sstop_hide_temp_key_selecting = false;
                // window.update_sstop_hide_temp_key()

              }
            } else {
              // console.log(key)
              // console.log(sstop_hide_temp_key)
              if (key === sstop_hide_temp_key) {
                event.preventDefault();
                if ($('.nav-slide')[0].style.left != '-200px') {
                  $($('.nav-slide')[0]).toggle(150);
                } else {
                  $($('.nav-slide')[0]).toggle({ effect: 'fade', duration: 150 });
                }
              } else if (key === ' '.charCodeAt(0)) {
                event.preventDefault();
                document.getElementById('sstop_pause_button').click();
              }
            }
          }
        });

        const target51745 = document.querySelector('#select_keybind');
        document.addEventListener('click', (event) => {
          key = event.keyCode;

          if (sstop_hide_temp_key_selecting_allowed == true) {
            const withinBoundaries = event.composedPath().includes(target51745);

            if (withinBoundaries) {
              sstop_hide_temp_key_selecting = !sstop_hide_temp_key_selecting;
              window.update_sstop_hide_temp_key();
            } else {
              sstop_hide_temp_key_selecting = false;
              window.update_sstop_hide_temp_key();
            }
          }
        });

        document.addEventListener('keydown', (event) => {
          key = event.key;
          if (key == 'Enter' || key == 'Spacebar' || key == ' ') {
            sstop_hide_temp_key_selecting_allowed = false;
            // console.log("Keydown: " + key)
          }
        });

        document.addEventListener('keyup', (event) => {
          key = event.key;
          if (key == 'Enter' || key == 'Spacebar' || key == ' ') {
            setTimeout(function () {
              sstop_hide_temp_key_selecting_allowed = true;
            }, 200);
            // console.log("Keyup: " + key)
          }
        });
      } catch (e) {}
    }, 100);

    // add special style to settings options
    for (nav of Array.prototype.slice.call(document.getElementsByClassName('nav'))) {
      nav.insertAdjacentHTML('beforeend', '<li><p class="cur-default nav-no-hover" ><i><br></i></p></li>');
      for (li of Array.prototype.slice.call($(nav).children())) {
        el = li.childNodes[0];

        try {
          el.style.margin = 'auto';
          el.style.display = 'block';
          el.style.marginTop = '5px';
        } catch (e) {}
      }
    }

    try {
      // reload pause menu
      window.sstop_pause_btn(document.getElementById('sstop_pause_button'));
      window.sstop_pause_btn(document.getElementById('sstop_pause_button'));
    } catch (e) {}
  };

  slide_menu_script.src = 'https://mp3martin.github.io/umimeto-solver/assets/jquery-slide-menu/jquery-slide-menu.js';
  // slide_menu_script.src = "https://raw.githack.com/MP3Martin/public-assets/master/js/jquery-slide-menu/jquery-slide-menu.js?min=1";

  slide_menu_script.classList.add('sstop-trash');

  document.head.appendChild(slide_menu_script); // or something of the likes

  let tailwindcss_script = document.createElement('script');
  tailwindcss_script.onload = function () {
    const tailwindcss_script_config = document.createElement('script');
    tailwindcss_script_config.type = 'text/javascript';
    tailwindcss_script_config.text = `
    tailwind.config = {
      corePlugins: {
        preflight: false,
      }
    }
    `;
    tailwindcss_script_config.classList.add('sstop-trash');
    document.head.appendChild(tailwindcss_script_config);
  };
  tailwindcss_script.src = 'https://cdn.tailwindcss.com';
  tailwindcss_script.classList.add('sstop-trash');
  document.head.appendChild(tailwindcss_script); // or something of the likes

  window.sstop_slider = {
    value: function () {
      const output = (Math.abs($('#sstop_slider').val())) + window.sstop_slider.min;
      return output;
    },

    min: 300
  };

  // $("#sstop_slider").attr("min", (($("#sstop_slider").attr("max") - window.sstop_slider.min) * -1));
  // $("#sstop_slider").attr("max", 0);

  // automatically update sstop_slider html values
  window.sstop_slider_interval = setInterval(function () {
    $('#sstop_slider').attr('min', (2000 - window.sstop_slider.min) * -1);
    $('#sstop_slider').attr('max', 0);
  }, 10);

  // create info text
  document.body.insertAdjacentHTML('beforeend', "<div id='sstop_info_text' style='position:fixed; font-size: 1.3rem; bottom:0; left:0; margin:5px; padding-right:4px; height: 1rem; opacity: 0.9;'></div>");
  document.getElementById('sstop_info_text').insertAdjacentHTML('beforeend', '<p> </p>');

  // prepare info text animation
  $('#sstop_info_text').css('transition', 'transform 300ms ease-out');
  $('#sstop_info_text').css('transform', 'scale(1)');
  // $("#sstop_info_text").css('left', Number(Number(document.getElementById("sstop_info_text").offsetWidth + 1) * -1) + 'px')

  window.sstop_info_text = {
    show: function () {
      // $("#sstop_info_text").css('transition', 'none')
      $('#sstop_info_text').css('transform', 'scale(1.5)');
      // $("#sstop_info_text").css('left', Number(Number(document.getElementById("sstop_info_text").offsetWidth + 1) * -1) + 'px')
      // $("#sstop_info_text").effect("highlight", {}, 1000);
      $('#sstop_info_text').fadeIn();
      setTimeout(function () {
        $('#sstop_info_text').css('transform', 'scale(1)');
      }, 10);
    },

    hide: function () {
      $('#sstop_info_text').fadeOut(200);
      setTimeout(function () {
        $('#sstop_info_text').hide();
      }, 200);
    },

    set: function (text) {
      document.getElementById('sstop_info_text').innerText = text;
      if (Math.floor(Math.random() * 9) == 5) {
        $('#sstop_info_text').effect('shake', { times: 1, distance: 1, direction: 'up' }, 100);
      }
      // if ($("#sstop_info_text").is(":hidden")) {
      //   window.sstop_info_text.show()
      // }
    }
  };

  $('#sstop_info_text').hide();

  window.sstop_pause_btn = function (el) {
    if (window.sstop_paused) {
      window.sstop_paused = false;
      try {
        document.getElementById('sstop_slider').oninput();
      } catch (e) {}
      $(el).css({ 'background-color': 'orange', transition: 'background-color 0.2s ease-out' });
      $(el.childNodes[0]).addClass('fa-pause');
      $(el.childNodes[0]).removeClass('fa-play');

      document.getElementById('sstop_status').innerText = '(running)';
      document.getElementById('sstop_status').style.color = 'darkgreen';
    } else {
      window.sstop_paused = true;
      try {
        sstop_timer.set_interval(2147483647);
      } catch (e) {}
      $(el).css({ 'background-color': 'greenyellow', transition: 'background-color 0.2s ease-out' });
      $(el.childNodes[0]).removeClass('fa-pause');
      $(el.childNodes[0]).addClass('fa-play');

      document.getElementById('sstop_status').innerText = '(paused)';
      document.getElementById('sstop_status').style.color = 'orange';
    }
  };

  document.body.insertAdjacentHTML('beforeend', '<script id="sstop_vendor_prefixes_script" src="https://cdnjs.cloudflare.com/ajax/libs/css3finalize/4.0.1/jquery.css3finalize.min.js"></script>');

  // create fs info text
  document.body.insertAdjacentHTML('beforeend', "<div id='sstop_fs_info_text' style='pointer-events: none; background-color: rgba(0, 0, 0, 0.15); position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; z-index: 9999999999;'></div>");
  document.getElementById('sstop_fs_info_text').insertAdjacentHTML('beforeend', "<h1 style='margin: 0; padding: 0; text-align: center; font-family: Share Tech Mono, monospace; position: fixed; top: 45%; left: 0; right: 0; margin-top: -7vh; font-size: calc((3vw + 3vh) * 0.7); color: rgba(166, 230, 212, 0.96); text-shadow: 0.03em 0 black, 0 0.03em black, -0.03em 0 black, 0 -0.03em black, -0.03em -0.03em black, -0.03em 0.03em black, 0.03em -0.03em black, 0.03em 0.03em black, 3px 3px 8px rgba(0,0,0,0.99), rgba(0, 0, 0, 0.99) 2px 2px 8px;'>Hello World</h1>");

  // -- prepare animation --
  // $($("#sstop_fs_info_text")[0].childNodes[0]).css('transition', 'transform 300ms ease-out')
  // $($("#sstop_fs_info_text")[0].childNodes[0]).css('transform', 'scale(1)')
  $($('#sstop_fs_info_text')[0].childNodes[0]).hide();

  window.sstop_fs_info_text_delay = null;

  // jQuery.fn.tracking = function () {
  //   this.data('hovering', false);

  //   this.hover(function () {
  //     $(this).data('hovering', true);
  //   }, function () {
  //     $(this).data('hovering', false);
  //   });

  //   return this;
  // };

  // jQuery.fn.hovering = function () {
  //   return this.data('hovering');
  // }

  // setTimeout( function(){
  //   for (var i = 0; i < 3; i++) {
  //     el = document.getElementsByClassName("nav")[0].children[i]
  //     $(el).tracking();
  //     // setTimeout( function(){
  //     //   $(el).tracking();
  //     // }, 10);
  //   }
  // }, 300);

  window.sstop_slider_distance_x = 0;
  window.sstop_slider_distance_y = 0;

  $(document).mousemove(function (event) {
    mX = event.pageX;
    mY = event.pageY;
    el_distance = measureDistance($('#sstop_slider'), mX, mY);
    window.sstop_slider_distance_x = el_distance[0];
    window.sstop_slider_distance_y = el_distance[1];
    // console.log("x: " + sstop_slider_distance.x + "\n" + "y: " + sstop_slider_distance.y)
  });
  function measureDistance (my_element, mouseX, mouseY) {
    try {
      x = Math.floor(Math.sqrt(Math.pow(mouseX - (my_element.offset().left + (my_element.width() / 2)), 2)));
      y = Math.floor(Math.sqrt(Math.pow(mouseY - (my_element.offset().top + (my_element.height() / 2)), 2)));
    } catch (e) { return [0, 0]; }
    return [x, y];
  }

  window.sstop_fs_info_text = {
    show: function () {
      try {
        if (!sstop_fs_info_text_delay) {
          $($('#sstop_fs_info_text')[0].childNodes[0]).promise().done(function () {
            $($('#sstop_fs_info_text')[0].childNodes[0]).css('top', '45%');
            // $($("#sstop_fs_info_text")[0].childNodes[0]).css('transform', 'scale(1.5)')
            $($('#sstop_fs_info_text')[0].childNodes[0]).show();
            $($('#sstop_fs_info_text')[0].childNodes[0]).animate({
              top: '+=5%',
              opacity: 1
            }, 300, function () { /* Animation complete. */ });

            setTimeout(function () {
              // $($("#sstop_fs_info_text")[0].childNodes[0]).css('transform', 'scale(1)')
            }, 10);

            $('#sstop_fs_info_text').fadeIn({ duration: 400, easing: 'swing' });
          });
        }
      } catch (e) {}

      try {
        clearTimeout(window.sstop_fs_info_text_delay);
      } catch (e) {}
    },

    hide: function (delay = 150) {
      window.sstop_fs_info_text_delay = setTimeout(function () {
        try {
          $($('#sstop_fs_info_text')[0].childNodes[0]).promise().done(function () {
            try {
              $($('#sstop_fs_info_text')[0].childNodes[0]).animate({
                top: '+=5%',
                opacity: 0
              }, 300, function () {
                setTimeout(function () {
                  try {
                    $($('#sstop_fs_info_text')[0].childNodes[0]).css('top', '45%');
                  } catch (e) {}
                }, 10);
              });
            } catch (e) {}

            $('#sstop_fs_info_text').fadeOut({ duration: 400, easing: 'swing' });
          });
        } catch (e) {}

        window.sstop_fs_info_text_delay = null;
      }, delay);

      // if the cursor is far away from sstop_slider, the sstop_fs_info_text will close without delay
      setTimeout(function () {
        if (sstop_fs_info_text_delay) {
          if (sstop_slider_distance_x >= 80 && sstop_slider_distance_y >= 40) {
            window.sstop_fs_info_text.hide(0);
            window.sstop_fs_info_text_delay = null;
            // console.log("closed faster!  " + Math.random())
          }
        }
      }, 80);
    },

    set: function (text) {
      sstop_fs_info_text.text = text;
    },

    text: "'Loading...'"
  };

  $('#sstop_fs_info_text').hide();

  window.sstop_fs_info_text_interval = setInterval(function () {
    $($('#sstop_fs_info_text')[0].childNodes[0])[0].innerText = eval(window.sstop_fs_info_text.text);
  }, 10);

  // create stop button
  document.body.insertAdjacentHTML('beforeend', "<div id='sstop' style='position:fixed; top:0; right:0; margin:5px; padding-right:4px;'></div>");
  document.body.insertAdjacentHTML('beforeend', `
<style id="sstop_style">
#sstop_button {
  color: #ffffff;
  background-color: #cc0000;
  font-size: 19px;
  border-radius: 12px;
  padding: 10px 15px;
  cursor: pointer
}

#sstop_button:hover {
  color: #000000;
  background-color: #ef2929;
}
    
#sstop_slider {
    /* */
}

#sstop_pause_button {
  color: #00000;
  background-color: orange;
  font-size: 19px;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer
}

#sstop_pause_button:hover {
  color: #000000;
}

.hv-black:hover {
  color: #000000 !important;
  background-color: revert !important;
}
    
/* setup tooltips */
  .tooltip {
    position: relative;
    z-index: 99 !important;
  }
  .tooltip:before,
  .tooltip:after {
    display: block;
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }
  .tooltip:after {
    border-right: 6px solid transparent;
    border-bottom: 6px solid rgba(51,74,62,.90);
    z-index: 99 !important;
    border-left: 6px solid transparent;
    content: '';
    height: 0;
      top: 20px;
      left: 20px;
    width: 0;
  }
  .tooltip:before {
    background: rgba(51,74,62,.90);
    border-radius: 2px;
    color: #fff;
    font-weight: bold;
    content: attr(data-title);
    font-size: 14px;
    padding: 6px 10px;
      top: 26px;
    white-space: nowrap;
  }

  /* the animations */
  /* fade */
  .tooltip.fade:after,
  .tooltip.fade:before {
    transform: translate3d(0,-10px,0);
    transition: all .15s ease-in-out;
  }
  .tooltip.fade:hover:after,
  .tooltip.fade:hover:before {
    opacity: 1;
    transform: translate3d(0,0,0);
  }

  /* expand */
  .tooltip.expand:before {
    transform: scale3d(.2,.2,1);
    transition: all .2s ease-in-out;
  }
  .tooltip.expand:after {
    transform: translate3d(0,6px,0);
    transition: all .1s ease-in-out;
  }
  .tooltip.expand:hover:before,
  .tooltip.expand:hover:after {
    opacity: 1;
    transform: scale3d(1,1,1);
  }
  .tooltip.expand:hover:after {
    transition: all .2s .1s ease-in-out;
  }

  /* swing */
  .tooltip.swing:before,
  .tooltip.swing:after {
    transform: translate3d(0,30px,0) rotate3d(0,0,1,60deg);
    transform-origin: 0 0;
    transition: transform .15s ease-in-out, opacity .2s;
  }
  .tooltip.swing:after {
    transform: translate3d(0,60px,0);
    transition: transform .15s ease-in-out, opacity .2s;
  }
  .tooltip.swing:hover:before,
  .tooltip.swing:hover:after {
    opacity: 1;
    transform: translate3d(0,0,0) rotate3d(1,1,1,0deg);
  }

  .cur-default {
    cursor: default;
  }

  .nav-no-hover {
    background: #CCC !important;
  }

</style>
`);
  stop_div = document.getElementById('sstop');
  stop_div.innerHTML = '';

  // stop_div.innerHTML += "<div id='sstop_wrapper' style='position:static; margin:0;'></div>"
  // sstop_wrapper = document.getElementById("sstop_wrapper")

  // sstop_wrapper.innerHTML += "<button type='button' style='position: relative;' id='sstop_button' onclick='window.sstop_btn()'>STOP<br>ANSWERING</button>"
  // sstop_wrapper.innerHTML += "<br>"

  // sstop_wrapper.innerHTML += '<div style="position: absolute;" id="sstop_slider_div" class="tooltip fade" data-title="Answering speed"></div>'
  // document.getElementById("sstop_slider_div").innerHTML += '<input onchange="1!=window.sstop_paused&&window.sstop_timer.set_interval(this.value);" id="sstop_slider" type="range" min="300" max="5000" value="1500" style="position: absolute;">'

  window.sstop = function () {
    window.sstop_timer.stop();
  };

  window.sstop_btn = function () {
    try {
      $(window).unbind('keypress');
    } catch (e) {}

    // remove elements
    window.sstop_rm();

    // stop timer
    sstop();

    // remove variables
    window.sstop_timer = null;
    window.sstop_alert = null;
    window.sstop_btn = null;
    window.sstop = null;
    window.toNodeList = null;
    window.sstop_rm = null;
    window.LoadCSS = null;
    window.sstop_paused = null;

    window.sstop_slider = null;
    window.sstop_info_text = null;
    clearInterval(window.sstop_slider_interval);
    clearInterval(window.sstop_fs_info_text_interval);
    window.sstop_slider_interval = null;
    window.sstop_fs_info_text = null;
    window.sstop_fs_info_text_delay = null;
    window.sstop_slider_distance_x = null;
    window.sstop_slider_distance_y = null;
    window.sstop_hide_temp_key = null;
    tailwindcss_script = null;
    tailwindcss_script_config = null;
    window.sstop_hide_temp_key_selecting = null;
    window.update_sstop_hide_temp_key = null;
    window.sstop_hide_temp_key_selecting_allowed = null;
    window.tailwind = null;
  };

  window.sstop_rm = function () {
    try {
      // remove elements
      document.getElementById('sstop').remove();
      document.getElementById('sstop_style').remove();
      document.getElementById('sstop_vendor_prefixes_script').remove();
      document.getElementsByClassName('nav-slide')[0].remove();
      document.getElementById('sstop_info_text').remove();
      document.getElementById('sstop_fs_info_text').remove();
      for (i in range(20)) {
        for (trash of document.getElementsByClassName('sstop-trash')) {
          trash.remove();
        }
      }
    } catch (error) {}
  };

  window.addEventListener('resize', resized);

  resized();

  function resized () {
    document.getElementById('sstop_slider').style.width = parseInt((95 / 100) * document.getElementById('sstop_button').offsetWidth) + 'px';
  }


  async function answer_doplnovacka () {
    if (window.doplnovackaBusy) return;
    const questionElement = document.querySelector('.question-content');
    const cards = [...document.querySelectorAll('.options .card')];
    if (!questionElement || !cards.length) return;
    const normalize = value => String(value ?? '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
    const extractText = value => {
      if (Array.isArray(value)) {
        if (value[0] === 'text' && typeof value[1] === 'string') return value[1];
        return value.map(extractText).join('');
      }
      return typeof value === 'string' ? value : '';
    };
    const visible = normalize(questionElement.innerText || '');
    const actual = cards.map(card => normalize(card.innerText));
    const signature = visible + '|' + actual.join('|');
    if (!visible || (signature === window.doplnovackaLastSignature &&
        cards.some(card => card.classList.contains('correct') || card.classList.contains('wrong')))) return;
    window.doplnovackaBusy = true;
    try {
      if (!window.doplnovackaDataPromise) {
        window.doplnovackaDataPromise = window.fjWEDGjivdsXloadQuestionData('doplnovackaLoadQuestionsBinaryChoiceData.php');
      }
      let data = await window.doplnovackaDataPromise;
      let items = data.items || [];
      const pathParts = location.pathname.split('/').filter(Boolean);
      const pageId = pathParts[pathParts.length - 1] || '';
      let byId = items.filter(item => String(item.id) === pageId);

      // The endpoint returns randomized batches. Retry fresh requests
      // until this question's page ID appears, rather than stopping after one.
      for (let attempt = 0; !byId.length && attempt < 10; attempt++) {
        data = await window.fjWEDGjivdsXloadQuestionData(
          'doplnovackaLoadQuestionsBinaryChoiceData.php'
        );
        window.doplnovackaDataPromise = Promise.resolve(data);
        items = data.items || [];
        byId = items.filter(item => String(item.id) === pageId);
      }
      const optionsMatch = item => Array.isArray(item.options) &&
        item.options.length === actual.length &&
        item.options.every((option, index) => normalize(extractText(option.option)) === actual[index]);
      let matches = byId.length === 1 ? byId : items.filter(item =>
        normalize(extractText(item.question)) === visible
      );
      matches = matches.filter(optionsMatch);
      if (!matches.length) {
        const gap = document.querySelector('.question-content .gap');
        const gapPrefix = normalize(gap?.previousSibling?.textContent || '');
        if (gapPrefix.length >= 3) {
          const stemMatches = items.filter(item =>
            normalize(extractText(item.question)).includes(gapPrefix) && optionsMatch(item)
          );
          if (stemMatches.length === 1) matches = stemMatches;
        }
      }
      if (matches.length !== 1) {
        console.warn('[umimeto-solver] Expected one question match, found:', matches.length, {
          pageId, idMatches: byId.length, prompt: visible, options: actual
        });
        return;
      }
      const item = matches[0];
      const correctIndex = item.options.findIndex(option => Number(option.correct) === 1);
      if (correctIndex < 0) {
        console.warn('[umimeto-solver] No correct option found:', item.id);
        return;
      }
      window.doplnovackaLastSignature = signature;
      console.log('[umimeto-solver] Correct answer:', extractText(item.options[correctIndex].option));
      cards[correctIndex].click();
    } catch (error) {
      console.error('[umimeto-solver] Doplňovačka:', error);
      window.doplnovackaDataPromise = null;
    } finally {
      window.doplnovackaBusy = false;
    }
  }

  function answer_twoOp () {
    let correct_answer = -1;
    try {
      const answers = questions.find(q => q.id == window.location.pathname.split('/')[2]);
      for (i of range(parseInt(answers.options.length))) {
        if (answers.options[i].correct === 1) { correct_answer = i; }
      }
      console.log('Correct answer: ' + parseInt(correct_answer + 1));
      document.getElementById('option' + correct_answer).click();
    } catch (error) {}
  }

  function answer_twoOp_zavody () {
    // var correct_answer = -1
    // window.sstop_question_index = 0
    // for (i of range(2)) {
    //   document.getElementById("option" + i).addEventListener("click", function() { window.sstop_question_index += 1; });
    // }
    //  try {
    //     var answers = questions[window.sstop_question_index]
    //     for (i of range(parseInt(answers.options.length))) {
    //        if (answers.options[i].correct === 1)
    //           correct_answer = i
    //     }
    //     console.log("Correct answer: "  + parseInt(correct_answer + 1))
    //     document.getElementById("option" + correct_answer).click()
    //  } catch (error) {}

    // var correct_answer = -1
    //  try {
    //     for (i of range(questions.length)) {
    //       answers = questions[i]
    //       if (answers.options[0].option[0][1] === document.getElementById("option0").firstChild.textContent && answers.options[1].option[0][1] === document.getElementById("option1").firstChild.textContent) {
    //         for (i of range(parseInt(answers.options.length))) {
    //           if (answers.options[i].correct === 1)
    //             correct_answer = i
    //           }

    //         console.log("Correct answer: "  + parseInt(correct_answer + 1))
    //         document.getElementById("option" + correct_answer).click()
    //       }
    //     }

    //  } catch (error) {}

    let correct_answer = -1;
    try {
      if (document.getElementById('option0').attributes.correct.value === '1') {
        correct_answer = 0;
      } else if (document.getElementById('option1').attributes.correct.value === '1') {
        correct_answer = 1;
      }
      console.log('Correct answer: ' + parseInt(correct_answer + 1));
      document.getElementById('option' + correct_answer).click();
    } catch (error) {}
  }

  async function answer_race () {
    if (window.raceSolverBusy) return;

    const wrapper = document.getElementById('question-wrapper');
    const questionElement = wrapper?.querySelector('[data-data="question"]');
    const optionElements = [...(wrapper?.querySelectorAll('.options [data-index]') || [])];
    if (!questionElement || !optionElements.length) return;

    const isTymovka = new URLSearchParams(window.location.search).get('p') === 'tymovka';
    const normalize = value => String(value ?? '')
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase('cs');

    const visibleQuestion = normalize(questionElement.innerText || questionElement.textContent);
    const visibleOptions = optionElements.map(option => normalize(option.innerText || option.textContent));
    if (!visibleQuestion || visibleOptions.some(option => !option)) return;

    const signature = JSON.stringify([visibleQuestion, visibleOptions]);
    const alreadyAnswered = optionElements.some(option =>
      option.classList.contains('correct') || option.classList.contains('wrong')
    );

    // Týmovka requires the administrator to reveal the results and then
    // advance the game. Automate those controls only after an answer exists.
    if (isTymovka && alreadyAnswered) {
      const showSolution = document.getElementById('show-solution');
      const nextButton = document.getElementById('next-use');
      const isVisible = element => element &&
        getComputedStyle(element).display !== 'none' &&
        !element.disabled;

      if (isVisible(nextButton) && window.tymovkaAdvancedSignature !== signature) {
        window.tymovkaAdvancedSignature = signature;
        console.log('[umimeto-solver] Týmovka — continuing to next question.');
        nextButton.click();
      } else if (isVisible(showSolution) && window.tymovkaRevealSignature !== signature) {
        window.tymovkaRevealSignature = signature;
        console.log('[umimeto-solver] Týmovka — revealing results.');
        showSolution.click();
      }
      return;
    }

    if (alreadyAnswered || signature === window.raceSolverLastSignature) return;

    window.raceSolverBusy = true;
    try {
      if (!window.raceSolverDataPromise) {
        window.raceSolverDataPromise = (async () => {
          const exerciseType = isTymovka ? 'tymovka' : 'zavody';
          const response = await fetch(`${newApiUrl}/exercise/${exerciseType}/${gameId}/questions`);
          if (!response.ok) throw new Error(`Question request failed: ${response.status}`);
          const encrypted = await response.text();
          const decoded = b64DecodeUnicode(fjWEDGjivdsXcryptoDecrypt(encrypted));
          return JSON.parse(decoded);
        })();
      }

      const data = await window.raceSolverDataPromise;
      const getText = segments => {
        let result = '';
        const visit = value => {
          if (!Array.isArray(value)) return;
          if (value[0] === 'text' && typeof value[1] === 'string') {
            result += value[1];
            return;
          }
          value.forEach(visit);
        };
        visit(segments);
        return result;
      };

      const matches = (data.items || []).filter(item => {
        const question = normalize(getText(item.question));
        const options = (item.options || []).map(option => normalize(getText(option.option)));
        return question === visibleQuestion &&
          options.length === visibleOptions.length &&
          options.every((option, index) => option === visibleOptions[index]);
      });

      if (matches.length !== 1) {
        console.warn(`[umimeto-solver] ${isTymovka ? 'Týmovka' : 'Závody'}: expected one question match, found:`, matches.length, {
          question: visibleQuestion,
          options: visibleOptions,
          matches: matches.length,
          itemCount: data.items?.length || 0
        });
        return;
      }

      const item = matches[0];
      const correctIndex = item.options.findIndex(option => option.correct === 1 || option.correct === true);
      if (correctIndex < 0 || !optionElements[correctIndex]) {
        console.warn(`[umimeto-solver] ${isTymovka ? 'Týmovka' : 'Závody'}: correct option not found:`, item);
        return;
      }

      window.raceSolverLastSignature = signature;
      console.log(`[umimeto-solver] ${isTymovka ? 'Týmovka' : 'Závody'} — correct answer:`, visibleOptions[correctIndex]);
      optionElements[correctIndex].click();
    } catch (error) {
      console.error(`[umimeto-solver] ${isTymovka ? 'Týmovka' : 'Závody'}:`, error);
      window.raceSolverDataPromise = null;
    } finally {
      window.raceSolverBusy = false;
    }
  }

  async function answer_vpisovacka () {
    if (window.vpisovackaBusy) return;

    const questionContent = document.getElementById('question-content');
    const evaluateButton = document.getElementById('evaluate');
    const nextButton = document.getElementById('next');
    if (!questionContent || !evaluateButton || !nextButton) return;

    // After evaluation, advance using the exercise's own Next button.
    if (getComputedStyle(nextButton).display !== 'none' && !nextButton.disabled) {
      nextButton.click();
      return;
    }
    if (getComputedStyle(evaluateButton).display === 'none' || evaluateButton.disabled) return;

    const normalize = value => String(value ?? '')
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase('cs');

    const visibleQuestion = questionContent.cloneNode(true);
    visibleQuestion.querySelectorAll('[id^="answer"]').forEach(element => element.remove());
    const prompt = normalize(visibleQuestion.innerText || visibleQuestion.textContent);
    if (!prompt) return;

    window.vpisovackaBusy = true;
    try {
      if (!window.vpisovackaDataPromise) {
        window.vpisovackaDataPromise =
          window.fjWEDGjivdsXloadQuestionData('vpisovackaLoadWrittenAnswerData.php');
      }

      const data = await window.vpisovackaDataPromise;
      const matches = (data.items || []).filter(item => {
        if (!Array.isArray(item.question)) return false;
        const itemPrompt = item.question
          .filter(segment => Array.isArray(segment) && segment[0] === 'text')
          .map(segment => segment[1] || '')
          .join('');
        return normalize(itemPrompt) === prompt;
      });

      if (matches.length !== 1) {
        console.warn('[umimeto-solver] Vpisovačka: expected one question match, found:', matches.length, {
          prompt,
          matches: matches.length,
          cachedItems: data.items?.length || 0
        });
        return;
      }

      const item = matches[0];
      const answerSegments = item.question.filter(
        segment => Array.isArray(segment) && segment[0] === 'input'
      );
      const answerInputs = [...questionContent.querySelectorAll('[id^="answer"] input')];

      if (!answerSegments.length || answerSegments.length !== answerInputs.length) {
        console.warn('[umimeto-solver] Vpisovačka: answer field count mismatch:', {
          expected: answerSegments.length,
          actual: answerInputs.length
        });
        return;
      }

      const answers = answerSegments.map(segment => segment[1]?.answer?.[0]);
      if (answers.some(answer => typeof answer !== 'string' || !answer.length)) {
        console.warn('[umimeto-solver] Vpisovačka: missing accepted answer:', answers);
        return;
      }

      answerInputs.forEach((input, index) => {
        input.value = answers[index];
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      console.log('[umimeto-solver] Vpisovačka — correct answer:', answers.join(' / '));
      evaluateButton.click();
    } catch (error) {
      console.error('[umimeto-solver] Vpisovačka:', error);
      window.vpisovackaDataPromise = null;
    } finally {
      window.vpisovackaBusy = false;
    }
  }

  async function answer_hadanky () {
    if (window.hadankyBusy) return;

    const pageId = window.location.pathname.split('/')[2];
    const answerBox = document.querySelector('#answer0 input');
    const evaluateButton = document.getElementById('evaluate');
    const nextButton = document.getElementById('next');
    if (!pageId || !answerBox || !evaluateButton || !nextButton) return;

    if (getComputedStyle(nextButton).display !== 'none' && !nextButton.disabled) {
      nextButton.click();
      return;
    }
    if (getComputedStyle(evaluateButton).display === 'none' || evaluateButton.disabled) return;

    window.hadankyBusy = true;
    try {
      if (!window.hadankyDataPromise) {
        window.hadankyDataPromise =
          window.fjWEDGjivdsXloadQuestionData('universalLoadItems.php');
      }

      let data = await window.hadankyDataPromise;
      let item = (data.items || []).find(entry => String(entry.id) === pageId);

      // The endpoint returns small randomized batches; retry until this riddle appears.
      for (let attempt = 0; !item && attempt < 10; attempt++) {
        data = await window.fjWEDGjivdsXloadQuestionData('universalLoadItems.php');
        window.hadankyDataPromise = Promise.resolve(data);
        item = (data.items || []).find(entry => String(entry.id) === pageId);
      }

      const answerSegment = item?.item?.question?.find(
        segment => Array.isArray(segment) && segment[0] === 'input'
      );
      const correctAnswer = answerSegment?.[1]?.answer?.[0];
      if (typeof correctAnswer !== 'string' || !correctAnswer.length) {
        console.warn('[umimeto-solver] Hádanky: answer not found for riddle:', pageId, {
          itemFound: Boolean(item),
          item
        });
        return;
      }

      answerBox.value = correctAnswer;
      answerBox.dispatchEvent(new Event('input', { bubbles: true }));
      answerBox.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[umimeto-solver] Hádanky — correct answer:', correctAnswer);
      evaluateButton.click();
    } catch (error) {
      console.error('[umimeto-solver] Hádanky:', error);
      window.hadankyDataPromise = null;
    } finally {
      window.hadankyBusy = false;
    }
  }

  function answer_doplnovani_slov () {
    try {
      const gaps = [...document.querySelectorAll('.gap[answered="0"]')];
      for (const gap of gaps) {
        const correctVariant = gap.querySelector('.inlineVariant[correct="1"]');
        if (!correctVariant) continue;

        correctVariant.click();
        console.log('[umimeto-solver] Correct answer:', correctVariant.innerText.trim());
      }
    } catch (error) {
      console.error('[umimeto-solver] Doplňování textu:', error);
    }
  }

  function answer_diktat () {
    const correct_answer = '';
    let el = '';
    try {
      for (i of range($('[answered]').length)) {
        if ($('[answered]')[i].attributes.answered.value === '0') {
          el = $('[answered]')[i].childNodes[1];
          $('[answered]')[i].attributes.answered.value = '1';
          break;
        }
      }

      // if element exists
      if (el) {
        if (el.childNodes[0].attributes.correct.value === '1') {
          clickVariant($(el.childNodes[0]));
        } else if (el.childNodes[1].attributes.correct.value === '1') {
          clickVariant($(el.childNodes[1]));
        }
      }

      //

      if (window.finished === 1) {
        nextDictate();
        window.finished = 0;
      }
    } catch (error) {}
  }

  async function answer_ukolovka () {
    if (window.ukolovkaBusy) return;

    const pageId = window.location.pathname.split('/')[2];
    const answerInput = document.querySelector('#answer0 input');
    const evaluateButton = document.getElementById('evaluate');
    const nextButton = document.getElementById('next');
    if (!pageId || !answerInput || !evaluateButton || !nextButton) return;

    // Use the exercise's own Next button after an answer has been evaluated.
    if (getComputedStyle(nextButton).display !== 'none' && !nextButton.disabled) {
      nextButton.click();
      return;
    }
    if (getComputedStyle(evaluateButton).display === 'none' || evaluateButton.disabled) return;

    window.ukolovkaBusy = true;
    try {
      if (!window.ukolovkaDataPromise) {
        window.ukolovkaDataPromise =
          window.fjWEDGjivdsXloadQuestionData('universalLoadItems.php');
      }

      let data = await window.ukolovkaDataPromise;
      let item = (data.items || []).find(entry => String(entry.id) === pageId);

      // The endpoint may return a randomized subset; retry until this task appears.
      for (let attempt = 0; !item && attempt < 10; attempt++) {
        data = await window.fjWEDGjivdsXloadQuestionData('universalLoadItems.php');
        window.ukolovkaDataPromise = Promise.resolve(data);
        item = (data.items || []).find(entry => String(entry.id) === pageId);
      }

      const answerSegment = item?.item?.question?.find(
        segment => Array.isArray(segment) && segment[0] === 'input'
      );
      const correctAnswer = answerSegment?.[1]?.answer?.[0];
      if (typeof correctAnswer !== 'string' || !correctAnswer.length) {
        console.warn('[umimeto-solver] Úkolovka: answer not found for task:', pageId, {
          itemFound: Boolean(item),
          item
        });
        return;
      }

      answerInput.value = correctAnswer;
      answerInput.dispatchEvent(new Event('input', { bubbles: true }));
      answerInput.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('[umimeto-solver] Úkolovka — correct answer:', correctAnswer);
      evaluateButton.click();
    } catch (error) {
      console.error('[umimeto-solver] Úkolovka:', error);
      window.ukolovkaDataPromise = null;
    } finally {
      window.ukolovkaBusy = false;
    }
  }

  async function answer_pexeso () {
    if (window.__pexesoBusy) return;

    const board = document.getElementById('pexeso');
    if (!board) return;

    const nextButton = [...document.querySelectorAll('#playground .next, .next')]
      .find(button => getComputedStyle(button).display !== 'none' &&
        getComputedStyle(button).visibility !== 'hidden');

    const pageId = window.location.pathname.split('/').filter(Boolean).pop();
    if (!pageId) return;

    // Once all pairs are matched, the site's own Next button starts the next set.
    if (nextButton && window.__pexesoAnsweredSet === pageId) {
      nextButton.click();
      console.log('[umimeto-solver] Pexeso: next set', pageId);
      return;
    }

    const cards = [...board.querySelectorAll('.card[data-index]')];
    if (!cards.length || window.__pexesoAnsweredSet === pageId) return;

    window.__pexesoBusy = true;
    try {
      if (!window.__pexesoSetsPromise) {
        if (typeof window.fjWEDGjivdsXloadQuestionData !== 'function') {
          console.warn('[umimeto-solver] Pexeso: question loader unavailable.');
          return;
        }
        window.__pexesoSetsPromise =
          window.fjWEDGjivdsXloadQuestionData('pexesoLoadSetsDynamic.php');
      }

      const data = await window.__pexesoSetsPromise;
      const set = (data?.sets || []).find(entry => String(entry.id) === pageId);
      if (!set || !Array.isArray(set.options)) {
        console.warn('[umimeto-solver] Pexeso: matching set not found:', pageId);
        return;
      }

      const normalize = value => String(value ?? '')
        .normalize('NFKC')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase('cs');

      // The game pairs original options (0,1), (2,3), etc., then shuffles
      // the cards while preserving each option's pair number.
      const optionText = option => (option || [])
        .map(part => Array.isArray(part) && part[0] === 'text' ? String(part[1] ?? '') : '')
        .join('');

      const optionBuckets = new Map();
      set.options.forEach((option, index) => {
        const key = normalize(optionText(option));
        if (!key) return;
        if (!optionBuckets.has(key)) optionBuckets.set(key, []);
        optionBuckets.get(key).push(index);
      });

      const matchedCards = new Map();
      for (const card of cards) {
        const key = normalize(card.innerText);
        const bucket = optionBuckets.get(key);
        if (!bucket?.length) {
          console.warn('[umimeto-solver] Pexeso: card not found in API options:', card.innerText);
          return;
        }
        const optionIndex = bucket.shift();
        const pair = Math.floor(optionIndex / 2);
        if (!matchedCards.has(pair)) matchedCards.set(pair, []);
        matchedCards.get(pair).push(card);
      }

      const pairs = [...matchedCards.entries()];
      if (pairs.length !== set.options.length / 2 ||
          pairs.some(([, pairCards]) => pairCards.length !== 2)) {
        console.warn('[umimeto-solver] Pexeso: incomplete pair mapping:', {
          set: pageId, expectedPairs: set.options.length / 2,
          actualPairs: pairs.length
        });
        return;
      }

      // Do not repeat clicks if the board has already started resolving.
      if (cards.some(card => card.classList.contains('selected') ||
          card.classList.contains('correct') || card.classList.contains('wrong'))) return;

      window.__pexesoAnsweredSet = pageId;
      console.log('[umimeto-solver] Pexeso: matching pairs', pageId, pairs.length);
      for (const [, pairCards] of pairs) {
        pairCards[0].click();
        pairCards[1].click();
      }
    } catch (error) {
      console.error('[umimeto-solver] Pexeso:', error);
      window.__pexesoSetsPromise = null;
    } finally {
      window.__pexesoBusy = false;
    }
  }

  async function answer_otazky () {
    if (window.otazkyBusy) return;

    const titleElement = document.getElementById('question-title');
    const optionElements = [...document.querySelectorAll('#options > .option')];
    if (!titleElement || optionElements.length < 2) return;

    const normalize = value => String(value ?? '')
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase('cs');

    const prompt = titleElement.innerText || '';
    const actual = optionElements.map(option =>
      option.querySelector('.text')?.innerText || ''
    );
    if (!normalize(prompt) || actual.some(value => !normalize(value))) return;

    const signature = JSON.stringify([
      normalize(prompt),
      actual.map(normalize).sort()
    ]);
    if (signature === window.otazkyLastSignature) return;
    window.otazkyCheckedSignatures = window.otazkyCheckedSignatures || new Set();
    if (window.otazkyCheckedSignatures.has(signature)) return;

    window.otazkyBusy = true;
    try {
      // The endpoint returns a randomized batch on each request. Keep all
      // records collected so far and request more batches when this question
      // is not present in the current response.
      const records = window.otazkyQuestionRecords || [];
      const knownRecords = new Set(records.map(record => [
        record.type,
        record.question?.problem,
        record.question?.id,
        record.question?.term,
        record.question?.description
      ].join('|')));

      const addRecords = data => {
        for (const record of data?.questions || []) {
          const question = record?.question;
          if (!question) continue;
          const key = [
            record.type,
            question.problem,
            question.id,
            question.term,
            question.description
          ].join('|');
          if (!knownRecords.has(key)) {
            knownRecords.add(key);
            records.push(record);
          }
        }
        window.otazkyQuestionRecords = records;
      };

      const findMatches = () => {
        const actualSorted = actual.map(normalize).sort();
        const matches = [];

        for (const record of records) {
          const question = record?.question;
          const distractors = record?.distractors;
          if (!question || !Array.isArray(distractors)) continue;

          let promptText;
          let correctText;
          let expected;

          if (record.type === 'chooseTerm') {
            promptText = question.description;
            correctText = question.term;
            expected = [question.term, ...distractors.map(item => item.term)];
          } else if (record.type === 'chooseCategory') {
            // Depending on the exercise variant, chooseCategory can render
            // either a word with category options or a category with word options.
            if (normalize(question.term) === normalize(prompt)) {
              promptText = question.term;
              correctText = question.description;
              expected = [question.description, ...distractors.map(item => item.description)];
            } else if (
              normalize(question.description) === normalize(prompt) &&
              actual.some(value => normalize(value) === normalize(question.term))
            ) {
              matches.push(question.term);
              continue;
            } else {
              continue;
            }
          } else {
            continue;
          }

          if (normalize(promptText) !== normalize(prompt) ||
              !correctText || expected.length !== actual.length ||
              expected.some(value => !normalize(value))) continue;

          const expectedSorted = expected.map(normalize).sort();
          if (expectedSorted.every((value, index) => value === actualSorted[index])) {
            matches.push(correctText);
          }
        }
        return matches;
      };

      if (!window.otazkyDataPromise) {
        window.otazkyDataPromise =
          window.fjWEDGjivdsXloadQuestionData('mcqLoadQuestionsDynamicCategoryData.php');
      }
      addRecords(await window.otazkyDataPromise);

      let matches = findMatches();

      // The API distributes related words and categories across randomized
      // records. Index both directions so either UI orientation can be solved.
      const normalizeLoose = value => normalize(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      const findCategoryMatches = () => {
        const categoriesByTerm = new Map();
        for (const record of records) {
          const entries = [record?.question, ...(record?.distractors || [])];
          for (const entry of entries) {
            const term = normalizeLoose(entry?.term);
            const category = normalizeLoose(entry?.description);
            if (!term || !category) continue;
            if (!categoriesByTerm.has(term)) categoriesByTerm.set(term, new Set());
            categoriesByTerm.get(term).add(category);
          }
        }

        // Word prompt → one category among the visible category options.
        // Also tolerate missing diacritics and parenthetical synonyms.
        const promptVariants = [
          normalizeLoose(prompt),
          normalizeLoose(prompt.replace(/\s*\([^)]*\)\s*/g, ' ').trim())
        ];
        const promptCategories = new Set();
        for (const variant of promptVariants) {
          for (const category of categoriesByTerm.get(variant) || []) {
            promptCategories.add(category);
          }
        }
        if (promptCategories.size === 1) {
          const category = [...promptCategories][0];
          const matchingOptions = actual.filter(value => normalizeLoose(value) === category);
          if (matchingOptions.length === 1) {
            return { complete: true, matches: matchingOptions };
          }
        }

        // Only use the visible-option completeness check when the prompt is
        // itself a category. For word prompts, keep fetching until the prompt
        // has a category mapping; otherwise unrelated known options can stop
        // the randomized search too early.
        const promptIsCategory = [...categoriesByTerm.values()]
          .some(categories => categories.has(normalizeLoose(prompt)));
        if (!promptIsCategory) return { complete: false, matches: [] };

        // Category prompt → find the visible words belonging to that category.
        const optionCategories = actual.map(value => categoriesByTerm.get(normalizeLoose(value)));
        const complete = optionCategories.every(
          categories => categories && categories.size === 1
        );
        if (!complete) return { complete: false, matches: [] };

        const matchingOptions = actual.filter((value, index) =>
          optionCategories[index].has(normalizeLoose(prompt))
        );
        return { complete: true, matches: matchingOptions };
      };

      let categoryResult = findCategoryMatches();
      // Fetch randomized batches in small parallel groups to avoid the
      // long delay caused by requesting up to 50 batches sequentially.
      for (
        let attempt = 0;
        matches.length === 0 && !categoryResult.complete && attempt < 5;
        attempt++
      ) {
        const batches = await Promise.all(
          Array.from({ length: 10 }, () =>
            window.fjWEDGjivdsXloadQuestionData(
              'mcqLoadQuestionsDynamicCategoryData.php'
            )
          )
        );
        for (const data of batches) addRecords(data);
        matches = findMatches();
        categoryResult = findCategoryMatches();
      }

      if (matches.length === 0 && categoryResult.complete) {
        matches = categoryResult.matches;
      }

      if (matches.length === 0) {
        // Do not repeat API requests for the same question on every poll.
        window.otazkyCheckedSignatures.add(signature);
      }

      const uniqueAnswers = [...new Set(matches.map(normalize))];
      if (uniqueAnswers.length !== 1) {
        console.warn(
          '[umimeto-solver] Otázky: expected one unambiguous API match, found:',
          matches.length,
          { prompt, actual, cachedRecords: records.length, matches }
        );
        return;
      }

      const correctText = matches.find(value => normalize(value) === uniqueAnswers[0]);
      const correctIndex = actual.findIndex(value => normalize(value) === uniqueAnswers[0]);
      if (correctIndex < 0) {
        console.warn('[umimeto-solver] Otázky: correct option is not visible:', correctText);
        return;
      }

      const answerElement = optionElements[correctIndex];
      window.otazkyLastSignature = signature;
      console.log('[umimeto-solver] Otázky — correct answer:', correctText);
      answerElement.click();

      // Some versions advance as soon as an option is clicked; only call
      // nextQuestion if the same question is still on screen.
      setTimeout(() => {
        const currentTitle = document.getElementById('question-title')?.innerText || '';
        const currentOptions = [...document.querySelectorAll('#options > .option .text')]
          .map(element => normalize(element.innerText || ''));
        const currentSignature = currentOptions.length >= 2
          ? JSON.stringify([normalize(currentTitle), currentOptions.sort()])
          : '';
        if (currentSignature === signature && typeof nextQuestion === 'function') {
          nextQuestion();
        }
      }, 150);
    } catch (error) {
      console.error('[umimeto-solver] Otázky:', error);
      window.otazkyDataPromise = null;
    } finally {
      window.otazkyBusy = false;
    }
  }

  async function answer_rozrazovacka () {
    if (window.rozrazovackaBusy) return;
    window.rozrazovackaBusy = true;

    try {
      // Advance after a completed round. Remember the exact element so the
      // polling loop cannot click the same button repeatedly during transition.
      const nextButton = [...document.querySelectorAll('span.tlacitko.next')]
        .find(el =>
          el.innerText.trim() === 'Další' &&
          (el.offsetWidth || el.offsetHeight || el.getClientRects().length)
        );

      if (nextButton) {
        if (window.__rozrazovackaNextClicked !== nextButton) {
          window.__rozrazovackaNextClicked = nextButton;
          console.log('[umimeto-solver] Rozřazovačka: advancing to next round');
          nextButton.click();
        }
        return;
      }

      window.__rozrazovackaNextClicked = null;

      const words = [...document.querySelectorAll('.word')];
      if (!words.length) return;

      const wanted = words.map(el => el.innerText.trim());
      const answerMap = {};

      // Question data is returned in batches, so collect up to five.
      for (let attempt = 0; attempt < 5; attempt++) {
        const data = await window.fjWEDGjivdsXloadQuestionData(
          'rozrazovackaLoadDynamicCategoryData.php'
        );

        for (const item of data.items || []) {
          for (const pair of item.pairs || []) {
            const word = pair.card && pair.card[1];
            const category = pair.vzor && pair.vzor[1];

            if (wanted.includes(word) && category) {
              answerMap[word] = category;
            }
          }
        }

        if (wanted.every(word => answerMap[word])) break;
      }

      // Put each word into an empty slot with the matching category.
      for (const word of words) {
        const wordText = word.innerText.trim();
        const category = answerMap[wordText];

        if (!category) {
          console.warn('[umimeto-solver] No answer found:', wordText);
          continue;
        }

        if (word.getAttribute('currentbox') !== '-1') continue;

        const box = [...document.querySelectorAll('.wordBox')]
          .find(el =>
            el.getAttribute('vzor') === category &&
            el.getAttribute('currentword') === '-1'
          );

        if (!box) {
          console.warn('[umimeto-solver] No empty slot for:', wordText, category);
          continue;
        }

        const dropHandler = jQuery(box).droppable('option', 'drop');
        if (typeof dropHandler !== 'function') {
          console.warn('[umimeto-solver] Drop handler unavailable for:', wordText);
          continue;
        }

        dropHandler.call(box, {}, { draggable: jQuery(word) });
        console.log('[umimeto-solver] Placed:', wordText, '→', category);
      }

      const allPlaced = words.every(
        word => word.getAttribute('currentbox') !== '-1'
      );

      if (allPlaced) {
        console.log('[umimeto-solver] All words placed. Checking answers...');
        // Keep the solver polling so it can detect and click "Další"
        // after the site's answer-checking transition completes.
        document.getElementById('evaluate')?.click();
      } else {
        console.warn('[umimeto-solver] Not all words could be placed; not submitting.');
      }
    } catch (error) {
      console.error('[umimeto-solver] Rozřazovačka:', error);
    } finally {
      window.rozrazovackaBusy = false;
    }
  }


  function answer_krizovky () {
    if (window.krizovkyBusy || finished == 1) return;
    if (!Array.isArray(window.currentQuestions) || !window.currentQuestions.length ||
        typeof window.showInput !== 'function' || typeof window.insertLetter !== 'function') return;

    window.krizovkyBusy = true;
    try {
      for (let index = 0; index < window.currentQuestions.length; index++) {
        const question = window.currentQuestions[index];
        if (!question || typeof question.answer !== 'string' ||
            !Number.isInteger(question.x) || !Number.isInteger(question.y)) {
          console.warn('[umimeto-solver] Invalid crossword question:', question);
          return;
        }

        // Use the site's own clue selector so all internal crossword state is updated.
        const cell = window.jQuery(`#square-${question.x}-${question.y}`);
        if (!cell.length) {
          console.warn('[umimeto-solver] Crossword starting cell not found:', question);
          continue;
        }
        clickSquareLetter(cell);
        if (window.currentQuestion !== question) {
          console.warn('[umimeto-solver] Could not select crossword clue:', question);
          continue;
        }

        for (const letter of Array.from(question.answer)) {
          if (finished == 1) break;
          insertLetter(letter);
        }
        if (finished == 1) break;
      }
      console.log('[umimeto-solver] Crossword answers entered.');
    } catch (error) {
      console.error('[umimeto-solver] Křížovka:', error);
    } finally {
      window.krizovkyBusy = false;
    }
  }

  function answer_roboti () {
    try {
      // Capture the exact item passed to the game's display function.
      if (!window.__robotDisplayHookInstalled) {
        if (typeof window.displayItem !== 'function') return;
        const originalDisplayItem = window.displayItem;
        window.displayItem = function (item, ...args) {
          window.__robotCurrentItem = item;
          window.__robotLastAnsweredItem = null;
          return originalDisplayItem.apply(this, [item, ...args]);
        };
        window.__robotDisplayHookInstalled = true;
      }

      const item = window.__robotCurrentItem;
      if (!item || item === window.__robotLastAnsweredItem || !Array.isArray(item.options)) return;

      const correctIndex = item.options.findIndex(option => Number(option.correct) === 1);
      if (correctIndex < 0) return;

      const option = document.querySelector(
        '#question-wrapper [data-data="option"][data-index="' + correctIndex + '"]'
      );
      if (!option || !option.isConnected || option.getClientRects().length === 0) return;

      // Reserve this item while the game processes the click. If the game is
      // still fading in / throttling and ignores it, release the reservation
      // so the next polling cycle can retry.
      window.__robotLastAnsweredItem = item;
      console.log('[umimeto-solver] Roboti answer:', item.id, correctIndex);
      option.click();

      setTimeout(() => {
        if (window.__robotCurrentItem !== item ||
            window.__robotLastAnsweredItem !== item) return;

        const accepted = option.classList.contains('correct') ||
          option.classList.contains('wrong');
        if (!accepted) {
          window.__robotLastAnsweredItem = null;
          console.log('[umimeto-solver] Roboti: click was not accepted; will retry', item.id);
        }
      }, 600);
    } catch (error) {
      console.error('[umimeto-solver] Roboti:', error);
    }
  }

  function answer_mluvene_diktaty () {
    try {
      const input = document.getElementById('sentence');
      const evaluate = document.getElementById('evaluate');
      const next = document.getElementById('nextSentence');
      const finalBoard = document.getElementById('finalBoard');
      const startButton = document.getElementById('startTyping');

      // The completed dictation offers a separate "Další text" link.
      if (finalBoard && getComputedStyle(finalBoard).display !== 'none') {
        const nextText = finalBoard.querySelector('a.nextItem');
        if (nextText) {
          if (!window.__mluveneNextTextClicked) {
            window.__mluveneNextTextClicked = true;
            console.log('[umimeto-solver] Mluvené diktáty: next text');
            nextText.click();
          }
          return;
        }
      } else {
        window.__mluveneNextTextClicked = false;
      }

      // Start the writing part when the introductory board is displayed.
      if (input && startButton && finalBoard &&
          getComputedStyle(finalBoard).display !== 'none' &&
          getComputedStyle(startButton).display !== 'none') {
        startButton.click();
        return;
      }

      if (!input || !evaluate || !next) return;

      const offset = typeof sentenceOffset !== 'undefined'
        ? sentenceOffset
        : (window.sentenceOffset ?? 0);
      const finished = typeof sentenceFinished !== 'undefined'
        ? sentenceFinished
        : window.sentenceFinished;

      // Once checked, wait for the site's own "Další" button and advance.
      if (Number(finished) === 1 &&
          getComputedStyle(next).display !== 'none') {
        if (window.__mluveneNextOffset !== offset ||
            Date.now() - (window.__mluveneNextAttemptAt || 0) > 2500) {
          window.__mluveneNextOffset = offset;
          window.__mluveneNextAttemptAt = Date.now();
          console.log('[umimeto-solver] Mluvené diktáty: next sentence', offset);
          next.click();
        }
        return;
      }

      const answer = typeof sentence !== 'undefined' ? sentence : window.sentence;
      if (typeof answer !== 'string' || !answer.trim() ||
          Number(finished) === 1 ||
          getComputedStyle(evaluate).display === 'none') return;

      if (window.__mluveneSubmittedOffset === offset) return;

      input.value = answer;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      window.__mluveneSubmittedOffset = offset;
      console.log('[umimeto-solver] Mluvené diktáty answer:', answer);
      evaluate.click();
    } catch (error) {
      console.error('[umimeto-solver] Mluvené diktáty:', error);
    }
  }

  async function answer_krok_po_kroku () {
    if (window.krokPoKrokuBusy) return;

    const pageId = window.location.pathname.split('/')[2];
    const cards = [...document.querySelectorAll('#cards [id^="option"]')]
      .filter(element => element.getClientRects().length > 0)
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
    const nextButton = document.querySelector('#questionParent .next');
    if (!pageId) return;

    window.krokPoKrokuBusy = true;
    try {
      if (!window.krokPoKrokuDataPromise) {
        if (typeof window.fjWEDGjivdsXloadQuestionData !== 'function') {
          console.warn('[umimeto-solver] Krok po kroku: question loader unavailable.');
          return;
        }
        window.krokPoKrokuDataPromise =
          window.fjWEDGjivdsXloadQuestionData('universalLoadMedalPs.php');
      }

      const data = await window.krokPoKrokuDataPromise;
      const item = (data?.items || []).find(entry => String(entry.id) === pageId);
      if (!item || !Array.isArray(item.question)) {
        console.warn('[umimeto-solver] Krok po kroku: item not found:', pageId);
        return;
      }

      if (!window.krokPoKrokuState || window.krokPoKrokuState.itemId !== pageId) {
        window.krokPoKrokuState = {
          itemId: pageId,
          optionGroups: item.question.filter(entry => entry?.type === 'options'),
          usedGroups: [],
          pendingOptions: null,
          nextClicked: false
        };
      }
      const state = window.krokPoKrokuState;

      if (nextButton && getComputedStyle(nextButton).display !== 'none' &&
          !state.nextClicked) {
        state.nextClicked = true;
        console.log('[umimeto-solver] Krok po kroku: next word', pageId);
        nextButton.click();
        return;
      }

      if (cards.length < 2) return;

      const normalize = value => String(value ?? '')
        .normalize('NFC')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase();
      const optionText = option => (option.option || [])
        .map(part => Array.isArray(part) ? String(part[1] ?? '') : '')
        .join('');
      const visibleTexts = cards.map(card => normalize(card.innerText));
      const visibleSignature = [...visibleTexts].sort().join('|');

      // Wait for the actual choices to change. The chat text can change earlier,
      // while the previous pair of cards is still on screen.
      if (state.pendingOptions !== null) {
        if (visibleSignature === state.pendingOptions) return;
        state.pendingOptions = null;
      }

      // Match the displayed pair against every unused data group. The page can
      // show the next choices before its chat animation has fully completed.
      const matchingGroups = state.optionGroups
        .map((group, index) => ({ group, index }))
        .filter(({ group, index }) => !state.usedGroups.includes(index) &&
          Array.isArray(group.options) &&
          group.options.length === visibleTexts.length &&
          [...group.options.map(option => normalize(optionText(option)))].sort().join('|') ===
            visibleSignature);

      const match = matchingGroups[0];
      if (!match) {
        // No warning during transitions or after all option groups are consumed.
        return;
      }

      const correctOption = match.group.options.find(option => String(option.correct) === '1');
      if (!correctOption) {
        console.warn('[umimeto-solver] Krok po kroku: correct option missing:', pageId, match.index);
        return;
      }

      const correctText = normalize(optionText(correctOption));
      const correctCard = cards.find(card => normalize(card.innerText) === correctText);
      if (!correctCard) return;

      state.usedGroups.push(match.index);
      state.pendingOptions = visibleSignature;
      console.log('[umimeto-solver] Krok po kroku answer:', pageId, match.index + 1, correctCard.innerText.trim());
      correctCard.click();
      correctCard.scrollIntoView({ block: 'center' });
      window.scrollBy(0, -70);
    } catch (error) {
      console.error('[umimeto-solver] Krok po kroku:', error);
      window.krokPoKrokuDataPromise = null;
    } finally {
      window.krokPoKrokuBusy = false;
    }
  }

  function answer_rozbory () {
    try {
      const sentence = document.getElementById('sentence');
      const markers = document.getElementById('markers');
      const evaluateButton = document.getElementById('evaluate');
      const characters = sentence
        ? [...sentence.querySelectorAll('[id^="character"]')]
            .sort((a, b) => Number(a.getAttribute('order')) - Number(b.getAttribute('order')))
        : [];
      const categories = typeof correctCategories !== 'undefined'
        ? correctCategories
        : window.correctCategories;

      if (!sentence || !markers || !evaluateButton ||
          !Array.isArray(categories) || characters.length !== categories.length) return;

      const signature = characters.map((character, index) =>
        character.textContent + ':' + categories[index]
      ).join('|');

      const isFinished = typeof finished !== 'undefined'
        ? Number(finished) === 1
        : Number(window.finished) === 1;

      if (isFinished) {
        if (window.__rozboryNextSignature !== signature) {
          window.__rozboryNextSignature = signature;
          console.log('[umimeto-solver] Rozbory: next sentence');
          if (typeof nextSentence === 'function') nextSentence();
          else if (typeof window.nextSentence === 'function') window.nextSentence();
        }
        return;
      }

      if (window.__rozboryAnsweredSignature === signature) return;

      const markerElements = [...markers.querySelectorAll('[category]')];
      // "nope" marks characters that do not belong to any selectable
      // category in this sentence. Leave those characters unmarked.
      const uniqueCategories = [...new Set(categories)].filter(category => category !== 'nope');

      for (const category of uniqueCategories) {
        const marker = markerElements.find(element =>
          element.getAttribute('category') === category
        );
        if (!marker) {
          console.warn('[umimeto-solver] Rozbory: marker not found:', category);
          return;
        }

        const currentBucket = typeof bucketCategory !== 'undefined'
          ? bucketCategory
          : window.bucketCategory;
        if (currentBucket !== category) {
          window.markerClicked($(marker));
        }

        characters.forEach((character, index) => {
          if (categories[index] === category) {
            window.characterClicked($(character));
          }
        });
      }

      window.__rozboryAnsweredSignature = signature;
      console.log('[umimeto-solver] Rozbory answer:', signature);
      evaluateButton.click();
    } catch (error) {
      console.error('[umimeto-solver] Rozbory:', error);
    }
  }

  function answer_presouvani () {
    try {
      const solutionButton = document.getElementById('solution');
      const evaluateButton = document.getElementById('evaluate');
      const nextButton = document.getElementById('next');
      const targets = [...document.querySelectorAll('#plan .target')];
      const filledTargets = targets.filter(target => target.querySelector('.card')).length;
      const isVisible = element => !!element &&
        getComputedStyle(element).display !== 'none' &&
        getComputedStyle(element).visibility !== 'hidden' &&
        !element.disabled;

      // The next button is only shown after the answer has been evaluated.
      if (isVisible(nextButton)) {
        nextButton.click();
        console.log('[umimeto-solver] Presouvani: next question');
        return;
      }

      if (!solutionButton || !evaluateButton || !targets.length) return;

      // The site's solution button is intentionally hidden, but its click
      // handler still works. Use it to place every card into its target.
      if (filledTargets === 0) {
        solutionButton.click();
        console.log('[umimeto-solver] Presouvani: solution applied');
        return;
      }

      // Evaluate on the next timer tick, after the solution has populated
      // the targets. Avoid evaluating a partially filled arrangement.
      if (filledTargets === targets.length && isVisible(evaluateButton)) {
        evaluateButton.click();
        console.log('[umimeto-solver] Presouvani: answer evaluated');
      }
    } catch (error) {
      console.error('[umimeto-solver] Presouvani:', error);
    }
  }

  function answer_poslech_slov () {
    try {
      const currentWord = typeof pickedWord !== 'undefined' ? pickedWord : window.pickedWord;
      const currentWords = typeof words !== 'undefined' ? words : window.words;
      const currentGrid = typeof grid !== 'undefined' ? grid : window.grid;

      if (!currentWord || !Array.isArray(currentWords) || !Array.isArray(currentGrid)) return;

      const wordIndex = currentWords.findIndex(word =>
        String(word?.id) === String(currentWord.id)
      );
      if (wordIndex < 0) return;

      const cardIndex = currentGrid.indexOf(wordIndex);
      if (cardIndex < 0) return;

      const card = document.getElementById('grid' + cardIndex);
      if (!card || card.getAttribute('clickable') !== '1') return;

      // Use the site's own click handler for scoring, logging and progression.
      console.log('[umimeto-solver] Poslech slovíček answer:',
        currentWord.wordForeign || currentWord.word, '→ card', cardIndex);
      $(card).trigger('click');
    } catch (error) {
      console.error('[umimeto-solver] Poslech slovíček:', error);
    }
  }

  async function answer_cteni_s_porozumenim () {
    if (window.__cteniBusy) return;

    const isVisible = element => !!element &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden' &&
      !element.disabled &&
      element.getClientRects().length > 0;

    // A completed story uses a separate "Další text" button (sometimes
    // rendered twice for responsive layouts). Handle it before looking for
    // the question UI, which may already have been replaced by the final board.
    const nextStoryButton = [...document.querySelectorAll('[data-data="next-item"]')]
      .find(isVisible);
    if (nextStoryButton) {
      const storyKey = (document.getElementById('title')?.textContent || '') +
        '|' + window.location.pathname;
      if (window.__cteniNextStoryKey !== storyKey) {
        window.__cteniNextStoryKey = storyKey;
        console.log('[umimeto-solver] Čtení: next text');
        nextStoryButton.click();
      }
      return;
    }

    const optionsContainer = document.getElementById('options');
    const questionTitle = document.getElementById('question-title');
    const storyTitle = document.getElementById('title');
    const nextButton = document.getElementById('next-question');
    if (!optionsContainer || !questionTitle || !storyTitle) return;

    window.__cteniBusy = true;
    try {
      if (!window.__cteniDataPromise) {
        if (typeof window.fjWEDGjivdsXloadQuestionData !== 'function') return;
        window.__cteniDataPromise =
          window.fjWEDGjivdsXloadQuestionData('universalLoadItems.php');
      }

      const data = await window.__cteniDataPromise;
      const normalize = value => String(value ?? '')
        .normalize('NFKC')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase('cs');

      const contentText = value => {
        if (typeof value === 'string') return value;
        if (!Array.isArray(value)) return '';
        if (value.length >= 2 && typeof value[0] === 'string' &&
            typeof value[1] === 'string' &&
            ['text', 'para', 'cite', 'title'].includes(value[0])) {
          return value[1];
        }
        return value.map(contentText).filter(Boolean).join(' ');
      };

      const storyName = normalize(storyTitle.textContent);
      const story = (data?.items || []).find(item =>
        normalize(item.name) === storyName
      );
      if (!story || !Array.isArray(story.item?.questions)) {
        console.warn('[umimeto-solver] Čtení: story not found:', storyTitle.textContent);
        return;
      }

      // If an explanation is being shown, continue through the site's own
      // button so its internal question/progress state remains synchronized.
      if (isVisible(nextButton)) {
        const key = story.id + '|' + normalize(questionTitle.textContent);
        if (window.__cteniNextKey !== key) {
          window.__cteniNextKey = key;
          console.log('[umimeto-solver] Čtení: next question');
          nextButton.click();
        }
        return;
      }

      const questionText = normalize(questionTitle.textContent);
      const question = story.item.questions.find(entry =>
        normalize(contentText(entry.stem)) === questionText
      );
      if (!question || !Array.isArray(question.options)) {
        console.warn('[umimeto-solver] Čtení: question not found:', {
          story: story.name, question: questionTitle.textContent
        });
        return;
      }

      const correctIndex = Number(question.correct);
      const correctText = normalize(contentText(question.options[correctIndex]));
      const visibleOptions = [...optionsContainer.querySelectorAll('.option[data-index]')];
      const correctOption = visibleOptions.find(option => {
        const card = option.querySelector('.card') || option;
        return normalize(card.innerText) === correctText;
      });

      if (!correctOption) {
        console.warn('[umimeto-solver] Čtení: correct option not found:', {
          story: story.name,
          question: questionText,
          correct: correctText,
          visible: visibleOptions.map(option =>
            normalize((option.querySelector('.card') || option).innerText))
        });
        return;
      }

      const answerKey = story.id + '|' + questionText;
      if (window.__cteniAnsweredKey === answerKey) return;
      window.__cteniAnsweredKey = answerKey;
      window.__cteniNextKey = null;

      console.log('[umimeto-solver] Čtení answer:', story.name,
        '→', correctOption.querySelector('.card')?.innerText.trim() ||
          correctOption.innerText.trim());
      // Click the site's option element; its own handler records the answer
      // and advances automatically or reveals the explanation/Next button.
      const answerCard = correctOption.querySelector('.card') || correctOption;
      answerCard.click();
    } catch (error) {
      console.error('[umimeto-solver] Čtení:', error);
      window.__cteniDataPromise = null;
    } finally {
      window.__cteniBusy = false;
    }
  }

  async function answer_slova_ve_vetach () {
    if (window.__slovaVetBusy) return;
    const table = document.getElementById('multi-lines-table');
    const evaluateButton = document.getElementById('evaluate');
    const nextButton = document.getElementById('next');
    if (!table || !evaluateButton) return;

    const isVisible = element => !!element &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden' &&
      element.getClientRects().length > 0;

    window.__slovaVetBusy = true;
    try {
      if (!window.__slovaVetDataPromise) {
        const requestUrl = performance.getEntriesByType('resource')
          .map(entry => entry.name)
          .find(url => url.includes('/ajax/universalLoadMedalPs.php?'));
        if (!requestUrl) {
          console.warn('[umimeto-solver] Slova ve větách: medal request URL not found');
          return;
        }
        window.__slovaVetDataPromise = (async () => {
          const response = await fetch(requestUrl, { credentials: 'same-origin' });
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const encoded = await response.text();
          const reversed = encoded.replace(/[a-z]/g, char =>
            String.fromCharCode(219 - char.charCodeAt(0))
          );
          const decoded = decodeURIComponent(
            [...atob(reversed)].map(char =>
              '%' + char.charCodeAt(0).toString(16).padStart(2, '0')
            ).join('')
          );
          return JSON.parse(decoded);
        })();
      }

      const data = await window.__slovaVetDataPromise;
      const pageId = window.location.pathname.split('/').filter(Boolean).pop();
      const currentItem = data.items.find(item => String(item.id) === String(pageId));
      if (!currentItem?.item?.sentences) {
        console.warn('[umimeto-solver] Slova ve větách: current item not found', pageId);
        return;
      }

      const normalize = value => String(value ?? '')
        .normalize('NFKC')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase('cs');

      const words = [...document.querySelectorAll('.word')];
      const boxes = [...document.querySelectorAll('.wordBox')];
      const usedWords = new Set();

      for (const box of boxes) {
        const match = box.id.match(/^wordBox(\d+)-(\d+)$/);
        if (!match) continue;
        const row = Number(match[1]);
        const slot = Number(match[2]);
        const correctWord = currentItem.item.sentences[row]?.solution?.[slot];
        if (correctWord == null) continue;

        const word = words.find(element =>
          !usedWords.has(element) && normalize(element.getAttribute('word')) === normalize(correctWord)
        );
        if (!word) {
          console.warn('[umimeto-solver] Slova ve větách: answer card not found', correctWord);
          continue;
        }

        usedWords.add(word);
        $(word).position({ of: $(box), my: 'left top', at: 'left top' });
        $(box).attr('currentWord', word.id);
        $(word).attr('currentBox', box.id);
      }

      const allPlaced = boxes.every(box => String($(box).attr('currentWord')) !== '-1');
      if (!allPlaced) return;

      const itemKey = String(currentItem.id);
      if (window.__slovaVetEvaluated !== itemKey) {
        window.__slovaVetEvaluated = itemKey;
        console.log('[umimeto-solver] Slova ve větách: evaluating', itemKey);
        $(evaluateButton).trigger('click');
        return;
      }

      if (isVisible(nextButton) && !nextButton.classList.contains('disabled')) {
        window.__slovaVetEvaluated = null;
        $(nextButton).trigger('click');
      }
    } catch (error) {
      console.error('[umimeto-solver] Slova ve větách:', error);
      window.__slovaVetDataPromise = null;
    } finally {
      window.__slovaVetBusy = false;
    }
  }

  async function answer_priserky () {
    if (window.__priserkyBusy) return;

    const wrapper = document.getElementById('question-wrapper');
    const questionElement = wrapper?.querySelector('[data-data="question"]');
    const cards = [...(wrapper?.querySelectorAll('[data-data="option"]') || [])];
    if (!questionElement || cards.length !== 2) return;

    // Completed questions have their gap filled with the correct letter.
    // Only solve while the original blank is still present.
    if (!questionElement.querySelector('.gap')) return;

    const questionText = questionElement.innerText.trim();
    const signature = JSON.stringify([
      questionText,
      cards.map(card => card.innerText.trim())
    ]);
    if (!questionText || signature === window.__priserkyLastSignature) return;

    window.__priserkyBusy = true;
    try {
      if (!window.__priserkyDataPromise) {
        if (typeof window.fjWEDGjivdsXloadQuestionData !== 'function') {
          console.warn('[umimeto-solver] Příšerky: question loader unavailable');
          return;
        }
        window.__priserkyDataPromise =
          window.fjWEDGjivdsXloadQuestionData('loadZombiciQuestions.php');
      }

      const data = await window.__priserkyDataPromise;
      const extractText = value => {
        if (Array.isArray(value)) {
          if (value[0] === 'text' && typeof value[1] === 'string') return value[1];
          return value.map(extractText).join('');
        }
        return typeof value === 'string' ? value : '';
      };
      const normalize = value => String(value ?? '')
        .normalize('NFKC')
        .replace(/\s+/g, ' ')
        .trim();

      const matches = (data?.questions || []).filter(question =>
        normalize(extractText(question.question)) === normalize(questionText)
      );
      const visibleOptions = cards.map(card => normalize(card.innerText));
      const question = matches.find(candidate =>
        candidate.options?.length === 2 &&
        candidate.options.every((option, index) =>
          normalize(extractText(option.option)) === visibleOptions[index]
        )
      ) || matches[0];

      if (!question) {
        console.warn('[umimeto-solver] Příšerky: unanswered question not found:', questionText);
        return;
      }

      const correctIndex = question.options.findIndex(option => Number(option.correct) === 1);
      if (correctIndex < 0 || !cards[correctIndex]) {
        console.warn('[umimeto-solver] Příšerky: correct option not found:', questionText);
        return;
      }

      window.__priserkyLastSignature = signature;
      console.log(
        '[umimeto-solver] Příšerky:',
        questionText,
        '→',
        visibleOptions[correctIndex],
        '(' + correctIndex + ')'
      );
      cards[correctIndex].click();
    } catch (error) {
      console.error('[umimeto-solver] Příšerky:', error);
      window.__priserkyDataPromise = null;
    } finally {
      window.__priserkyBusy = false;
    }
  }

  function answer_tetris () {
    const termsContainer = document.getElementById('terms');
    const categoriesContainer = document.getElementById('categories');
    if (!termsContainer || !categoriesContainer) return;

    // The first Tetris question-data request happens before this solver runs.
    // Capture subsequent rounds before the game consumes their terms with shift().
    if (!window.__tetrisFetchHooked &&
        typeof window.fjWEDGjivdsXloadQuestionData === 'function') {
      window.__tetrisOriginalLoader =
        window.fjWEDGjivdsXloadQuestionData;
      window.__tetrisDataHistory = [];

      window.fjWEDGjivdsXloadQuestionData = async function (endpoint, ...args) {
        const data = await window.__tetrisOriginalLoader.call(this, endpoint, ...args);

        if (endpoint === 'loadTetrisCategoryData.php' &&
            Array.isArray(data?.categories)) {
          window.__tetrisDataHistory.push({
            time: Date.now(),
            categories: structuredClone(data.categories)
          });
          // Keep only a few recent rounds.
          window.__tetrisDataHistory =
            window.__tetrisDataHistory.slice(-5);
          console.log('[umimeto-solver] Tetris: captured round data',
            data.categories.map(category => category.terms.length));
        }

        return data;
      };
      window.__tetrisFetchHooked = true;
    }

    const isVisible = element => !!element &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden' &&
      element.getClientRects().length > 0;

    // When a round ends, the game shows its own Retry/Next level button.
    // Click it once, then wait for the next falling piece before resuming.
    const levelButton = [...document.querySelectorAll(
      '#exercise [data-data="load-level"]'
    )].find(element =>
      isVisible(element) &&
      ['Další level', 'Opakovat level'].includes(element.textContent.trim())
    );

    if (levelButton) {
      if (!window.__tetrisTransitioning) {
        window.__tetrisTransitioning = true;
        console.log('[umimeto-solver] Tetris: advancing',
          levelButton.textContent.trim());
        levelButton.click();
      }
      return;
    }

    const node = termsContainer.querySelector('.term.falling');
    if (!node) return;
    window.__tetrisTransitioning = false;

    const history = window.__tetrisDataHistory || [];
    const entry = history[history.length - 1];

    // The initial round was loaded before the solver could install its hook.
    // Show a visible notice and instantly drop each piece to finish this
    // unsolved round quickly. Automatic classification starts next round.
    if (!entry) {
      let notice = document.getElementById('sstop-tetris-first-round-warning');
      if (!notice) {
        notice = document.createElement('div');
        notice.id = 'sstop-tetris-first-round-warning';
        notice.textContent = 'Upozornění: První kolo nelze automaticky vyřešit. Solver ho rychle dokončí a automatické odpovídání začne od dalšího kola.';
        notice.style.cssText = 'position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483647;background:#fff3cd;color:#664d03;border:1px solid #ffecb5;border-radius:6px;padding:10px 16px;font:bold 14px/1.4 sans-serif;text-align:center;max-width:90vw;box-shadow:0 2px 8px rgba(0,0,0,.25);';
        document.body.appendChild(notice);
      }

      if (node !== window.__tetrisFirstRoundLastNode) {
        const downButton = document.getElementById('arrow-down');
        if (downButton) {
          window.__tetrisFirstRoundLastNode = node;
          downButton.click();
          console.log('[umimeto-solver] Tetris: fast-dropping first-round piece');
        }
      }
      return;
    }

    document.getElementById('sstop-tetris-first-round-warning')?.remove();

    if (node === window.__tetrisLastNode) return;

    const word = node.querySelector('.content')?.textContent.trim();
    if (!word) return;

    const categories = entry.categories;
    const target = categories.findIndex(category =>
      category.terms.some(term => term.term?.[1] === word)
    );

    if (target < 0) {
      window.__tetrisLastNode = node;
      console.warn('[umimeto-solver] Tetris: word not found in latest round data:', word);
      return;
    }

    const current = Math.round(
      parseFloat(node.style.left) / (100 / categories.length)
    );
    const leftButton = document.getElementById('arrow-left');
    const rightButton = document.getElementById('arrow-right');
    const downButton = document.getElementById('arrow-down');

    if (!leftButton || !rightButton || !downButton) return;

    window.__tetrisLastNode = node;

    const button = target < current ? leftButton : rightButton;
    for (let step = 0; step < Math.abs(target - current); step++) {
      button.click();
    }

    downButton.click();
    console.log('[umimeto-solver] Tetris: placed', word, '→ column', target);
  }

  function answer_strilecka () {
    const plan = document.getElementById('plan');
    const playground = document.getElementById('playground');

    if (!plan || !playground || !window.sstop_timer?.running) return;

    // Capture the exact randomized data returned to the game. The game
    // preloads the next round after victory/loss, before its next button
    // is clicked, so keep a history and match it against the visible board.
    if (!window.__strileckaFetchHooked &&
        typeof window.fjWEDGjivdsXloadQuestionData === 'function') {
      window.__strileckaOriginalLoader =
        window.fjWEDGjivdsXloadQuestionData;

      window.__strileckaDataHistory = [];
      window.fjWEDGjivdsXloadQuestionData = async function (endpoint, ...args) {
        const data = await window.__strileckaOriginalLoader.call(this, endpoint, ...args);

        if (endpoint === 'loadStrilecka.php' && Array.isArray(data?.items)) {
          window.__strileckaDataHistory.push({
            time: Date.now(),
            items: data.items
          });
          console.log('[umimeto-solver] Střílečka: captured round data',
            data.items.length);
        }

        return data;
      };
      window.__strileckaFetchHooked = true;
    }

    const isVisible = element => !!element &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden' &&
      element.getClientRects().length > 0;

    // The game loads the next round before showing its Next/Retry button.
    // Start it only after the response has been captured by the hook.
    if (getComputedStyle(playground).display === 'none') {
      if (window.__strileckaTransitioning) return;

      const button = [...document.querySelectorAll(
        '#exercise [data-data="load-level"]'
      )].find(element =>
        isVisible(element) &&
        ['Další level', 'Opakovat level'].includes(element.textContent.trim())
      );

      if (button) {
        window.__strileckaTransitioning = true;
        console.log('[umimeto-solver] Střílečka: advancing',
          button.textContent.trim());
        button.click();
      }
      return;
    }

    window.__strileckaTransitioning = false;

    // Wait until the round is actually displayed before holding Popožeň.
    // prepareLevel() can reset the boost if mousedown is dispatched too early.
    const speedUpButton = document.getElementById('speed-up');
    if (speedUpButton && !window.__strileckaSpeedUpHeld &&
        !speedUpButton.disabled) {
      window.__strileckaSpeedUpHeld = true;
      speedUpButton.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
      console.log('[umimeto-solver] Střílečka: holding Popožeň');
    }

    const words = [...plan.querySelectorAll('.word[data-index]')];
    // Wait for at least two words to avoid accidentally matching an old
    // round on a single coincidentally identical word.
    if (words.length < 2) return;

    const normalize = value => String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim();

    // Choose the newest captured response whose indexed terms correspond
    // to every word currently rendered by the game. The game may render
    // either the original underscore form or the completed form.
    const entry = [...(window.__strileckaDataHistory || [])]
      .reverse()
      .find(candidate => words.every(word => {
        const item = candidate.items?.[Number(word.dataset.index)];
        if (!item) return false;

        const term = (item.term || []).map(part => part?.[1] ?? '').join('');
        const substitution = (item.substitution || [])
          .map(part => part?.[1] ?? '').join('');
        const completed = term.replace('_', substitution);
        const visible = normalize(word.innerText);

        return visible === normalize(term) ||
          visible === normalize(completed);
      }));

    if (!entry) {
      // The first round is preloaded before this solver can capture its data.
      // Show a notice instead of silently doing nothing.
      if (!(window.__strileckaDataHistory || []).length) {
        let notice = document.getElementById('sstop-strilecka-first-round-warning');
        if (!notice) {
          notice = document.createElement('div');
          notice.id = 'sstop-strilecka-first-round-warning';
          notice.textContent = 'Upozornění: První kolo nelze automaticky vyřešit. Automatické odpovídání začne od druhého kola.';
          notice.style.cssText = 'position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483647;background:#fff3cd;color:#664d03;border:1px solid #ffecb5;border-radius:6px;padding:10px 16px;font: bold 14px/1.4 sans-serif;text-align:center;max-width:90vw;box-shadow:0 2px 8px rgba(0,0,0,.25);';
          document.body.appendChild(notice);
        }
      }
      return;
    }

    document.getElementById('sstop-strilecka-first-round-warning')?.remove();

    for (const word of words) {
      if (!window.sstop_timer?.running) return;

      const index = Number(word.dataset.index);
      const item = entry.items[index];

      if (Number(item?.correct) === 1 &&
          !word.classList.contains('correct') &&
          !word.classList.contains('wrong')) {
        word.click();
        console.log('[umimeto-solver] Střílečka: shot word', index);
      }
    }
  }

  async function answer_vtipy () {
    if (window.__vtipyBusy) return;
    const joke = document.getElementById('joke');
    if (!joke) return;

    const isVisible = element => !!element &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden' &&
      element.getClientRects().length > 0;

    window.__vtipyBusy = true;
    try {
      if (!window.__vtipyDataPromise) {
        if (typeof window.fjWEDGjivdsXloadQuestionData !== 'function') {
          console.warn('[umimeto-solver] Vtipy: question loader unavailable');
          return;
        }
        window.__vtipyDataPromise =
          window.fjWEDGjivdsXloadQuestionData('universalLoadItems.php');
      }
      const data = await window.__vtipyDataPromise;
      const items = data?.items || [];
      const info = document.getElementById('info');
      const nextButton = info?.querySelector('.next');

      // The game reveals its own Next button after all misspellings are hit.
      if (isVisible(info) && isVisible(nextButton)) {
        const currentId = window.__vtipyCurrentItemId;
        if (currentId && window.__vtipyNextFor !== currentId) {
          window.__vtipyNextFor = currentId;
          console.log('[umimeto-solver] Vtipy: next joke', currentId);
          nextButton.click();
          window.__vtipyCurrentItemId = null;
          window.__vtipyAnsweredId = null;
        }
        return;
      }
      if (isVisible(document.getElementById('finalBoard'))) return;

      const visibleWords = [...joke.querySelectorAll('.word')];
      if (!visibleWords.length) return;
      const normalize = value => String(value ?? '')
        .normalize('NFKC')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase('cs');

      const pattern = /\[([^/]+)\/([^\]]*)\]/g;
      const displayToken = token => {
        const text = String(token)
          .replace(pattern, '$2')
          .replace(/-/g, '')
          .replace(/_/g, ' ');
        const holder = document.createElement('div');
        holder.innerHTML = text;
        return normalize(holder.textContent);
      };

      // vtipy.js splits the source joke on spaces before creating .word spans.
      const currentItem = items.find(item => {
        const tokens = String(item.item || '').split(' ');
        return tokens.length === visibleWords.length &&
          tokens.every((token, index) =>
            displayToken(token) === normalize(visibleWords[index].textContent));
      });

      if (!currentItem) {
        console.warn('[umimeto-solver] Vtipy: current joke not matched', {
          visible: visibleWords.map(word => word.textContent),
          candidates: items.map(item => item.name)
        });
        return;
      }

      window.__vtipyCurrentItemId = String(currentItem.id);
      if (window.__vtipyAnsweredId === String(currentItem.id)) return;

      const tokens = String(currentItem.item || '').split(' ');
      const targetIndices = [];
      tokens.forEach((token, index) => {
        pattern.lastIndex = 0;
        if (pattern.test(token)) targetIndices.push(index);
      });
      if (!targetIndices.length) {
        console.warn('[umimeto-solver] Vtipy: no answer targets found', currentItem.name);
        return;
      }

      window.__vtipyAnsweredId = String(currentItem.id);
      console.log('[umimeto-solver] Vtipy answer:', currentItem.name,
        '→ word indices', targetIndices);
      for (const index of targetIndices) {
        visibleWords[index]?.click();
      }
    } catch (error) {
      console.error('[umimeto-solver] Vtipy:', error);
      window.__vtipyDataPromise = null;
    } finally {
      window.__vtipyBusy = false;
    }
  }

  async function answer_carky () {
    if (window.__carkyBusy) return;

    const evaluateButton = document.getElementById('evaluate');
    const nextButton = document.getElementById('next');
    const questionContent = document.getElementById('question-content');
    const pageId = window.location.pathname.split('/').filter(Boolean).pop();

    if (!pageId || !evaluateButton || !questionContent) return;

    window.__carkyBusy = true;
    try {
      // The exercise updates the final URL segment to the current item's ID.
      if (!window.__carkyDataPromise) {
        if (typeof window.fjWEDGjivdsXloadQuestionData !== 'function') {
          console.warn('[umimeto-solver] Čárky: question loader unavailable.');
          return;
        }
        window.__carkyDataPromise =
          window.fjWEDGjivdsXloadQuestionData('universalLoadMedalPs.php');
      }

      const data = await window.__carkyDataPromise;
      const item = (data?.items || []).find(entry => String(entry.id) === pageId);
      if (!item || item.type !== 'text' || item.areas !== 'commas') {
        console.warn('[umimeto-solver] Čárky: matching comma item not found:', pageId);
        return;
      }

      // Once evaluated, use the exercise's own Next button.
      if (nextButton && getComputedStyle(nextButton).display !== 'none' &&
          getComputedStyle(nextButton).visibility !== 'hidden') {
        if (window.__carkyNextClickedFor !== pageId) {
          window.__carkyNextClickedFor = pageId;
          console.log('[umimeto-solver] Čárky: next question', pageId);
          nextButton.click();
        }
        return;
      }

      if (window.__carkyAnsweredId === pageId) return;

      // Reproduce createTextPlugin().prepareCommas() exactly: each optional
      // comma-plus-space boundary receives one selectable-area index.
      const correctIndices = new Set();
      let index = 0;
      const preparedContent = item.content
        .replace(/\s+/g, ' ')
        .replace(/ ?((<[^>]*> ?)+) /g, (match, html) => ` ${html.replace(/> </g, '><')}`)
        .split(/((?:<[^>]*>)+)/g);

      preparedContent.forEach(chunk => {
        if (chunk.startsWith('<') && chunk.endsWith('>')) return;
        chunk.replace(/,? /g, match => {
          if (match.startsWith(',')) correctIndices.add(index);
          index++;
          return match;
        });
      });

      const areas = [...questionContent.querySelectorAll('.selectable-area')]
        .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

      if (areas.length !== index) {
        console.warn('[umimeto-solver] Čárky: area count mismatch', {
          item: pageId, expected: index, actual: areas.length
        });
        return;
      }

      correctIndices.forEach(correctIndex => {
        const area = areas.find(element => Number(element.dataset.index) === correctIndex);
        if (area && !area.classList.contains('selected')) area.click();
      });

      window.__carkyAnsweredId = pageId;
      console.log('[umimeto-solver] Čárky answer:', pageId,
        [...correctIndices], '/', areas.length);
      evaluateButton.click();
    } catch (error) {
      console.error('[umimeto-solver] Čárky:', error);
      window.__carkyDataPromise = null;
    } finally {
      window.__carkyBusy = false;
    }
  }

  async function answer_oznacovani () {
    if (window.__oznacovaniBusy) return;

    const evaluateButton = document.getElementById('evaluate');
    const nextButton = document.getElementById('next');
    const questionContent = document.getElementById('question-content');
    const pageId = window.location.pathname.split('/').filter(Boolean).pop();

    if (!pageId || !evaluateButton || !questionContent) return;

    window.__oznacovaniBusy = true;
    try {
      // The exercise updates the final URL segment to the current item's ID.
      if (!window.__oznacovaniDataPromise) {
        if (typeof window.fjWEDGjivdsXloadQuestionData !== 'function') {
          console.warn('[umimeto-solver] Označování: question loader unavailable.');
          return;
        }
        window.__oznacovaniDataPromise =
          window.fjWEDGjivdsXloadQuestionData('universalLoadMedalPs.php');
      }

      const data = await window.__oznacovaniDataPromise;
      const item = (data?.items || []).find(entry => String(entry.id) === pageId);
      if (!item || item.type !== 'text' || item.areas !== 'commas') {
        console.warn('[umimeto-solver] Označování: matching comma item not found:', pageId);
        return;
      }

      // Advance after the previous answer has been evaluated.
      if (nextButton && getComputedStyle(nextButton).display !== 'none' &&
          getComputedStyle(nextButton).visibility !== 'hidden') {
        if (window.__oznacovaniNextClickedFor !== pageId) {
          window.__oznacovaniNextClickedFor = pageId;
          console.log('[umimeto-solver] Označování: next question', pageId);
          nextButton.click();
        }
        return;
      }

      if (window.__oznacovaniAnsweredId === pageId) return;

      // Reproduce createTextPlugin().prepareCommas(): each comma-plus-space
      // boundary receives one selectable-area index.
      const correctIndices = new Set();
      let index = 0;
      const preparedContent = item.content
        .replace(/\s+/g, ' ')
        .replace(/ ?((<[^>]*> ?)+) /g, (match, html) => ` ${html.replace(/> </g, '><')}`)
        .split(/((?:<[^>]*>)+)/g);

      preparedContent.forEach(chunk => {
        if (chunk.startsWith('<') && chunk.endsWith('>')) return;
        chunk.replace(/,? /g, match => {
          if (match.startsWith(',')) correctIndices.add(index);
          index++;
          return match;
        });
      });

      const areas = [...questionContent.querySelectorAll('.selectable-area')]
        .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

      if (areas.length !== index) {
        console.warn('[umimeto-solver] Označování: area count mismatch', {
          item: pageId, expected: index, actual: areas.length
        });
        return;
      }

      correctIndices.forEach(correctIndex => {
        const area = areas.find(element => Number(element.dataset.index) === correctIndex);
        if (area && !area.classList.contains('selected')) area.click();
      });

      window.__oznacovaniAnsweredId = pageId;
      console.log('[umimeto-solver] Označování answer:', pageId,
        [...correctIndices], '/', areas.length);
      evaluateButton.click();
    } catch (error) {
      console.error('[umimeto-solver] Označování:', error);
      window.__oznacovaniDataPromise = null;
    } finally {
      window.__oznacovaniBusy = false;
    }
  }

  function answer_zavody_v_psani () {
    const correct_answer = -1;
    try {
      if (finished == '1' || itemOffset == '-1') {
        // nothing, the game ended or hasn't started
      } else {
        $('#answer').val(items[itemOffset]);
        $('#answer').unbind('input');
        setTimeout(function () {
          $('#answer').on('input', function () {
            evaluate();
          });
        }, 1);
        setTimeout(function () {
          $('#answer')[0].dispatchEvent(new Event('input', { bubbles: true }));
        }, 3);
        console.log('Correct answer: ' + items[itemOffset]);
      }
    } catch (error) { console.error(error); }
  }

  // check if the website is supported
  if (window.location.hostname.includes('www.umime')) {
    const ulr_ex_type = window.location.pathname.split('/')[1];
    async function loadItems () {
      const searchParams = new URLSearchParams({ user, ps, kc, chosenProblem, exercise, cookieHash });
      const path = psType === ('resourceData' && specs.resourceData === 'binaryChoice') ? 'universalLoadMedal.ps' : 'doplnovackaLoadQuestionsBinaryChoiceData.php';
      const response = await fetch(`${apiUrl}/${path}?${searchParams.toString()}`);
      const data = await response.json();
      items = data.items;
      itemNum = items.length;

      const optionMaxLength = items
        .map((item) => Math.max(getFormattedLength(item.options[0].option), getFormattedLength(item.options[0].option)))
        .reduce((acc, len) => Math.max(acc, len), 0);
      document.getElementById('options').classList.toggle('short', optionMaxLength <= 3);

      finished = true;
      preloadImages(items);
    }
    // Some current exercise types do not define the legacy question-loader globals.
    // Keep the legacy loader for exercises that still provide them, and catch async errors.
    if (typeof kc !== 'undefined' &&
        typeof chosenProblem !== 'undefined' &&
        typeof cookieHash !== 'undefined' &&
        typeof apiUrl !== 'undefined') {
      loadItems()
        .then(() => {
          window.questions = items;
        })
        .catch(e => {
          console.warn('[umimeto-solver] Legacy question loader unavailable:', e);
        });
    }
    if (ulr_ex_type.includes('doplnovani-slov') && !document.getElementById('multi-lines-table')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_doplnovani_slov();
      window.sstop_timer.start(function () {
        answer_doplnovani_slov();
      }, 1500);
    } else if (ulr_ex_type.includes('doplnovacka') || ulr_ex_type.includes('rozhodovacka')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_doplnovacka();
      // loop
      window.sstop_timer.start(function () {
        answer_doplnovacka();
      }, 1500);
    } else if (window.location.href.includes('?p=zavodyPsani')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_zavody_v_psani();

      // window.sstop_slider.min = 50;

      // loop
      window.sstop_timer.start(function () {
        answer_zavody_v_psani();
      }, 1500);
    } else if (window.location.href.includes('?p=zavody') || window.location.href.includes('?p=tymovka')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // The modern multiplayer race uses its own encrypted question API.
      answer_race();
      window.sstop_timer.start(function () {
        answer_race();
      }, 1500);
    } else if (window.location.pathname.includes('/vpisovacka') || window.location.pathname.includes('/vpisovani-')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_vpisovacka();
      // loop
      window.sstop_timer.start(function () {
        answer_vpisovacka();
      }, 1500);
    } else if (window.location.pathname.includes('/priserky')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_priserky();
      window.sstop_timer.start(function () {
        answer_priserky();
      }, 100);
    } else if (window.location.pathname.includes('/tetris')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_tetris();
      window.sstop_timer.start(function () {
        answer_tetris();
      }, 50);
    } else if (window.location.pathname.includes('/strilecka')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      if (window.__strileckaObserver) {
        window.__strileckaObserver.disconnect();
        window.__strileckaObserver = null;
      }
      window.sstop_timer.start(function () {
        answer_strilecka();
      }, 100);
    } else if (window.location.pathname.includes('/vtipy')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_vtipy();
      window.sstop_timer.start(function () {
        answer_vtipy();
      }, 1500);
    } else if (window.location.href.includes('/hadanky')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_hadanky();
      // loop
      window.sstop_timer.start(function () {
        answer_hadanky();
      }, 1500);
    } else if (window.location.href.includes('/diktat')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_diktat();

      window.sstop_slider.min = 50;

      // loop
      window.sstop_timer.start(function () {
        answer_diktat();
      }, 1500);
    } else if (window.location.href.includes('/ukolovka')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_ukolovka();
      // loop
      window.sstop_timer.start(function () {
        answer_ukolovka();
      }, 1500);
    } else if (window.location.pathname.includes('/poslech-slov')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_poslech_slov();
      window.sstop_timer.start(function () {
        answer_poslech_slov();
      }, 1500);
    } else if (window.location.href.includes('/pexeso')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_pexeso();

      window.sstop_slider.min = 50;

      // loop
      window.sstop_timer.start(function () {
        answer_pexeso();
      }, 1500);
    } else if (window.location.href.includes('/otazky')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_otazky();
      // loop
      window.sstop_timer.start(function () {
        answer_otazky();
      }, 1500);
    } else if (window.location.href.includes('/krizovky')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_krizovky();
      window.sstop_timer.start(function () {
        answer_krizovky();
      }, 1500);
    } else if (window.location.href.includes('/rozrazovacka')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_rozrazovacka();
      // loop
      try {
        window.sstop_timer.start(function () {
          answer_rozrazovacka();
        }, 1500);
      } catch (error) {}
    } else if (window.location.href.includes('/roboti')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_roboti();
      // loop
      window.sstop_timer.start(function () {
        answer_roboti();
      }, 1500);
    } else if (window.location.href.includes('/mluvene-diktaty')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_mluvene_diktaty();
      // loop
      window.sstop_timer.start(function () {
        answer_mluvene_diktaty();
      }, 1500);
    } else if (window.location.href.includes('/krok-po-kroku') || window.location.href.includes('/chat') || window.location.href.includes('/odvozovani')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_krok_po_kroku();
      // loop
      window.sstop_timer.start(function () {
        answer_krok_po_kroku();
      }, 1500);
    } else if (window.location.href.includes('/rozbory') || window.location.href.includes('/tvorba_slov')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_rozbory();
      // loop
      window.sstop_timer.start(function () {
        answer_rozbory();
      }, 1500);
    } else if (window.location.href.includes('/presouvani')) {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_presouvani();
      // loop
      window.sstop_timer.start(function () {
        answer_presouvani();
      }, 1500);
    } else if (document.getElementById('multi-lines-table') &&
               document.querySelector('.wordBox')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_slova_ve_vetach();
      window.sstop_timer.start(function () {
        answer_slova_ve_vetach();
      }, 1500);
    } else if (window.location.pathname.includes('/porozumeni-cteni') ||
               window.location.pathname.includes('/porozumeni')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_cteni_s_porozumenim();
      window.sstop_timer.start(function () {
        answer_cteni_s_porozumenim();
      }, 1500);
    } else if (window.location.pathname.includes('/oznacovani')) {
      console.log('\\n\\nSource code: https://github.com/MP3Martin/umimeto-solver');
      answer_oznacovani();
      window.sstop_timer.start(function () {
        answer_oznacovani();
      }, 1500);
    } else if (window.location.href.includes('/psani-carek') ||
               window.location.href.includes('/carky') ||
               window.location.href.includes('/carek') ||
               new URLSearchParams(window.location.search).get('topic') === 'cviceni-carky') {
      console.log('\n\nSource code: https://github.com/MP3Martin/umimeto-solver');
      // run for the first time
      answer_carky();
      // loop
      window.sstop_timer.start(function () {
        answer_carky();
      }, 1500);
    } else {
      window.sstop_rm();
      sstop_alert('This exercise is not supported!');
      window.sstop_btn();
    }
  } else {
    window.sstop_rm();
    sstop_alert('This website is not supported!');
    window.sstop_btn();
  }
} else {
  console.log('No jQuery installed on this website!');
}
