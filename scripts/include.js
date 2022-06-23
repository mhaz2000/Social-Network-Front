function includeHTML() {
    var z, i, element, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        element = z[i];
        file = element.getAttribute("include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) { element.innerHTML = this.responseText; }
                    if (this.status == 404) { element.innerHTML = "Page not found."; }
                    element.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
    let icon = document.querySelector(".icon");
    let menu = document.querySelector(".top-header");

    icon.addEventListener("click", function() {
        if (icon.classList.contains("fa-bars")) {
            menu.style.left = 0;
            icon.classList = "fa fa-times";
        } else {
            menu.style.left = "-250px";
            icon.classList = "fa fa-bars";
        }
    })
}