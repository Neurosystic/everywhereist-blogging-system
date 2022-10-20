window.addEventListener("load", function () {
  async function fetchAllArticle() {
    const response = await fetch("../api/articles");
    const articlesJson = await response.json();
    return articlesJson;
  }

  async function fetchAllArticleSort(condition, order) {
    const response = await fetch(
      `../api/articles?sort=${condition}&order=${order}`
    );
    const articleJson = await response.json();
    return articleJson;
  }

  const contentDiv = document.querySelector(".articleContents");

  loadAllArticles();

  const sort = document.querySelector("#sort");
  sort.addEventListener("change", async function () {
    const sortOrder = sort.value.split(" ");
    const articleArray = await fetchAllArticleSort(sortOrder[0], sortOrder[1]);
    createArticleCard(articleArray);
  });

  async function loadAllArticles() {
    const articleArray = await fetchAllArticle();
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
    });
  }
});
