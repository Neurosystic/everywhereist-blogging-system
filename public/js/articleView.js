window.addEventListener("load", async function () {
    // JS implementation of like button when clicked - toggle class??
    const likeBtn = document.querySelector("#likeBtn");

    const likeForm = document.querySelector("#likeForm");
    const unlikeForm = document.querySelector("#unlikeForm");

    const subscribeForm = document.querySelector("#subscribeForm");
    const unsubscribeForm = document.querySelector("#unsubscribeForm");
    const userFollowingList = [];

    if (userId) {
        likeBtn.disabled = false;
        const followingJson = await fetchFollowingList(userId);
        followingJson.forEach(function (item) {
            userFollowingList.push(item.author_id);
        });
    }

    let unmatchCount = 0;
    const likeArray = await fetchArticleLikeCounts(articleId);
    likeArray.forEach(function (element) {
        if (element.user_id == userId) {
            likeForm.style.display = "none";
        } else {
            unmatchCount++;
        }
    });

    if (unmatchCount >= likeArray.length && unlikeForm) {
        unlikeForm.style.display = "none";
    }

    if (authorId == userId) {
        const otherCommandDiv = document.querySelector(".otherCommands");
        otherCommandDiv.innerHTML += `
            <div class="adminCmd">
                <form action="../editArticle" method="GET">
                    <input type="text" name="articleId" value="${articleId}" style="display:none">
                    <input type="submit" value="Edit Article">
                </form>
            </div>
        `;
        document.querySelector(".subscriptionCmd").style.display = "none";
    } else if (userId) {
        if (userFollowingList.includes(parseInt(authorId))) {
            unsubscribeForm.style.display = "initial";
            subscribeForm.style.display = "none";
        } else {
            subscribeForm.style.display = "initial";
            unsubscribeForm.style.display = "none";
        }
    }

    async function fetchArticleLikeCounts(id) {
        const response = await fetch(`../api/articleLikes?articleId=${id}`);
        const likesJson = await response.json();
        return likesJson;
    }

    async function fetchFollowingList(id) {
        const response = await fetch(`../api/following?userId=${id}`);
        const followingJson = await response.json();
        return followingJson;
    }

});