export const initSearchModal = () => {
  var modal = document.getElementById("searchModal");
  var btn = document.getElementById("searchModalButton");
  var span = document.getElementsByClassName("close")[0];
  btn.onclick = function () {
    modal.classList.add("show");
  };
  span.onclick = function () {
    modal.classList.remove("show");
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.classList.remove("show");
    }
  };
};
