window.addEventListener("load", function () {

    const userId = document.querySelector("#userId").textContent;
    const authorId = document.querySelector("#authorId").textContent;
    const replyDiv = document.querySelectorAll(".replyCommands");
    const replyTrigger = document.querySelectorAll(".reply");
    const grandChildrenForm = document.querySelectorAll(".grandchildComment .replyCommands");
    const replyForm = document.querySelectorAll(".replyForm");

    document.querySelector(".commentDiv > .replyCommands .replyForm").style.display = "initial";
    document.querySelector(".commentDiv > .replyCommands .reply").innerText = "Comment on article";

    hideElementArray(grandChildrenForm);

    if (!userId) {
        hideElementArray(replyDiv);
    } else {
        replyTrigger.forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                trigger.innerText = `Reply to`;
                hideElementArray(replyForm);
                const form = trigger.nextElementSibling;
                form.style.display = "initial";
            });
        });
    }

    function hideElementArray(formArray){
        formArray.forEach(function (form) {
            form.style.display = "none";
        });
    }



});