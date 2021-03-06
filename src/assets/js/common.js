'use strict'

class dataList {
  constructor(options) {
    this.$target   = $(options.targetSelector);
    this.className = typeof options.className != 'undefined' ? options.className : 'cards';
    this.url       = typeof options.url != 'undefined' ? options.url : '//contest.elecard.ru/frontend_data/';
    this.targetFile= typeof options.file != 'undefined' ? options.file : 'catalog.json';
    this.fishText  = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce quis ipsum euismod, vulputate velit a, elementum velit.';
    this.data      = [];
  }

  init() {
    let $this = this;

    $this.$target.addClass($this.className);

    $.getJSON($this.url + $this.targetFile, '', function (data) {
      $this.data = data;
      $this.pager = new Pagination({items: $this.data});
      $this.pager.init();
      $this.renderPage();
    });

  }

  renderPage() {
    let $this = this,
        $items = [],
        end = ($this.pager.current * $this.pager.perPage) - 1,
        start = (($this.pager.current * $this.pager.perPage) - $this.pager.perPage);

    for (let i = start; i < end; i++) {
      let item = $this.data[i];
      $items.push($('<div>', {
        class: $this.className + '__item',
        html: [
          $(`<div class="${$this.className}__image"><img src="${$this.url + item.image}" /></div>`),
          $(`<p class="${$this.className}__description">${item.description ? $this.fishText : ''}</p>`),
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
    $this.$target.after($this.pager.$element);
  }

  closeCard(id) {
    let $item = $(`.${this.className}__item[data-id="${id}"]`);
    $item.addClass(`${this.className}_closed`);
    // TODO @ Запись в localStorage
  }

  update() {
    // TODO @ Обновлять список соответсвенно с пагинацией.
    // То есть для пагинации добавить Event, что страница была переключена. 
  }
}

'use strict'

class Pagination {
  constructor(options) {
    this.items      = options.items;
    this.perPage = typeof options.numItems != 'undefined' ? options.numItems : 12;
    this.className  = typeof options.className != 'undefined' ? options.className : 'pagination';
    this.numPages   = parseInt(this.items.length / this.perPage);
    this.current    = 1;
  }

  init() {
    let $this = this;

    $this.$first = $(`<button/>`, {
      type: 'button',
      class: `${$this.className}__first`,
      text: '|<'
    }).on('click', function(){
      $this.update(1);
    });

    $this.$prev = $('<button/>', {
      type: 'button',
      class: `${$this.className}__pref`,
      text: '<<'
    }).on('click', function(){
      $this.update($this.current-1);
    });

    $this.$next = $('<button/>', {
      type: 'button',
      class: `${$this.className}__next`,
      text: '>>'
    }).on('click', function(){
      $this.update($this.current+1);
    });

    $this.$last = $('<button/>', {
      type: 'button',
      class: `${$this.className}__last`,
      text: '>|'
    }).on('click', function(){
      $this.update($this.numPages);
    });

    $this._updateProp();

    $this.$current = $(`<span type="button" class="${$this.className}__current">${$this.current}</span>`);

    $this.$element = $('<div/>', {
      class: this.className,
      html: [$this.$first, $this.$prev, $this.$current, $this.$next, $this.$last]
    });
  }

  update(targetPage) {
    if (targetPage >= 1 || targetPage <= this.numPages) {
      this.current = targetPage;
      this.$current.text(this.current);

      this._updateProp();
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
