/*
Template Name: Velzon - Admin & Dashboard Template
Author: Themesbrand
Version: 2.4.0
Website: https://Themesbrand.com/
Contact: Themesbrand@gmail.com
File: Layout Js File
*/

(function () {

    'use strict';

    if (sessionStorage.getItem('defaultAttribute')) {

        var attributesValue = document.documentElement.attributes;
        var CurrentLayoutAttributes = {};
        Object.entries(attributesValue).forEach(function (key) {
            if (key[1] && key[1].nodeName && key[1].nodeName != "undefined") {
                var nodeKey = key[1].nodeName;
                CurrentLayoutAttributes[nodeKey] = key[1].nodeValue;
            }
        });
        if (sessionStorage.getItem('defaultAttribute') !== JSON.stringify(CurrentLayoutAttributes)) {
            sessionStorage.clear();
            window.location.reload();
        } else {
            var isLayoutAttributes = {};
            isLayoutAttributes['data-layout'] = sessionStorage.getItem('data-layout');
            isLayoutAttributes['data-sidebar-size'] = sessionStorage.getItem('data-sidebar-size');
            isLayoutAttributes['data-layout-mode'] = sessionStorage.getItem('data-layout-mode');
            isLayoutAttributes['data-layout-width'] = sessionStorage.getItem('data-layout-width');
            isLayoutAttributes['data-sidebar'] = sessionStorage.getItem('data-sidebar');
            isLayoutAttributes['data-sidebar-image'] = sessionStorage.getItem('data-sidebar-image');
            isLayoutAttributes['data-layout-direction'] = sessionStorage.getItem('data-layout-direction');
            isLayoutAttributes['data-layout-position'] = sessionStorage.getItem('data-layout-position');
            isLayoutAttributes['data-layout-style'] = sessionStorage.getItem('data-layout-style');
            isLayoutAttributes['data-topbar'] = sessionStorage.getItem('data-topbar');
            isLayoutAttributes['data-preloader'] = sessionStorage.getItem('data-preloader');
            isLayoutAttributes['data-body-image'] = sessionStorage.getItem('data-body-image');

            Object.keys(isLayoutAttributes).forEach(function (x) {
                if (isLayoutAttributes[x] && isLayoutAttributes[x]) {
                    document.documentElement.setAttribute(x, isLayoutAttributes[x]);
                }
            });
        }
    }

})();


$(document).ready(function () {
    refreshClientBalance();
});
function refreshClientBalance() {
    $.ajax({
        url: base_url + 'client-balance',
        method: 'POST',
        datatype: 'JSON',
        success: function (response) {
            $('#client_balance').text(response.client_balance);
        },
        error: function (error) {
            console.log(error);
            //window.location.href= 'logout';
        }
    });
}

function updateClientBalance() {
    $.ajax({
        url: base_url + 'updateClientBalance',
        method: "POST",
        datatype: 'JSON',
        success: function (response) {
            if (response.message.includes("Error")) {
                showToast(response.message, 'danger');
            } else {
                showToast(response.message, 'success');
            }
        }, error: function (e) {
            console.log(e);
        }
    })
}

function showToast(text, className) {
    toastData = {};
    Toastify({
        newWindow: true,
        text: text,
        gravity: 'top',
        position: 'right',
        className: "bg-" + className,
        stopOnFocus: true,
        offset: {
            x: toastData.offset ? 50 : 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: toastData.offset ? 10 : 0, // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        duration: 8000,
        close: toastData.close === "close" ? true : false,
        style: toastData.style === "style" ? {
            background: "linear-gradient(to right, #0AB39C, #405189)"
        } : ""
    }).showToast();
}