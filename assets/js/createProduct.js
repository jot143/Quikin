// Here We Set the Create product Value Is 3
// So That in mockups page we will know where the requestes come from
// We use this as a pageType.
// $(document).ready(function() {
//     // Function to get URL parameter
//     function getUrlParameter(name) {
//         name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
//         var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
//         var results = regex.exec(location.search);
//         return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
//     }

//     // Check for collection_id parameter
//     var collectionId = getUrlParameter('collection_id');
//     if (collectionId) {
//       //  $("#"+collectionId).addClass("selected");
//      //   selectCategory($("#"+collectionId));

//     }
// });

window.isCreateProduct = 3;
var isCreateProduct = window.isCreateProduct;

// For selecting Category CARDS
function selectCategory(card) {

    if ($(card).hasClass('selected')) {

        cardId = $(card).attr('id');
        $(card).removeClass('selected');

        $('#Continue').css({opacity: 0.5});
        if ([1, 3, 4, 5,6].includes(parseInt(cardId))) {
            $(".available_sizes_menu").removeClass("d-none");
        } else {
            $(".available_sizes_menu").addClass("d-none");
        }
        getProductsTab(cardId);
        $('#create_product_tab').tab('show');
    } else {

        $('.card').not(card).removeClass('selected');
        $(card).addClass('selected');
        $('#Continue').css({opacity: 0.9});

        if (window.innerWidth < 700) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }
}

// For Click the Continue Button
function Continue() {

    console.log("sssssssssssssss")

    if (!$(this).attr('data-currenttab')) {
        // return;
    }

    var activeTab = $('.nav-link-for-tab.active');

    if (activeTab.attr('id') === 'create_product_tab') {
        if (window.isPageIsMockup === true) {
            window.isPageIsMockup = false;
        }

        $('.create-product-search-div').addClass('d-none');
        celement = $('.create_product_cards .card[data-mockup-id="' + window.selected_mockup_product_id + '"]');
        selectCard(celement);
        //  editProductNew(window.selected_mockup_product_id);

    } else if (activeTab.attr('id') === 'mockup_design') {
    } else if (activeTab.attr('id') === 'categories_tab') {
        cardId = $('#selectCategoryContainer .card.selected').attr('id');

        if (cardId == 'undefined' || !cardId) {
            showToast("Please Select Category. ", 'danger', 3000);
            return;
        }
        getProductsTab(cardId);
        $('#create_product_tab').tab('show');
    }

    if (activeTab.attr('id') == 'mockup_design_tab') {
        $('#place_order').click();
    }

}

$(document).ready(function () {
    // For Save Product in Topbar - By default its attribut is empty
    $('#Continue').attr('data-current-page', '');

    $('#create_product_tab').addClass('disabled');
    $('#categories_tab').addClass('disabled');
    $('#mockup_design_tab').addClass('disabled');
    $('.editButton').hide();

    window.is_create_product = true;
    window.selected_mockup_product_id = null;

    // For Double Click To Select The Category To View All The Products
    let lastClickTime = 0;
    $(document).on('click', '.categories .card', function () {
        const now = Date.now();
        if (now - lastClickTime < 300) {
            selectCategory(this);
            // $('#Continue').click();
        }
        lastClickTime = now;
    });

    function adjustModalHeight() {
        var totalHeight = 0;
        $('.modal-body img').each(function () {
            totalHeight += $(this).outerHeight(true);
        });
        totalHeight += 20;
        $('.modal-content').css('height', totalHeight);
    }

    $('#fullscreenModal').on('shown.bs.modal', function () {
        adjustModalHeight();
    });

    // Ensure the backdrop is removed when the modal is hidden
    $('#fullscreenModal').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });

    // Optional: Reset or clear modal content if needed when showing
    $('#fullscreenModal').on('show.bs.modal', function () {
        $('.modal-backdrop').remove();
    });

    // For Click Back Button
    $('#back-button').on('click', function () {
        var activeTab = $('.nav-link-for-tab.active');

        if (activeTab.attr('id') === 'create_product_tab') {
            $('#categories_tab').tab('show');
            $('.editButton').hide();
            $('.create_product_cards .card').removeClass('selected');
            window.selected_mockup_product_id = null;
            $('#Continue').text('Continue');
        }

        if (activeTab.attr('id') === 'mockup_design_tab') {
            Swal.fire({
                title: 'Are you sure?',
                text: 'It will clear your design!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Go Back!',
                cancelButtonText: 'No, Stay Here',
                customClass: {
                    popup: 'small-swal-popup',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    // $('#create_product_tab').tab('show');
                    // $('.editButton').hide();

                    location.reload(); // or use window.location.reload();

                    // setTimeout(() => {
                    //     window.location.href = window.location.pathname + '?category_id=' + window.category_id; 
                    // }, 500);

                }
            });
            window.selected_mockup_product_id = null;
            $('#Continue').text('Continue');
        }
    });

    $('.all_products_by_category').on('click', '.create_product_cards', function () {
        const $this = $(this);

        const $selectedCard = $('.create_product_cards .card.selected');
        if ($selectedCard.length) {
            $selectedCard.removeClass('selected');
            $selectedCard.find('.editButton').hide();
        }

        if ($this.find('.card').hasClass('selected')) {
            return;
        }

        $this.find('.card').addClass('selected');
        $this.find('.editButton').show();
        const $card = $this.find('.card');

        window.selected_mockup_product_id = $card.data('mockup-id');

        $('#Continue').css({opacity: 0.9});
    }
    );

    $('#create_product_tab').on('shown.bs.tab', function (e) {});

    let lastClickTimes = 0;
    $(document).on('click', '.create_product_cards .card', function (e) {
        const now = Date.now();
        if (now - lastClickTimes < 300) {
            selectCard(this);
        }
        lastClickTimes = now;

        // Prevent any single click action here if needed
        e.preventDefault();
    });
});

function getProductsTab(id) {
    $('.all_products_by_category').html('');
    $.ajax({
        url: baseUrl + 'products/fetch_products_by_category',
        type: 'POST',
        data: {category_id: id},
        dataType: 'json',
        success: function (response) {
            // initFpd
            // initFpdQikink("../assets/admin/mockups/2/2.json?v=2","test");
            // console.log(response);
            if (response.status == true) {
                populateImageToProducts(response.data);
                $('.editButton').hide();
            } else {
                showToast(
                        'Something Wrong while fetching products for this category.',
                        'danger',
                        3500
                        );
            }
        },
        error: function () {
            showToast('Error retrieving the image.', 'danger', 3000);
            console.log('Error retrieving the image.');
        },
    });
}



// For Display all the list of Products According to the Category 
function populateImageToProducts(productData) {
    const productContainer = document.querySelector('.all_products_by_category');
    productContainer.innerHTML = '';

    Object.values(productData).forEach((product) => {
        const productCard = `
            <div class="col-lg-3 col-md-4 col-sm-6 col-6 create_product_cards">
                <div class="card" data-mockup-id="${product.mockup_id}">
                    <input type="hidden" class='mockup_id' value="${product.mockup_id}"/>
                    <img src="${product.image_url}" class="card-img-top img-fluid" alt="${product.product_title}" />
                    <div class="card-body">
          
                        <p class="card-text text-center fixed-title mb-0" style="color:#044785; font-weight: bold; font-size:14px;">
                            ${product.product_title}
                        </p>
                        <p class="card-text text-center" style="font-size:14px;">
                            Starts From &#8377; ${product.base_price}
                        </p>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}

// For Select Product Card to Edit in the Mockup
function selectCard(card) {
    var mockupId = $(card).find('.mockup_id').val();
    var mockupTitle = $(card)
            .find('button[data-mockup-title]')
            .data('mockup-title');

    // console.log('Selected Card Mockup ID:', mockupId);
    // console.log('Selected Card Mockup Title:', mockupTitle);

    window.selected_mockup_product_id = mockupId;
    window.selected_mockup_product_title = mockupTitle;

    if (typeof editProductNew === 'function') {

        $('.create-product-search-div').addClass('d-none');
        //Create Product with No Iframe
        editProductNew(mockupId);
    }
}

// For Select to Edit the Mockup Product
// function editProduct(element) {
//     if (typeof editProductNew === "function") {
//         //Create Product with No Iframe
//         editProductNew(element);
//     } else {
//         var source = $('#source').val();
//         var mockupId = $(element).data('mockup-id');
//         var mockupTitle = $(element).data('mockup-title');
//         if (source == 'create_order') {
//             $('#mockup_design_tab').tab('show');
//             $('#mockup_desgin_frame').attr('src', `${baseUrl}/mockup-generator-client?id=${mockupId}&title=${mockupTitle}`);
//             const tabSwitchContainer = $(".tab-switch-container");
//             tabSwitchContainer.hide();
//         } else {
//             $('#Continue').text('Save Product');
//             $('#Continue').attr('data-current-page', 'mockup-create');
//             console.log('Selected Mockup ID:', mockupId);
//             $('#mockup_design_tab').tab('show');
//             $('#mockup_desgin_frame').attr('src', `${baseUrl}/mockup-generator-client?id=${mockupId}&title=${mockupTitle}&isCreateProduct=${isCreateProduct}`);
//         }
//     }
//}
