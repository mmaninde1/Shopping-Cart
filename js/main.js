var num = 1;
var cartArray = [];
var logeedin = false;
var sessionCount = 1;
$(document).ready(function () {

    var code = `<div class="row">`;

    var a = 0;
    for (var i = 0; i < productData.length; i++) {
        code += `<div class="col-md-4" id="product${num}">
        <img src="./images/${productData[i].source}" class="img-fluid">
        <h3 id="pname${num}">${productData[i].name}</h3>
        <p id="pprice${num}">${productData[i].price}</p>
        <button class="btn btn-primary" onclick="addToCart(${num})">Add to Cart</button>
        </div>`;
        a++;
        num++;

        if (a == 3) {
            code += `</div>`;
            a = 0;
            code += `<div class="row">`;
        }
    }

    code += `</div>`;

    $("#allproducts").html(`${code}`);

    if (localStorage.getItem("useremail") != null) {
        for (i = 0; i < UserData.length; i++) {
            let user = UserData[i].email;
            {
                if (localStorage.getItem("useremail") == user) {
                    var k = i;
                    break;
                }
            }
        }

        var code = `<span class="nav-link">${UserData[k].name} | `;
        code += `<a onclick="logout()">Log Out</a></span>`;

        document.getElementById('logoutloginli').innerHTML = code;
        $('#loginModal').modal('hide');

        logeedin = true;

        sessionToCart();
    }

});

function sessionToCart()
{
    let totpr = localStorage.getItem(`totalproducts`);

    sessionCount = localStorage.getItem(`totalproducts`);

    for(e=1;e<totpr;e++)
    {
        let o = e-1;
        cartArray[o] = localStorage.getItem(`prod${e}`);
    }
}

function searchProducts() {
    let searchtext = document.getElementById('searchText').value;
    let finalsearch = searchtext.toUpperCase();
    for (var i = 0; i < productData.length; i++) {
        txtValue = productData[i].name;
        let rand = (i + 1);
        if (txtValue.toUpperCase().indexOf(finalsearch) > -1) {
            document.getElementById(`product${rand}`).style.display = "";
        } else {
            document.getElementById(`product${rand}`).style.display = "none";
        }
    }
}

function cartToSession()
{
    let cartlength = cartArray.length;
    let lastindex = cartlength-1;

    localStorage.setItem(`prod${sessionCount}`,`${cartArray[lastindex]}`);

    sessionCount++;

    localStorage.setItem(`totalproducts`,`${sessionCount}`);
}

function removelastElementFromSession(id)
{
    let tot = localStorage.getItem(`totalproducts`);
    let deletedindex = tot-1

    for(r=1;r<sessionCount;r++)
    {
        if(localStorage.getItem(`prod${r}`) == id)
        {
            localStorage.removeItem(`prod${r}`);

            for(k = r;k<sessionCount;k++)
            {
                if(k < (sessionCount-1))
                {
                    localStorage.setItem(`prod${k}`,localStorage.getItem(`prod${k+1}`));
                }
            }

        }
    }

    sessionCount--;

    localStorage.setItem(`totalproducts`,`${(sessionCount)}`);

    cartRefresh();
}

function addToCart(id) {
    cartArray.push(id);
    cartToSession();
    document.getElementById("countofcart").innerHTML = cartArray.length;
}

function cartRefresh() {
    document.getElementById("countofcart").innerHTML = cartArray.length;
}

function cart() {

    if (logeedin) {
        $('#cartModal').modal('toggle');
        var count = 0;
        var cart = `<span></span>`;
        var cond = true;
        var tempcart = [];
        for (var j = 0; j < cartArray.length; j++) {
            count = 0;
            cond = true;
            tempcart.forEach(element => {
                if (element == cartArray[j]) {
                    cond = false;
                }
            });

            tempcart.push(cartArray[j]);

            if (cond) {
                let i = cartArray[j] - 1;
                cart += `<tr>`;
                cart += `<td>${productData[i].name}</td>`;
                cart += `<td>${productData[i].price}</td>`;
                for (var k = j; k < cartArray.length; k++) {
                    if (cartArray[k] == cartArray[j]) {
                        count++;
                    }
                }
                cart += `<td><button onclick="removeCart(${i})">-</button><span id="coun${i}">${count}</span><button onclick="addMoreToCart(${i})">+</button></td>`
                cart += `</tr>`;
            }

        }
        document.getElementById("carttable").innerHTML = cart;

        cartRefresh();


    }
    else {
        $('#loggedinModal').modal('show');

        setTimeout(function () {
            $('#loggedinModal').modal('hide')
        }, 2000);
    }
}

function removeCart(id) {
    let span = document.getElementById(`coun${id}`);
    let count = parseInt(span.innerHTML);

    count--;
    var rem = id + 1;
    let index = cartArray.indexOf(rem);

    if (index > -1) {
        cartArray.splice(index, 1);
    }

    if (count < 1) {
        let td = event.target.parentNode;
        let tr = td.parentNode;
        tr.parentNode.removeChild(tr);
    }
    else {
        span.innerHTML = count;
    }

    removelastElementFromSession(rem);
    cartRefresh();
}

function addMoreToCart(id) {
    let add = id + 1;
    cartArray.push(add);

    let span = document.getElementById(`coun${id}`);
    let count = parseInt(span.innerHTML);
    count++;

    span.innerHTML = count;
    cartToSession();
    cartRefresh();
}

$(".list-inline-item").click(function () {
    var clickedcat = $(this).html();
    let searchcat = clickedcat.toUpperCase();

    if (searchcat == "ALL") {
        for (var i = 0; i < productData.length; i++) {
            let rand = (i + 1);
            document.getElementById(`product${rand}`).style.display = "";
        }
    }
    else {
        for (var i = 0; i < productData.length; i++) {
            txtValue = productData[i].category;
            let rand = (i + 1);
            if (txtValue.toUpperCase().indexOf(searchcat) > -1) {
                document.getElementById(`product${rand}`).style.display = "";
            } else {
                document.getElementById(`product${rand}`).style.display = "none";
            }
        }
    }

});

function login() {
    let inputUser = document.getElementById('loginemail').value;
    let inputPassword = document.getElementById('loginpass').value;



    for (i = 0; i < UserData.length; i++) {
        let user = UserData[i].email;
        let password = UserData[i].password;

        if (inputUser == user) {
            if (inputPassword == password) {
                var code = `<span class="nav-link">${UserData[i].name} | `;
                code += `<a onclick="logout()">Log Out</a></span>`;

                document.getElementById('logoutloginli').innerHTML = code;
                $('#loginModal').modal('toggle');

                logeedin = true;
                localStorage.setItem("useremail", user);
                break;
            }
            else {
                $('#invalidcredentials').modal('show');

                setTimeout(function () {
                    $('#invalidcredentials').modal('hide')
                }, 2000);
            }
        }
        else {
            $('#invalidcredentials').modal('show');

            setTimeout(function () {
                $('#invalidcredentials').modal('hide')
            }, 2000);
        }
    }
}

function logout() {
    var code = `<a class="nav-link" data-toggle="modal" data-target="#loginModal" href="#">Sign Up | Log In</a>`;

    logeedin = false;
    localStorage.removeItem("useremail");
    clearCart();
    cartSessionClear();
    document.getElementById('logoutloginli').innerHTML = code;
}

function clearCart() {
    cartArray = [];

    if (logeedin) {
        cart();
    }
    cartRefresh();
}

function cartSessionClear()
{
    for(p=0;p<cartArray.length;p++)
    {
        let y = p + 1;
        localStorage.removeItem(`prod${y}`);
    }
    cartRefresh();
}