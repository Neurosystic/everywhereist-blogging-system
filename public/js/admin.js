window.addEventListener("load", function () {

    const main = document.querySelector(".mainContent");
    const userId = document.querySelector("#userId").textContent;
    const analyticTrigger = document.querySelector("#analytics");
    const subscriptTrigger = document.querySelector("#subscriptions");
    const followerTrigger = document.querySelector("#followers");

    async function fetchFollowingList(id) {
        const response = await fetch(`../api/following?userId=${id}`);
        const followingJson = await response.json();
        return followingJson;
    }

    async function fetchFollowerList(id) {
        const response = await fetch(`../api/followers?userId=${id}`);
        const followerJson = await response.json();
        return followerJson;
    }

    analyticTrigger.addEventListener("click", async function () {
        main.innerHTML = "";


    });

    subscriptTrigger.addEventListener("click", async function () {
        main.innerHTML = "";
        const subscriptionList = await fetchFollowingList(userId);
        const subscriptionDiv = document.createElement("div");
        subscriptionDiv.classList.add("subDiv");
        main.append(subscriptionDiv);
        subscriptionList.forEach(function (item) {
            const followingDiv = document.createElement("div");
            followingDiv.classList.add("following");
            subscriptionDiv.append(followingDiv);
            followingDiv.innerHTML = `
                <div class="followingCard">
                    <a href="../user/${item.id}">
                        <h2>${item.username}</h2>
                        <img src="../avatar/${item.avatar}" alt="Author avatar">
                    </a> 
                </div>
                <form method="POST" action="../unsubscribe">
                    <input type="text" name="authorId" value="${item.id}" style="display: none">
                    <input type="submit" value="Unsubscribe">
                </form>
            `;
        });

    });

    followerTrigger.addEventListener("click", async function () {
        main.innerHTML = "";
        const followerList = await fetchFollowerList(userId);
        const subscriptionDiv = document.createElement("div");
        subscriptionDiv.classList.add("subDiv");
        main.append(subscriptionDiv);
        followerList.forEach(function (item) {
            const followerDiv = document.createElement("div");
            followerDiv.classList.add("follower");
            subscriptionDiv.append(followerDiv);
            followerDiv.innerHTML = `
                <div class="followerCard">
                    <a href="../user/${item.id}">
                        <h2>${item.username}</h2>
                        <img src="../avatar/${item.avatar}" alt="Author avatar">
                    </a> 
                </div>
                <form method="POST" action="../removeFollower">
                    <input type="text" name="followerId" value="${item.id}" style="display: none">
                    <input type="submit" value="Remove">
                </form>
            `;
        });

    });

});