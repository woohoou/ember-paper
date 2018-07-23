import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | paper item', function(hooks) {
  setupRenderingTest(hooks);

  test('single action checkboxes should react to checkbox clicks', async function(assert) {
    assert.expect(1);
    this.set('checkboxEnabled', false);
    await render(hbs`
      {{#paper-list}}
        {{#paper-item as |controls|}}
          <p>Checkbox 1</p>
          {{controls.checkbox value=checkboxEnabled onChange=(action (mut checkboxEnabled))}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    return settled().then(() => {
      let checkbox = this.$('md-checkbox');
      checkbox.click();
      assert.ok(this.get('checkboxEnabled'));
    });
  });

  test('single action checkboxes should not react to item clicks when disabled', async function(assert) {
    assert.expect(1);
    this.set('checkboxEnabled', false);
    await render(hbs`
      {{#paper-list}}
        {{#paper-item as |controls|}}
          <p>Checkbox 1</p>
          {{controls.checkbox disabled=true value=checkboxEnabled onChange=(action (mut checkboxEnabled))}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    return settled().then(() => {
      let item = this.$('.md-list-item-inner');
      item.click();
      assert.notOk(this.get('checkboxEnabled'));
    });
  });

  test('single action checkboxes should react to item clicks', async function(assert) {
    assert.expect(1);
    this.set('checkboxEnabled', false);
    await render(hbs`
      {{#paper-list}}
        {{#paper-item as |controls|}}
          <p>Checkbox 1</p>
          {{controls.checkbox value=checkboxEnabled onChange=(action (mut checkboxEnabled))}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    return settled().then(() => {
      let item = this.$('.md-list-item-inner');
      item.click();
      assert.ok(this.get('checkboxEnabled'));
    });
  });

  test('single action radios should react to item clicks', async function(assert) {
    assert.expect(2);

    this.set('selectedValue', null);
    await render(hbs`
      {{#paper-list}}
        {{#paper-item as |controls|}}
          <p>Checkbox 1</p>
          {{controls.radio
            groupValue=selectedValue
            value="some value 1"
            onChange=(action (mut selectedValue))}}
        {{/paper-item}}
        {{#paper-item as |controls|}}
          <p>Checkbox 2</p>
          {{controls.radio
            groupValue=selectedValue
            value="some value 2"
            onChange=(action (mut selectedValue))}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    return settled().then(() => {
      let firstItem = this.$('.md-list-item-inner').eq(0);
      firstItem.click();
      assert.equal(this.get('selectedValue'), 'some value 1');
      let secondItem = this.$('.md-list-item-inner').eq(1);
      secondItem.click();
      assert.equal(this.get('selectedValue'), 'some value 2');
    });
  });

  test('Clickable Items with Secondary Controls must not bubble main item action', function(assert) {
    // the switch test is tricky as it involves passing hammer
    // tap event.
    assert.expect(0);
  });

  test('Item checkbox with secondary action and no primary action is toggled by checkbox click', async function(assert) {
    assert.expect(2);
    this.set('secondaryValue', false);
    this.set('checked', false);

    await render(hbs`
      {{#paper-list}}
        {{#paper-item as |controls|}}
          {{controls.checkbox value=checked onChange=(action (mut checked))}}
          <p>Item with checkbox and secondary action</p>
          {{#controls.button iconButton=true onClick=(action (mut secondaryValue))}}
            {{paper-icon "message"}}
          {{/controls.button}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    let mdCheckbox = this.$('md-checkbox');
    return settled().then(() => {
      mdCheckbox.click();
      assert.ok(this.get('checked'));
      assert.notOk(this.get('secondaryValue'));
    });
  });

  test('Item checkbox with secondary action and no primary action is toggled by primary click', async function(assert) {
    assert.expect(2);
    this.set('secondaryValue', false);
    this.set('checked', false);

    await render(hbs`
      {{#paper-list}}
        {{#paper-item as |controls|}}
          {{controls.checkbox value=checked onChange=(action (mut checked))}}
          <p>Item with checkbox and secondary action</p>
          {{#controls.button iconButton=true onClick=(action (mut secondaryValue))}}
            {{paper-icon "message"}}
          {{/controls.button}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    let item = this.$('.md-list-item-inner');
    return settled().then(() => {
      item.click();
      assert.ok(this.get('checked'));
      assert.notOk(this.get('secondaryValue'));
    });
  });

  test('Item checkbox with secondary action and primary action dont bubble secondary event', async function(assert) {
    assert.expect(3);
    this.set('secondaryValue', false);
    this.set('checked', false);
    this.set('primaryValue', false);
    this.set('primaryAction', () => {
      this.set('primaryValue', !this.get('primaryValue'));
    });

    await render(hbs`
      {{#paper-list}}
        {{#paper-item onClick=(action primaryAction) as |controls|}}
          {{controls.checkbox value=checked onChange=(action (mut checked))}}
          <p>Item with checkbox and secondary action</p>
          {{#controls.button secondary=true iconButton=true onClick=(action (mut secondaryValue))}}
            {{paper-icon "message"}}
          {{/controls.button}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    return settled().then(() => {
      let secondaryButton = this.$('button.md-secondary');
      secondaryButton.click();
      assert.ok(this.get('secondaryValue'));
      assert.notOk(this.get('primaryValue'));
      assert.notOk(this.get('checked'));
    });
  });

  test('Item checkbox with secondary action and primary action dont bubble primary action on checkbox click when checkbox action exists', async function(assert) {
    assert.expect(6);
    this.set('secondaryValue', false);
    this.set('checked', false);
    this.set('primaryValue', false);
    this.set('primaryAction', () => {
      this.set('primaryValue', !this.get('primaryValue'));
    });

    await render(hbs`
      {{#paper-list}}
        {{#paper-item onClick=(action primaryAction) as |controls|}}
          {{controls.checkbox value=checked onChange=(action (mut checked))}}
          <p>Item with checkbox and secondary action</p>
          {{#controls.button iconButton=true onClick=(action (mut secondaryValue))}}
            {{paper-icon "message"}}
          {{/controls.button}}
        {{/paper-item}}
      {{/paper-list}}
    `);
    let item = this.$('.md-button.md-no-style');
    let mdCheckbox = this.$('md-checkbox');
    return settled().then(() => {
      mdCheckbox.click();
      assert.ok(this.get('checked'));
      assert.notOk(this.get('primaryValue'));
      assert.notOk(this.get('secondaryValue'));
      item.click();
      assert.ok(this.get('checked'));
      assert.ok(this.get('primaryValue'));
      assert.notOk(this.get('secondaryValue'));
    });
  });
});
