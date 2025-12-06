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
            $('#spa').empty();
            $('#spa').html(response);
            $("#preloader").css({ "opacity": "0", "visibility": "hidden" });
            history.pushState(null, null, base_url + uripath);
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

