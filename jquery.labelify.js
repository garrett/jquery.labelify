/**
 * jQuery.labelify - Display in-textbox hints
 * Stuart Langridge, http://www.kryogenix.org/
 * Released into the public domain
 * Date: 25 June 2008
 * Last update: 08 September 2008
 * @author Stuart Langridge
 * @author Garrett LeSage
 * @version 2.0
 */

/**
 * Defaults to taking the in-field label from the field's title attribute
 * @example $("input").labelify();
 * @param {object|string} [settings] optional parameters to pass
 * @config {string} [text] "title" to use the field's title attribute (default),
 *                         "label" to use its <label> (for="fieldid" must be specified)
 * @config {string} [labeledClass] class applied to the field when it has label text
 *
 * @example $('input').labelify('hasLabel'); // return true if the field has a label
 */
jQuery.fn.labelify = function(settings) {
  // if the element has a label, return true when 'hasLabel' is passed as an arg
  if (typeof settings === 'string' && settings === 'hasLabel') {
    return $(this).data('hasLabel');
  }

  settings = jQuery.extend({
    text: 'title',
    labeledClass: ''
  }, settings);

  // Compatibility with version 1.3 and prior (double-ls)
  if (settings.labelledClass) { settings.labeledClass = settings.labelledClass; }

  var showLabel, hideLabel,
      lookups, lookup,
      $labelified_elements;

  lookups = {
    title: function(input) {
      return $(input).attr('title');
    },
    label: function(input) {
      return $("label[for=" + input.id +"]").text();
    }
  };

  $labelified_elements = $(this);

  showLabel = function(el){
    $(el).data('value', el.value);
    el.value = $(el).data("label");
    $(el).addClass(settings.labeledClass).data('hasLabel', true);
  };
  hideLabel = function(el){
    el.value = $(el).data('value');
    $(el).removeClass(settings.labeledClass).data('hasLabel', false);
  };

  return $(this).each(function() {
    var $item = $(this),
        removeValuesOnExit;

    if (typeof settings.text === 'string') {
      lookup = lookups[settings.text]; // what if not there?
    } else {
      lookup = settings.text; // what if not a fn?
    }

    // bail if lookup isn't a function or if it returns undefined
    if (typeof lookup !== "function" || !lookup(this)) { return; }

    $item.bind('focus.label',function() {
      if (this.value === $(this).data("label")) { hideLabel(this); }
    }).bind('blur.label',function(){
      if (this.value == '') { showLabel(this); }
    });
    $item.data('label', lookup(this).replace(/\n/g,'')) // strip label's newlines
    $item.data('value', this.value); // initialise remembered value
    
    removeValuesOnExit = function() {
      $labelified_elements.each(function(){
        if (this.value === $(this).data("label")) { hideLabel(this); }
      });
    };
    
    $item.parents("form").submit(removeValuesOnExit);
    $(window).unload(removeValuesOnExit);
    
    if (this.value !== this.defaultValue || this.defaultValue != '') {
      // user already started typing; don't overwrite their work!
      // also, if a value is already set in the field, don't replace it
      // with a label
      return;
    }

    // set the defaults
    showLabel(this);
  });
};
