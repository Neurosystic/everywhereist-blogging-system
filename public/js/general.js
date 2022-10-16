window.addEventListener("load", function () {

    const bell = document.querySelector(".notificationPanel i");
    const notification = document.querySelector(".notification");

    if (bell) {
        bell.addEventListener("click", function () {
            notification.classList.toggle("hide");
        });
    }

    const notificationArray = document.querySelectorAll(".notify");

    notificationArray.forEach(function(item){
        item.addEventListener("click", function(){
           const form = item.querySelector(".readForm");
           form.submit();
        });
    })

});

