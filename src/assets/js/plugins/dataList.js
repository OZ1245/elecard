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
