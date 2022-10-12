window.addEventListener("load", function () {

    const optionsButton = document.querySelectorAll(".option-button");
    const advancedOptionButton = document.querySelectorAll(".adv-option-button");

    const fontName = document.getElementById("fontName");
    const fontSizeRef = document.getElementById("fontSize");
    const writingArea = document.getElementById("text-input");

    const linkButton = document.getElementById("createLink");
    const alignButton = document.querySelectorAll(".align");
    const spacingButton = document.querySelectorAll(".spacing");
    const formatButton = document.querySelectorAll(".format");
    const scriptButton = document.querySelectorAll(".script");
    const headingButton = document.querySelector(".heading-button")

    //Lists of fontlist
    let fontList = [
        "Arial",
        "Verdana",
        "Times New Roman",
        "Garamond",
        "Georgia",
        "Courier New",
        "cursive"
    ];

    window.onload = initialiser();

    //Initial Settings 
    function initialiser() {
        //function calls for highlighting buttons
        //no highlights for link, unlink, lists, undo, redo since tyhey are one time operations 
        highlighter(alignButton, true);
        highlighter(spacingButton, true);
        highlighter(formatButton, false);
        highlighter(scriptButton, true);

        //create options for font names 
        fontList.map(function (value) {
            const option = document.createElement("option");
            option.value = value;
            option.innerHTML = value;
            fontName.appendChild(option);
        });

        //fontSize allows only till 10
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.innerHTML = i;
            fontSizeRef.appendChild(option);
        }

        //default size
        fontSizeRef.value = 3;
    };

    //main logic
    function modifyText(command, deafultUi, value) {
        //execCommand executes command on selected text 
        document.execCommand(command, deafultUi, value);
    };

    //for basic operations which dont need value parameter
    optionsButton.forEach(function (button) {
        button.addEventListener("click", function () {
            modifyText(button.id, false, null);
        });
    });

    //options that require value parameter (e.g. colors, fonts)
    advancedOptionButton.forEach(function (button) {
        button.addEventListener("change", function () {
            modifyText(button.id, false, button.value);
        });
    });

    headingButton.addEventListener("change", function(){
        modifyText(headingButton.id, false, headingButton.value);
    });

    //link 
    linkButton.addEventListener("click", function () {
        let userLink = prompt("Enter a URL");
        //if link has http then pass directly else add https
        if (/http/i.test(userLink)) {
            modifyText(linkButton.id, false, userLink);
        } else {
            userLink = "http://" + userLink;
            modifyText(linkButton.id, false, userLink);
        }
    });

    //Highlight clicked button 
    function highlighter(className, needsRemoval) {
        className.forEach(function (button) {
            button.addEventListener("click", function () {
                //needsRemoval = true means only one button should be highlight and other would be normal
                if (needsRemoval) {
                    let alreadyActive = false;

                    //if currently clicked button is already active
                    if (button.classList.contains("active")) {
                        alreadyActive = true;
                    }

                    //remove highlight from other buttons
                    highlighterRemover(className);
                    if (!alreadyActive) {
                        //highlight clicked button
                        button.classList.add("active");
                    }
                } else {
                    //if other buttons can be highlighted
                    button.classList.toggle("active");
                }
            });
        });
    };

    function highlighterRemover(className) {
        className.forEach(function (button) {
            button.classList.remove("active");
        });
    };


    //testing content
    document.getElementById("submit").addEventListener("click", function () {
        console.log(writingArea);
    });

});
