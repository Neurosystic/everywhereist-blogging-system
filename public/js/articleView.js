window.addEventListener("load", async function () {
    // JS implementation of like button when clicked - toggle class??
    const likeBtn = document.querySelector("#likeBtn");

    const likeLink = document.querySelector("#likeLink");
    const unlikeLink = document.querySelector("#unlikeLink");

    const subscribeLink = document.querySelector("#subscribeLink");
    const unsubscribeLink = document.querySelector("#unsubscribeLink");
    const userFollowingList = [];

    if (userId) {
        const followingJson = await fetchFollowingList(userId);
        followingJson.forEach(function (item) {
            userFollowingList.push(item.author_id);
        });
    }

    let unmatchCount = 0;
    const likeArray = await fetchArticleLikeCounts(articleId);
    likeArray.forEach(function (element) {
        if (element.user_id == userId) {
            likeLink.style.display = "none";
        } else {
            unmatchCount++;
        }
    });

    if (unmatchCount >= likeArray.length && unlikeLink) {
        unlikeLink.style.display = "none";
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
            unsubscribeLink.style.display = "initial";
            subscribeLink.style.display = "none";
        } else {
            subscribeLink.style.display = "initial";
            unsubscribeLink.style.display = "none";
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