window.addEventListener("load", function () {
  const optionsButton = document.querySelectorAll(".option-button");
  const advancedOptionButton = document.querySelectorAll(".adv-option-button");

  const fontSizeRef = document.getElementById("fontSize");
  const writingArea = document.getElementById("text-input");
  const alignButton = document.querySelectorAll(".align");
  const spacingButton = document.querySelectorAll(".spacing");
  const formatButton = document.querySelectorAll(".format");
  const scriptButton = document.querySelectorAll(".script");

  initialiser();

  function initialiser() {
    highlighter(alignButton, true);
    highlighter(spacingButton, true);
    highlighter(formatButton, false);
    highlighter(scriptButton, true);

    for (let i = 1; i <= 10; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.innerHTML = i;
      fontSizeRef.appendChild(option);
    }

    fontSizeRef.value = 3;
  }

  function modifyText(command, deafultUi, value) {
    document.execCommand(command, deafultUi, value);
  }

  optionsButton.forEach(function (button) {
    button.addEventListener("click", function () {
      modifyText(button.id, false, null);
    });
  });

  advancedOptionButton.forEach(function (button) {
    button.addEventListener("change", function () {
      modifyText(button.id, false, button.value);
    });
  });

  function highlighter(className, needsRemoval) {
    className.forEach(function (button) {
      button.addEventListener("click", function () {
        if (needsRemoval) {
          let alreadyActive = false;

          if (button.classList.contains("active")) {
            alreadyActive = true;
          }

          highlighterRemover(className);
          if (!alreadyActive) {
            button.classList.add("active");
          }
        } else {
          button.classList.toggle("active");
        }
      });
    });
  }

  function highlighterRemover(className) {
    className.forEach(function (button) {
      button.classList.remove("active");
    });
  }

  document
    .querySelector("input[type=submit]")
    .addEventListener("click", function () {
      const content = document.querySelector("#content");
      const textInput = document.querySelector("#text-input");
      content.value = textInput.innerHTML;
    });
});
