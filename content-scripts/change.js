document.addEventListener("DOMContentLoaded", function () {
  var dropdown = document.getElementById("types");
  browser.storage.sync.get("state").then(
    (res) => {
      const thing = res.state;
      document.getElementById("types").value = thing;
    });
  dropdown.addEventListener("change", function () {
    var selectedOption = dropdown.value;
    browser.storage.sync.set({
      state: selectedOption
    });
  });
});