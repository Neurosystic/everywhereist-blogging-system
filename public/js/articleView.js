// JS implementation of like button when clicked - toggle class??
const likeBtn = document.querySelector(".like");
const regularLike = document.querySelector(".fa-regular");
const solidLike = document.querySelector(".fa-solid");

// retrieve from local cookie - if(cookie){... like button enable}
// register like onto database 
likeBtn.disabled = false;

regularLike.addEventListener('click', () =>{
    regularLike.style.display = 'none';
    solidLike.style.display = 'block';
})
solidLike.addEventListener('click', () =>{
    solidLike.style.display = 'none';
    regularLike.style.display = 'block';
})



//if storing like - to get article id - can use #articleId.textContent