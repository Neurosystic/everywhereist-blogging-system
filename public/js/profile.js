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
  await fetchTopThreeArticles();

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

//   async function fetchTopThreeArticles() {
//     const articleArray = await fetchArticleByAuthor(viewingUserId);
//     articleArray.forEach(async function (article) {
//       const likeArray = await fetchArticleLikeCounts(article.id);
//       article.likeCount = likeArray.length;
//       const commentArray = await fetchArticleCommentCounts(article.id);
//       article.commentCount = commentArray.length;
//       const popularity = commentArray.length + (2 * likeArray.length);
//       article.popularity = popularity;
//     });

    articleArray.sort(compare);

    const topDiv = document.querySelector(".top3");
    for (let i = 0; i < 3; i++) {
        if(articleArray[i]){
            let image = 'gerneral.jpg';
            if(articleArray[i].image){
                image = articleArray[i].image;
            }
            createTopThreeCard(topDiv, articleArray[i], image);
        }

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

    function createTopThreeCard(topDiv, item, image){
      for (let i = 0; i < 3; i++) {
            
            console.log(item.likeCount);
            topDiv.innerHTML += `
    
        <div class="cardIntro">
            <a href="../article/${item.id}">
            <img src="../images/thumbnails/${image}" alt="Article cover image">
                <h4 class="articleTitle">${item.title}</h4>
                <p>Published: ${array[i].date_published}</p>
                <div class="articleStats">
                <div class="popularity">
                    <i class="fa-solid fa-fire"></i>
                    <p>Popularity score: <span>${array[i].popularity}</span></p>
                </div>
                <div class="likeCount">
                    <i class="fa-solid fa-heart"></i>
                    <p>Total likes: <span>${array[i].likeCount}</span></p>
                </div>
                <div class="commentCount">
                    <i class="fa-solid fa-comment"></i>
                    <p>Total comments: <span>${array[i].commentCount}</span></p>
                </div>
            </div>
            </a>
        </div>
            `;
          }
          
      }
  }

});
