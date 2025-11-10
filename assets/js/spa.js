function sparedirect(uripath, e) {
    e.preventDefault();
    $.ajax({
        type: 'GET',
        url: base_url + uripath,
        dataType: 'html',
        beforeSend: function () {
            $("#preloader").css({ "opacity": "1", "visibility": "visible" });
        },
        success: function (response) {
            closeActiveMenu();
            $('#spa').empty();
            $('#spa').html(response);
            $("#preloader").css({ "opacity": "0", "visibility": "hidden" });
            history.pushState(null, null, base_url + uripath);
            initActiveMenu(uripath);
            init();//qikinkapp.js file
        },
        error: function (xhr, status, error) {
            $("#preloader").css({ "opacity": "0", "visibility": "hidden" });
            console.error(error);
        }
    });
}
window.addEventListener('popstate', function (event) {
    location.reload();
});

function initActiveMenu(currentPath) {
    if (currentPath) {
        // navbar-nav
        var a = document.getElementById("navbar-nav").querySelector('[href="' + currentPath + '"]');
        if (a) {
            a.classList.add("active");
            var parentCollapseDiv = a.closest(".collapse.menu-dropdown");
            if (parentCollapseDiv) {
                parentCollapseDiv.classList.add("show");
                parentCollapseDiv.parentElement.children[0].classList.add("active");
                parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
                if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                    parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                    if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                        parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");

                    if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse.menu-dropdown")) {
                        parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").classList.add("show");
                        if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling) {

                            parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
                            if ((document.documentElement.getAttribute("data-layout") == "horizontal") && parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse")) {
                                parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.add("active")
                            }
                        }
                    }
                }
            }
        }
    }
}

function closeActiveMenu() {
    var pathParts = location.pathname.split('/').filter(function(part) {
        return part !== ''; // Filter out empty parts
    });
    
    var currentPath = pathParts.length >= 2 ? pathParts.slice(-2).join('/') : location.pathname.replace('/', '');
    var a = document.getElementById("navbar-nav").querySelector('[href="' + currentPath + '"]');
    if (a) {
        a.classList.remove("active");
        var parentCollapseDiv = a.closest(".collapse.menu-dropdown");
        if (parentCollapseDiv) {
            parentCollapseDiv.classList.remove("show");
            parentCollapseDiv.parentElement.children[0].classList.remove("active");
            parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "false");
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.remove("show");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.remove("active");

                if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse.menu-dropdown")) {
                    parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").classList.remove("show");
                    if (parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling) {

                        parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.remove("active");
                        if ((document.documentElement.getAttribute("data-layout") == "horizontal") && parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse")) {
                            parentCollapseDiv.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(".collapse").previousElementSibling.classList.remove("active")
                        }
                    }
                }
            }
        }
    }
}