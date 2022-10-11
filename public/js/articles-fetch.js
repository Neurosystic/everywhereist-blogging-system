window.addEventListener("load", function(){

    async function fetchAllArticle(){
        const response = await fetch("../api/articles");
        const articlesJson = await response.json();
        return articlesJson;
    }

    async function fetchArticleByAuthor(id){
        const response = await fetch(`../api/articles?author=${id}`);
        const articleJson = await response.json();
        return articleJson;
    }

    async function fetchUserArticleSort(id, condition, order){
        const response = await fetch(`../api/articles?author=${id}&sort=${condition}&order=${order}`);
        const articleJson = await response.json();
        return articleJson;
    }

    async function fetchAllArticleSort(condition, order){
        const response = await fetch(`../api/articles?sort=${condition}&order=${order}`);
        const articleJson = await response.json();
        return articleJson;
    }

    const userId = document.querySelector("#userId");

    if(userId){
        loadUserArticles(userId.textContent);
    } else {
        loadAllArticles();
    }

    async function loadUserArticles(id){
        const articlesDiv = document.querySelector(".articles");
        const articleArray = await fetchArticleByAuthor(id);
        console.log(articleArray)
        articleArray.forEach(function(item){
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("card");
            articlesDiv.append(itemDiv);
            itemDiv.innerHTML = `
                <div class=cardImg><img src="${item.image}" alt="Article cover image">`;
        });
    }

    async function loadAllArticles(){
        const articlesDiv = document.querySelector(".articles");
        const articleArray = await fetchAllArticle();
        console.log(articleArray)
        articleArray.forEach(function(item){
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("card");
            articlesDiv.append(itemDiv);
            itemDiv.innerHTML = `
                <div class=cardImg><img src="${item.image}" alt="Article cover image">`;
        });
    }

});