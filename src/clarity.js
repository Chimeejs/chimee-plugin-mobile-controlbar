import {deepAssign, isObject, addClassName, removeClassName, setStyle, $, hasClassName} from 'chimee-helper';
import Base from './base.js';

/**
 * clarity 配置
 */

const defaultOption = {
  tag: 'chimee-clarity',
  width: '2em',
  html: `
  <chimee-clarity-text></chimee-clarity-text>
  <chimee-clarity-list>
    <ul></ul>
  </chimee-clarity-list>
  `,
  defaultEvent: {
    tap: 'tap'
  },
  duration: 3,
  bias: 0,
  increment: 0,
  repeatTimes: 0,
  immediate: false,
  abort: false,
  list: []
};

export default class Clarity extends Base {
  constructor (parent, option) {
    super(parent);
    this.option = deepAssign(defaultOption, isObject(option) ? option : {});
    this.init();
  }

  init () {
    super.create();
    addClassName(this.$dom, 'chimee-flex-component');

    this.$text = $(this.$dom).find('chimee-clarity-text');
    this.$list = $(this.$dom).find('chimee-clarity-list');
    this.$listUl = this.$list.find('ul');

    // 用户自定义配置
    this.option.width && setStyle(this.$dom, 'width', this.option.width);

    const list = this.option.list;
    if(!list.length) {
      return setStyle(this.$dom, {
        display: 'none'
      });
    }
    this.initTextList(this.option.list);
  }

  initTextList (list) {
    this.$listUl.html('');
    list.forEach(item => {
      const li = $(document.createElement('li'));
      li.attr('data-url', item.src);
      li.text(item.name);
      if(item.src === this.parent.$videoConfig.src) {
        this.$text.text(item.name);
        li.addClass('active');
      }
      this.$listUl.append(li);
    });
  }

  tap (e) {
    const elem = e.target;

    if (elem.tagName === 'CHIMEE-CLARITY' ||
        elem.tagName === 'CHIMEE-CLARITY-TEXT' ) {
          const hasClass = hasClassName(this.$dom, 'open')
          if (hasClass) {
            removeClassName(this.$dom, 'open');
          } else {
            addClassName(this.$dom, 'open');
          }
    }

    if(elem.tagName === 'LI') {
      const url = elem.getAttribute('data-url') || '';
      this.switchClarity(url).then(() => {
        this.loadOption = undefined;
        Array.from(elem.parentElement.children).map(item => {
          removeClassName(item, 'active');
        });
        addClassName(e.target, 'active');
        removeClassName(this.$dom, 'open');
        this.$text.text(e.target.textContent);
      }).catch((e) => {
        console.warn(e);
      });
    }
  }

  switchClarity (url) {
    if (this.loadOption) {
      this.loadOption.abort = true;
    }
    const {duration, bias, increment, repeatTimes, immediate, abort} = this.option;
    this.loadOption = {
      duration,
      bias,
      increment,
      repeatTimes,
      immediate,
      abort
    };
    return this.parent.$silentLoad(url, this.loadOption);
  }

}
