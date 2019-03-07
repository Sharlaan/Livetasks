/* eslint-disable brace-style */
'use strict'

/**
 * Helper function to build an element
 *
 * @param {string} type - DOM type of the element
 * @param {Object} props - properties for the element
 * @param {DomElements} children - children appended inside the element
 *
 * @return {DomElement} the produced element
 */
function createElement (type, props, ...children) {
  let element = document.createElement(type)
  for (let [propName, propValue] of Object.entries(props)) {
    /* props[propName] must be ArrayOf(Array()) */
    if (typeof element[propName] === 'function') {
      for (let functionArguments of propValue) {
        // Element.prototype[propName].apply(element, ...functionArguments)
        element[propName](...functionArguments)
      }
    } else if (propName === 'classList') {
      /* propValue must be ObjectOf({add: [], remove: [], toggle: []}) */
      for (let [verb, classes] of Object.entries(propValue)) {
        // verb = add | remove | toggle
        if (classes) element.classList[verb](...classes)
      }
    } else if (propName === 'dataset') {
      /* propValue must be ObjectOf({customProp: value}) */
      for (let [customProp, value] of Object.entries(propValue)) {
        element.dataset[customProp] = value
      }
    } else element[propName] = propValue
  }
  for (let child of children) {
    element.appendChild(child)
  }
  return element
}
