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
