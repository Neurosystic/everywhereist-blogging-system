window.addEventListener("load", function(){

    const analyticsDiv = document.querySelector(".analytics");

    analyticsDiv.style.display = "initial";

    
    async function fetchFollowingList(id) {
        const response = await fetch(`../api/following?userId=${id}`);
        const followingJson = await response.json();
        return followingJson;
    }

});