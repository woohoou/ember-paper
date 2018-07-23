import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find, focus, triggerEvent, findAll, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | paper autocomplete', function(hooks) {
  setupRenderingTest(hooks);

  /* test('either `onSearchTextChange` or `onSelectionChange` functions are provided provided', function(assert) {
    assert.expect(4);

    assert.throws(() => {
      this.render(hbs`
        {{#paper-autocomplete options=countries selected=selected as |opt|}}
          {{opt}}
        {{/paper-autocomplete}}
        `);
    }, 'requires at least one of the `onSelectionChange` or `onSearchTextChange` functions to be provided.');

    assert.ok(() => {
      this.render(hbs`
        {{#paper-autocomplete
            options=countries
            selected=selected
            onSelectionChange=(action (mut selected)) as |opt|}}
          {{opt}}
        {{/paper-autocomplete}}
        `);
    }, 'does not throw when on `onSelectionChange` is provided');

    assert.ok(() => {
      this.render(hbs`
        {{#paper-autocomplete
            options=countries
            searchText=searchText
            onSearchTextChange=(action (mut searchText)) as |opt|}}
          {{opt}}
        {{/paper-autocomplete}}
        `);
    }, 'does not throw when on `onSearchTextChange` is provided');

    assert.ok(() => {
      this.render(hbs`
        {{#paper-autocomplete
            options=countries
            searchText=searchText
            onSearchTextChange=(action (mut searchText))
            selected=selected
            onSelectionChange=(action (mut selected)) as |opt|}}
          {{opt}}
        {{/paper-autocomplete}}
        `);
    }, 'does not throw when both `onSearchTextChange` and `onSelectionChange` are provided');
  });*/

  test('opens on click', async function(assert) {
    assert.expect(1);
    this.set('items', ['Ember', 'Paper', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']);
    await render(hbs`{{#paper-autocomplete
      placeholder="Item"
      options=items
      searchText=searchText
      onSearchTextChange=(action (mut searchText))
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item|
    }}
      {{item}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    assert.ok(find('.md-autocomplete-suggestions'), 'opened menu');
  });

  test('backdrop removed if select closed', async function(assert) {
    assert.expect(2);
    this.set('items', ['Ember', 'Paper', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']);
    await render(hbs`
      <div id="other-div"></div>
      {{#paper-autocomplete
      placeholder="Item"
      options=items
      searchText=searchText
      onSearchTextChange=(action (mut searchText))
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item|
    }}
      {{item}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    assert.ok(find('.md-autocomplete-suggestions'), 'opened menu');

    await triggerEvent('#other-div', 'mousedown');

    assert.notOk(find('.md-autocomplete-suggestions'), 'backdrop removed');
  });

  test('should render only enough items to fill the menu + 3', async function(assert) {
    assert.expect(2);
    this.set('items', ['Ember', 'Paper', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']);
    await render(hbs`{{#paper-autocomplete
      placeholder="Item"
      options=items
      searchText=searchText
      onSearchTextChange=(action (mut searchText))
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item|
    }}
      {{item}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    assert.ok(find('.md-autocomplete-suggestions'), 'opened menu');

    assert.equal(findAll('.md-autocomplete-suggestions li').length, 8, 'only rendered 8 items');
  });

  test('should filter list by search term', async function(assert) {
    assert.expect(3);
    this.set('items', ['Ember', 'Paper', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']);
    await render(hbs`{{#paper-autocomplete
      placeholder="Item"
      options=items
      searchText=searchText
      onSearchTextChange=(action (mut searchText))
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item|
    }}
      {{item}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    assert.ok(find('.md-autocomplete-suggestions'), 'opened menu');

    assert.equal(findAll('.md-autocomplete-suggestions li').length, 8, 'only rendered 8 items');

    await fillIn('md-autocomplete-wrap input', 'four');

    assert.equal(findAll('.md-autocomplete-suggestions li').length, 1, 'only render searched item');
  });

  test('when has selection and gets focused, the dropdown is not shown', async function(assert) {
    assert.expect(1);

    this.set('items', ['Ember', 'Paper', 'One', 'Two']);
    this.set('selectedItem', 'Paper');
    await render(hbs`{{#paper-autocomplete
      placeholder="Item"
      options=items
      searchText=searchText
      onSearchTextChange=(action (mut searchText))
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item|
    }}
      {{item}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    assert.notOk(find('.md-autocomplete-suggestions'), 'autocomplete-suggestions list must be closed when selected & focused in');
  });

  test('when has selection and searchText changed, the dropdown is shown with w/o selection', async function(assert) {
    assert.expect(3);

    this.set('items', ['Ember', 'Paper', 'One', 'Two']);
    this.set('selectedItem', 'Paper');
    await render(hbs`{{#paper-autocomplete
      placeholder="Item"
      options=items
      searchText=searchText
      onSearchTextChange=(action (mut searchText))
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item|
    }}
      {{item}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    assert.notOk(find('.md-autocomplete-suggestions'), 'dropdown must be closed when selected & focused in');

    await fillIn('md-autocomplete-wrap input', 'Pape');

    assert.ok(find('.md-autocomplete-suggestions'), 'autocomplete-suggestions list is opened');

    assert.equal(this.get('selectedItem'), undefined, 'selectedItem is undefined');
  });

  test('we can highlight search results for properties that aren\'t text', async function(assert) {
    assert.expect(2);

    this.items = ['1', '2', '3', '4'];
    this.selectedItem = 1;
    await render(hbs`{{#paper-autocomplete
      placeholder="Item"
      options=items
      searchText=searchText
      onSearchTextChange=(action (mut searchText))
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item autocomplete|
    }}
      {{paper-autocomplete-highlight
          label=item
          searchText=autocomplete.searchText
          flags="i"}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    await fillIn('md-autocomplete-wrap input', '1');

    assert.ok(find('.md-autocomplete-suggestions'), 'autocomplete-suggestions list is opened');

    assert.equal(this.get('selectedItem'), undefined, 'selectedItem is undefined');
  });

  test('dropdown can be customized using dropdownClass', async function(assert) {
    assert.expect(1);
    this.items = ['1', '2', '3'];
    await render(hbs`{{#paper-autocomplete
      dropdownClass="custom-dropdown-class"
      placeholder="Item"
      options=items
      selected=selectedItem
      onSelectionChange=(action (mut selectedItem))
      as |item|
    }}
      {{item}}
    {{/paper-autocomplete}}`);

    await settled();

    await focus('md-autocomplete-wrap input');

    assert.ok(find('.md-autocomplete-suggestions-container').classList.contains('custom-dropdown-class'), 'contains custom dropdownClass');
  });
});
