import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | paper card', function(hooks) {
  setupRenderingTest(hooks);

  test('blockless media renders image', async function(assert) {
    assert.expect(5);

    await render(hbs`
      {{#paper-card as |card|}}
        {{#card.title as |title|}}
          {{#title.text as |text|}}
            {{#text.headline}}Card with block{{/text.headline}}
            {{#text.subhead}}Extra large{{/text.subhead}}
          {{/title.text}}
        {{/card.title}}
        {{#card.content class="layout-row layout-align-space-between"}}
          {{card.media src="/image.png" alt="imagealt" title="imagetitle" size="xl"}}
          {{#card.actions class="layout-column"}}
            {{#paper-button iconButton=true}}{{paper-icon "favorite"}}{{/paper-button}}
            {{#paper-button iconButton=true}}{{paper-icon "settings"}}{{/paper-button}}
            {{#paper-button iconButton=true}}{{paper-icon "share"}}{{/paper-button}}
          {{/card.actions}}
        {{/card.content}}
      {{/paper-card}}
    `);

    let img = this.$('img');

    assert.equal(img.get(0).tagName, 'IMG');
    assert.ok(/image.png$/.test(img.prop('src')));
    assert.equal(img.prop('alt'), 'imagealt');
    assert.equal(img.prop('title'), 'imagetitle');
    assert.ok(img.hasClass('md-media-xl'));
  });

  test('block media renders div with correct class', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#paper-card as |card|}}
        {{#card.title as |title|}}
          {{#title.text as |text|}}
            {{#text.headline}}Card with block{{/text.headline}}
            {{#text.subhead}}Extra large{{/text.subhead}}
          {{/title.text}}
        {{/card.title}}
        {{#card.content class="layout-row layout-align-space-between"}}
          {{#card.media size="xl"}}
            <div id="çup"></div>
          {{/card.media}}
          {{#card.actions class="layout-column"}}
            {{#paper-button iconButton=true}}{{paper-icon "favorite"}}{{/paper-button}}
            {{#paper-button iconButton=true}}{{paper-icon "settings"}}{{/paper-button}}
            {{#paper-button iconButton=true}}{{paper-icon "share"}}{{/paper-button}}
          {{/card.actions}}
        {{/card.content}}
      {{/paper-card}}
    `);

    let div = this.$('#çup').parent();

    assert.equal(div.get(0).tagName, 'DIV');
    assert.ok(div.hasClass('md-media-xl'));
  });
});