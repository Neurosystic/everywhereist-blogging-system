window.addEventListener("load", function () {

    const userId = document.querySelector("#userId").textContent;
    const authorId = document.querySelector("#authorId").textContent;
    const commenterId = document.querySelector(".commenterId").textContent;
    const replyDiv = document.querySelectorAll(".replyCommands");
    const replyTrigger = document.querySelectorAll(".reply");
    const grandChildrenForm = document.querySelectorAll(".grandchildComment .replyCommands");
    const replyForm = document.querySelectorAll(".replyForm");
    const deleteForm = document.querySelectorAll(".deleteForm");
    const hideBtn = document.querySelector("#hideBtn");
    const comments = document.querySelector(".commentDiv");

    document.querySelector(".commentDiv > .replyCommands .replyForm").style.display = "initial";
    document.querySelector(".commentDiv > .replyCommands .reply").innerText = "Comment on article";

    hideElementArray(grandChildrenForm);

    if (!userId) {
        hideElementArray(replyDiv);
    } else {
        replyTrigger.forEach(function (trigger) {
            trigger.addEventListener("click", function () {
                hideElementArray(replyForm);
                const form = trigger.nextElementSibling;
                form.style.display = "initial";
            });
        });
    }

    function hideElementArray(formArray) {
        formArray.forEach(function (form) {
            form.style.display = "none";
        });
    }

    if (userId == authorId) {
        for (let i = 0; i < deleteForm.length - 1; i++) {
            deleteForm[i].style.display = "initial";
        }
    } else if (commenterId == userId) {
        const commenterDeleteForm = document.querySelectorAll(`.comment${commenterId} > .deleteForm`);
        commenterDeleteForm.forEach(function (form) {
            form.style.display = "initial";
        });
    }

    hideBtn.addEventListener("click", function () {
        if (hideBtn.textContent == "Hide Comments") {
            comments.style.display = "none";
            hideBtn.innerText = "View Comments";
        } else if (hideBtn.textContent == "View Comments"){
            comments.style.display = "initial";
            hideBtn.innerText = "Hide Comments";
        }

    });

});