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
