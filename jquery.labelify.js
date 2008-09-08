/**
 * jQuery.labelify - Display in-textbox hints
 * Stuart Langridge, http://www.kryogenix.org/
 * Released into the public domain
 * Date: 25th June 2008
 * @author Stuart Langridge
 * @author Garrett LeSage
 * @version 1.3.3
 *
 *
 * Basic calling syntax: $("input").labelify();
 * Defaults to taking the in-field label from the field's title attribute
 *
 * You can also pass an options object with the following keys:
 *   text
 *     "title" to get the in-field label from the field's title attribute 
 *      (this is the default)
 *     "label" to get the in-field label from the inner text of the field's label
 *      (note that the label must be attached to the field with for="fieldid")
 *     a function which takes one parameter, the input field, and returns
 *      whatever text it likes
 *
 *   labeledClass
 *     a class that will be applied to the input field when it contains the
 *      label and removed when it contains user input. Defaults to blank.
 *  
 */
jQuery.fn.labelify = function(settings) {
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
    el.value = $(el).data("label");
    $(el).addClass(settings.labeledClass);
  };
  hideLabel = function(el){
    el.value = el.defaultValue;
    $(el).removeClass(settings.labeledClass);
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
      if (this.value === this.defaultValue) { showLabel(this); }
    }).data('label',lookup(this).replace(/\n/g,'')); // strip label's newlines
    
    removeValuesOnExit = function() {
      $labelified_elements.each(function(){
        if (this.value === $(this).data("label")) { hideLabel(this); }
      });
    };
    
    $item.parents("form").submit(removeValuesOnExit);
    $(window).unload(removeValuesOnExit);
    
    if (this.value !== this.defaultValue) {
      // user started typing; don't overwrite his/her text!
      return;
    }

    // set the defaults
    showLabel(this);
  });
};
