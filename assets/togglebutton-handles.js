'use strict';
const Btns = document.querySelectorAll('.js-container-target');
// Listen for demo button clicks
Array.prototype.forEach.call(Btns, function (btn) {
  btn.addEventListener('click', function (event) {
    event.target.parentElement.classList.toggle('is-open');
  });
  btn.click();
});
