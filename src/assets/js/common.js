'use strict'

class dataList {
  constructor(options) {
    this.$target   = $(options.targetSelector);
    this.className = typeof options.className != 'undefined' ? options.className : 'cards';
    this.url       = typeof options.url != 'undefined' ? options.url : '//contest.elecard.ru/frontend_data/';
    this.targetFile= typeof options.file != 'undefined' ? options.file : 'catalog.json';
    this.fishText  = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis ipsum euismod, vulputate velit a, elementum velit.';
    this.data      = [];
    this.cookieName= 'cardClosed';
  }

  init() {
    let $this = this;

    $this.$target.addClass($this.className);
    $this.pager;

    $.getJSON($this.url + $this.targetFile, '', function (data) {
      $this.data = data;
      $this.pager = new Pagination({items: $this.data});
      $this.pager.init();
      $this.renderPage();
      $this.$target.after($this.pager.$element);
      $this.pager.$element[0].addEventListener('pagination.update', function(e){
        $this.renderPage();
        $('html').stop().animate({scrollTop: 0}, 500, 'swing');
      });
    });

  }

  renderPage() {
    let $this = this,
        $items = [],
        end = ($this.pager.current * $this.pager.perPage),
        start = (($this.pager.current * $this.pager.perPage) - $this.pager.perPage);

    for (let i = start; i < end; i++) {
      let item = $this.data[i];

      $items.push($('<div>', {
        class: `${$this.className}__item ${$this._checkCookie(i) ? 'closed' : ''}`,
        html: [
          $(`<div class="${$this.className}__image"><img src="${$this.url + item.image}" /></div>`),
          $(`<p class="${$this.className}__description">${item.description ? item.description : $this.fishText}</p>`),
          $('<button/>', {
            type: 'button',
            class: `${$this.className}__button-close`,
            text: 'x'
          }).data('id', i).attr('data-id', i)
            .on('click', function() {
              $this.closeCard($(this).data('id'));
            })
        ]
      }).data('id', i).attr('data-id', i));
    }

    $this.$target.html($items);
  }

  closeCard(id) {
    let dataString = $.cookie(this.cookieName);
    let data = [];
    if (typeof dataString != 'undefined') {
      data = dataString.split(',');
    }
    data.push(id);

    $.cookie(this.cookieName, data.join(','), {expires: 7});

    let $item = $(`.${this.className}__item[data-id="${id}"]`);
    $item.addClass('closed');
  }

  _checkCookie(q) {
    let dataString = $.cookie(this.cookieName);
    if (typeof dataString != 'undefined') {
      return dataString.split(',').filter(id => id == q).length > 0;
    } else return false;
  }
}

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

'use strict'

class Pagination {
  constructor(options) {
    this.items      = options.items;
    this.perPage = typeof options.numItems != 'undefined' ? options.numItems : 12;
    this.className  = typeof options.className != 'undefined' ? options.className : 'pagination';
    this.total      = this.items.length;
    this.numPages   = parseInt(this.total / this.perPage);
    this.current    = 1;
  }

  init() {
    let $this = this;

    $this.$first = $(`<button/>`, {
      type: 'button',
      class: `${$this.className}__button first`,
      text: '|<'
    }).on('click', function(){
      $this.update(1);
    });

    $this.$prev = $('<button/>', {
      type: 'button',
      class: `${$this.className}__button prev`,
      text: '<'
    }).on('click', function(){
      $this.update($this.current-1);
    });

    $this.$next = $('<button/>', {
      type: 'button',
      class: `${$this.className}__button next`,
      text: '>'
    }).on('click', function(){
      $this.update($this.current+1);
    });

    $this.$last = $('<button/>', {
      type: 'button',
      class: `${$this.className}__button last`,
      text: '>|'
    }).on('click', function(){
      $this.update($this.numPages);
    });

    $this._updateProp();

    $this.$selector = $(`<div class="${$this.className}__wrap-selector">Перейти на <select class="${$this.className}__selector"></select></div>`);
    $this.$selector = $('<select/>', {
      class: `${$this.className}__selector`,
      html: function() {
        let $options = [];
        for (let i = 1; i <= $this.numPages; i++) {
          $options.push(`<option value=${i}>${i}</option>`);
        }
        return $options;
      }
    }).on('change', function(){
      $this.update($(this).val());
    });

    $this.$current = $(`<label type="button" class="${$this.className}__current">${$this.current}</label>`);

    $this.$element = $('<div/>', {
      class: this.className,
      html: [$this.$first, $this.$prev, $this.$current, $this.$next, $this.$last]
    });
    $this.$element.append($('<div/>', {
      class: `${$this.className}__wrap-selector`,
      html: [
        $('<label>Перейти на </label>'),
        $this.$selector
      ]
    }))
  }

  update(targetPage) {
    let $this = this;

    if (targetPage >= 1 || targetPage <= this.numPages) {
      $this.current = targetPage;
      $this.$current.text($this.current);

      $this._updateProp();
      $this.$selector.val($this.current);

      let updateEvent = new CustomEvent('pagination.update', {
        bubbles: true,
        detail: {
          current: $this.current,
          perPage: $this.perPage,
          total:   $this.total
        }
      });
      $this.$element[0].dispatchEvent(updateEvent);
    }
  }

  _updateProp() {
    let $this = this;

    $this.$first.prop('disabled', !($this.current > 1));

    $this.$prev.prop('disabled', !($this.current > 1));

    $this.$next.prop('disabled', ($this.current >= $this.numPages));

    $this.$last.prop('disabled', ($this.current >= $this.numPages));
  }
}

$(document).ready(function() {
  let list = new dataList({
    targetSelector: '.js-data-list'
  });
  list.init();
});
