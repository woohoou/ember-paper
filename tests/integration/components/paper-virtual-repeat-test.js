import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { next } from '@ember/runloop';

module('Integration | Component | paper virtual repeat', function(hooks) {
  setupRenderingTest(hooks);

  // Will be able to use this if/when PhantomJS supports 3D transfroms
  // function getTransform(target) {
  //   return target[0].style.webkitTransform || target.css('transform');
  // }

  const NUM_EXTRA = 3;

  test('should render only enough items to fill the viewport + 3 (vertical)', async function(assert) {
    assert.expect(1);
    let items = [];
    for (let i = 0; i < 1000; i++) {
      items.push(i);
    }
    this.set('items', items);
    await render(hbs`
      <div style="height: 300px;">
      {{#paper-virtual-repeat items class="vertical-demo" as |visibleItems|}}
        {{#each visibleItems as |item|}}
          <div style="height: 30px;">{{item}}</div>
        {{/each}}
      {{/paper-virtual-repeat}}
      </div>`);

    assert.equal(this.$('.md-virtual-repeat-offsetter').children().length, 10 + NUM_EXTRA);

  });

  test('should render only enough items to fill the viewport + 3 (horizontal)', async function(assert) {
    assert.expect(1);
    let items = [];
    for (let i = 0; i < 1000; i++) {
      items.push(i);
    }
    this.set('items', items);
    await render(hbs`<div style="width: 300px;">
      {{#paper-virtual-repeat items horizontal=true as |visibleItems|}}
        {{#each visibleItems as |item|}}
          <div style="width:30px;">{{item}}</div>
        {{/each}}
      {{/paper-virtual-repeat}}
      </div>`);
    assert.equal(this.$('.md-virtual-repeat-offsetter').children().length, 10 + NUM_EXTRA);
  });

  test('should reposition items when scrolled so that there is still only enough items to fit + 3', async function(assert) {
    assert.expect(3);
    let items = [];
    for (let i = 0; i < 1000; i++) {
      items.push(i);
    }
    this.set('items', items);
    await render(hbs`<div style="height: 300px;">
      {{#paper-virtual-repeat items class="vertical-demo" as |visibleItems|}}
        {{#each visibleItems as |item|}}
          <div style="height:30px;">{{item}}</div>
        {{/each}}
      {{/paper-virtual-repeat}}
      </div>`);

    await settled();

    assert.dom('.md-virtual-repeat-offsetter').hasAttribute('style', 'transform: translateY(0px);');

    this.$('.md-virtual-repeat-scroller').scrollTop(30);

    await settled();

    await next(() => {
      assert.dom('.md-virtual-repeat-offsetter > *').exists({ count: 10 + NUM_EXTRA });
      assert.dom('.md-virtual-repeat-offsetter').hasAttribute('style', 'transform: translateY(30px);');
    });
  });

  test('should call onScrollBottomed action when scrolled to the bottom', async function(assert) {
    assert.expect(1);
    let items = [];
    for (let i = 0; i < 1000; i++) {
      items.push(i);
    }
    this.set('items', items);
    this.scrolled = () => {
      assert.ok(true, 'action called');
    };
    await render(hbs`<div style="height: 300px;">
      {{#paper-virtual-repeat class="vertical-demo" items=items onScrollBottomed=scrolled as |visibleItems|}}
        {{#each visibleItems as |item|}}
          <div style="height:30px;">{{item}}</div>
        {{/each}}
      {{/paper-virtual-repeat}}
      </div>`);
    this.$('.md-virtual-repeat-scroller')[0].scrollTop = 2970;
    return settled();
  });
});
