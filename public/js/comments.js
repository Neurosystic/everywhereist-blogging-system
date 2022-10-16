window.addEventListener("load", function () {

    const commenterIds = document.querySelectorAll(".commenterId");
    const replyDiv = document.querySelectorAll(".replyCommands");
    const replyTrigger = document.querySelectorAll(".reply");
    const grandChildrenCommentForm = document.querySelectorAll(".grandchildComment .commentFormDiv");
    const grandChildrenDeleteForm = document.querySelectorAll(".grandchildComment .deleteForm");
    const replyForm = document.querySelectorAll(".replyForm");
    const deleteForm = document.querySelectorAll(".deleteForm");
    const hideBtn = document.querySelector("#hideBtn");
    const comments = document.querySelector(".commentDiv");

    const articleCommentForm = document.querySelector(".commentDiv > .replyCommands .replyForm");
    if (articleCommentForm) {
        articleCommentForm.style.display = "initial";
        document.querySelector(".commentDiv > .replyCommands .reply").innerText = "Comment on article";
    }

    hideElementArray(grandChildrenCommentForm);

    const commenterArray = [];
    commenterIds.forEach(function (id) {
        commenterArray.push(id.textContent);
    });

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
        grandChildrenDeleteForm.forEach(function (form) {
            form.style.display = "inital";
        });
    } else if (commenterArray.includes(userId)) {
        const commenterDeleteForm = document.querySelectorAll(`.comment${userId} > .deleteForm`);
        commenterDeleteForm.forEach(function (form) {
            form.style.display = "initial";
        });
    }

    hideBtn.addEventListener("click", function () {
        if (hideBtn.textContent == "Hide Comments") {
            comments.style.display = "none";
            hideBtn.innerText = "View Comments";
        } else if (hideBtn.textContent == "View Comments") {
            comments.style.display = "initial";
            hideBtn.innerText = "Hide Comments";
        }

    });

});