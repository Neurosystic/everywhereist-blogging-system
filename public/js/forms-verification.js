window.addEventListener("load", async function () {

    const username = document.querySelector("#username");
    const usernameWarning = document.querySelector("#usernameWarning");
    const passwordOne = document.querySelector("#password");
    const passwordTwo = document.querySelector("#verify");
    const passwordWarning = document.querySelector("#passwordWarning");
    const submitBtn = document.querySelector(`input[type="submit"]`);


    async function getAllUsernames() {
        const response = await fetch("./api/users");
        const userJson = await response.json();

        let usernameArray = [];
        userJson.forEach(function (user) {
            usernameArray.push(user.username);
        });

        return usernameArray;
    }

    const usernameArray = await getAllUsernames();

    username.addEventListener("input", function () {
        if (usernameArray.includes(username.value)) {
            username.style.border = "solid red";
            usernameWarning.innerText = `This username already exist, please choose another username`;
        } else {
            username.style.border = null;
            usernameWarning.innerText = "";
        }
    });

    if (passwordOne || passwordTwo) {
        passwordTwo.addEventListener("input", function () {
            if (passwordTwo.value != passwordOne.value) {
                passwordOne.style.border = "solid red";
                passwordTwo.style.border = "solid red";
                passwordWarning.innerText = `Password does not match`;
                submitBtn.disabled = true;
            } else {
                passwordOne.style.border = null;
                passwordTwo.style.border = null;
                passwordWarning.innerText = "";
                submitBtn.disabled = false;
            }
        });
    }


});

