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

  async function fetchFollowingList(id) {
    const response = await fetch(`../api/following?userId=${id}`);
    const followingJson = await response.json();
    return followingJson;
  }

  const contentDiv = document.querySelector(".articleContents");

  loadUserArticles(viewingUserId);

  //Implemment statements to allow user to sort article when browsering to author page

  async function loadUserArticles(id) {
    const articleArray = await fetchArticleByAuthor(id);
    createArticleCard(articleArray);
    createTopThreeArticleCard(articleArray.sort(compare));
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
        imgDiv.innerHTML = `
                  <img src="../images/thumbnails/general.jpg" alt="Article cover image"> 
              `;
      }

      itemDiv.innerHTML += `
          <div class="articleDisplay">
              <div class="cardIntro">
                  <a href="../article/${item.id}">
                      <h4 class="articleTitle">${item.title}</h4>
                      <p>Published: ${item.date_published}</p>
                      <div class="articlePreview">
                          <p>${item.content}</p>
                      </div>
                  </a>
              </div>
            </div>
          `;
    });
  }

  const subscribeLink = document.querySelector("#subscribeLink");
  const unsubscribeLink = document.querySelector("#unsubscribeLink");
  const userFollowingList = [];

  if (subscribeLink && unsubscribeLink) {
    const followingJson = await fetchFollowingList(userId);
    followingJson.forEach(function (item) {
      userFollowingList.push(item.author_id);
    });

    if (userFollowingList.includes(parseInt(viewingUserId))) {
      unsubscribeLink.style.display = "initial";
      subscribeLink.style.display = "none";
    } else {
      subscribeLink.style.display = "initial";
      unsubscribeLink.style.display = "none";
    }
  }

  function compare(a, b) {
    console.log("sorted");
    if (a.popularity > b.popularity) {
      return -1;
    } else if (a.popularity < b.popularity) {
      return 1;
    } else {
      return 0;
    }
  }

  function createTopThreeArticleCard(array) {
    const popularDiv = document.querySelector(".threePopular");
    for (let i = 0; i < 3; i++) {
      if (array[i]) {
        let image = "gerneral.jpg";
        if (array[i].image) {
          image = array[i].image;
        }
        popularDiv.innerHTML += `
          <li><div class="cardIntro">
          <div>
              
              <img src="../images/thumbnails/${image}" alt="Article cover image">
          </div>
              <div >
              <a href="../article/${array[i].id}">
                  <h4 class="articleTitle">${array[i].title}</h4>
                  <p>Published: ${array[i].date_published}</p> </a>
                  

              </div>  <div class="articleStats">
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
          </div>

          </li>`;
      }
    }
  }
});
