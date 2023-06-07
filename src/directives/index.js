export const imagerror = {
  inserted(dom, option) {
    dom.onerror = function() {
      dom.src = option.value
    }
  }
}
