export const initSearchModal = () => {
  var modal = document.getElementById("searchModal");

  // Get the button that opens the modal
  var btn = document.getElementById("searchModalButton");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.classList.add("show");
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.classList.remove("show");
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.classList.remove("show");
    }
  };
};
