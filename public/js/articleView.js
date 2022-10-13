window.addEventListener("load", async function () {
    // JS implementation of like button when clicked - toggle class??
    const likeBtn = document.querySelector("#likeBtn");
    const heartIcon = document.querySelector("#heartIcon");
    const likeCount = document.querySelector("#likeCount");

    const likeForm = document.querySelector("#likeForm");
    const unlikeForm = document.querySelector("#unlikeForm");

    const authorId = document.querySelector("#authorId").textContent;
    const userId = document.querySelector("#userId").textContent;
    const articleId = document.querySelector("#articleId").textContent;

    if(userId){
        likeBtn.disabled = false;
    }

    let unmatchCount = 0;
    const likeArray = await fetchArticleLikeCounts(articleId);
    likeCount.innerText = `${likeArray.length}`;
    likeArray.forEach(function(element){
        if(element.user_id == userId){
            likeForm.style.display = "none";
        } else {
            unmatchCount++;
        }
    });

    if(unmatchCount >= likeArray.length && unlikeForm){
        unlikeForm.style.display = "none";
    }

    if(authorId == userId){
        const otherCommandDiv = document.querySelector(".otherCommands");
        otherCommandDiv.innerHTML += `
            <div class="adminCmd">
                <form action="../editArticle" method="GET">
                    <input type="text" name="articleId" value="${articleId}" style="display:none">
                    <input type="submit" value="Edit Article">
                </form>
            </div>
        `;
    }

    async function fetchArticleLikeCounts(id){
        const response = await fetch(`../api/articleLikes?articleId=${id}`);
        const likesJson = await response.json();
        return likesJson;
    }
});