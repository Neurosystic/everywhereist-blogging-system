window.addEventListener("load", async function () {
  async function fetchArticleByAuthor(id) {
    const response = await fetch(`../api/articles?author=${id}`);
    const articleJson = await response.json();
    return articleJson;
  }

  async function fetchUserArticleSort(id, condition, order) {
    const response = await fetch(
      `../api/articles?author=${id}&sort=${condition}&order=${order}`
    );
    const articleJson = await response.json();
    return articleJson;
  }
  const contentDiv = document.querySelector(".articleContents");

  loadUserArticles();
  fetchTopThreeArticles();

  //Implemment statements to allow user to sort article when browsering to author page

  async function loadUserArticles() {
    const articleArray = await fetchArticleByAuthor(viewingUserId);
    createArticleCard(articleArray);
  }

  function createArticleCard(articleArray) {
    contentDiv.innerHTML = "";
    articleArray.forEach(function (item) {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("card");
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("cardImg");
      contentDiv.append(itemDiv);
      itemDiv.append(imgDiv);
      if (item.image) {
        imgDiv.innerHTML = `
                    <img src="../images/thumbnails/${item.image}" alt="Article cover image">
                `;
      } else {
        //set src of conver image to something that is default if author does not submit an image
        imgDiv.innerHTML = `
                    <img src="../images/thumbnails/general.jpg" alt="Article cover image"> 
                `;
      }

      itemDiv.innerHTML += `
                <div class="cardAuthor">
                    <a href="../user/${item.author_id}">
                        <img src="../avatar/${item.avatar}" alt="Author avatar">
                    </a>
                    <div>
                        <a href="../user/${item.author_id}">
                            <h4>${item.username}</h4>
                        </a>
                        <p>Published: ${item.date_published}</p>
                        <p id="edited">Last edited: ${item.date_edited}</p>
                    </div> 
                </div>
                <div class="cardIntro">
                    <a href="../article/${item.id}">
                        <h4 class="articleTitle">${item.title}</h4>
                        <div class="articlePreview">
                            <p>${item.content}</p>
                        </div>
                    </a>
                </div>
            `;

      const editedDate = document.querySelector("#edited");
      if (!item.date_edited) {
        editedDate.style.display = "none";
      }
    });
  }

  const subscribeForm = document.querySelector("#subscribeForm");
  const unsubscribeForm = document.querySelector("#unsubscribeForm");
  const userFollowingList = [];

  async function fetchFollowingList(id) {
    const response = await fetch(`../api/following?userId=${id}`);
    const followingJson = await response.json();
    return followingJson;
  }

  if (subscribeForm && unsubscribeForm) {
    const followingJson = await fetchFollowingList(userId);
    followingJson.forEach(function (item) {
      userFollowingList.push(item.author_id);
    });

    if (userFollowingList.includes(parseInt(viewingUserId))) {
      unsubscribeForm.style.display = "initial";
      subscribeForm.style.display = "none";
    } else {
      subscribeForm.style.display = "initial";
      unsubscribeForm.style.display = "none";
    }
  }

  const topDiv = document.querySelector(".top3");

  async function fetchArticleLikeCounts(id) {
    const response = await fetch(`../api/articleLikes?articleId=${id}`);
    const likesJson = await response.json();
    return likesJson;
  }

  async function fetchArticleCommentCounts(id) {
    const response = await fetch(`../api/articleComments?articleId=${id}`);
    const commentJson = await response.json();
    return commentJson;
  }

  async function fetchTopThreeArticles() {
    const articleArray = await fetchArticleByAuthor(viewingUserId);
    articleArray.forEach(async function (article) {
      const likeCount = await fetchArticleLikeCounts(article.id);
      article.likeCount = likeCount.length;
      const commentCount = await fetchArticleCommentCounts(article.id);
      article.commentCount = commentCount.length;
      const popularity = commentCount.length * (2 + likeCount.length);
      article.popularity = popularity;
    });

    articleArray.sort(compare);
  }

  function compare(a,b){
      if(a.popularity > b.popularity){
          return 1;
      }else if(a.popularity < b.popularity){
          return -1;
      }else{
          return 0;
      }
  }
  
});
