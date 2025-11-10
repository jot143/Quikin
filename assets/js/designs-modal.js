function makeRopeFront() {
    rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope2');
    rope_obj1 = yourDesigner.currentViewInstance.getElementByTitle('rope');
    if (rope_obj) {
        tParam = {topped: 1};
        yourDesigner.setElementParameters(tParam, rope_obj);

        canvas = yourDesigner.currentViewInstance.fCanv;
        //     canvas.moveTo(rope_obj1, canvas.getObjects().length - 1);
        //     canvas.moveTo(rope_obj, canvas.getObjects().length - 1);
        canvas.bringToFront(rope_obj1);
        canvas.bringToFront(rope_obj);

        canvas.renderAll(); // Re-render the canvas
    }
}

window.do_not_reset_designId = false;
function changeTshirtColor(hex, id, from = '') {

    shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
    $('.swiper-slide img').css('background-color', hex);
    let elementSources = window.ShirtElementSources;

    let elementSourcesJSON = JSON.parse(elementSources);

    let vindex = yourDesigner.currentViewIndex;

    // elementSourcesJSON[vindex].parameters.fill = hex;

    sourceToCheck = 'source' + id;
    ropeSourceToCheck = 'sourceRope' + id;
    defaultropeSourceToCheck = 'defaultSourceRope';
    if (typeof elementSourcesJSON[vindex][sourceToCheck] !== 'undefined') {
        /*
         * Change rope too
         */
        rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope');

        product_arr = yourDesigner.getProduct();
        rparams = setupRopeParams(product_arr[vindex], 'rope');
        if (rope_obj && rparams) {
            if (yourDesigner.currentViewInstance.title !== 'Back') {
                rparams.fill = hex;
            } else {
                rparams.fill = hex;
            }
            rparams.colorLinkGroup = false;
            rparams.topped = 1;
            yourDesigner.setElementParameters(rparams, rope_obj);
        }
        shadowObj =
                yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
        if (
                shadowObj &&
                typeof elementSourcesJSON[vindex]['noShadowForSourceAvlColors'] !==
                'undefined' &&
                elementSourcesJSON[vindex]['noShadowForSourceAvlColors']
                ) {
            rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
            rparams.opacity = 0;
            if (rparams) {
                yourDesigner.setElementParameters(rparams, shadowObj);
            }
        }

        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        newSource = elementSourcesJSON[vindex][sourceToCheck];

        elementSourcesJSON[vindex].parameters.topped = 0;
        elementSourcesJSON[vindex].parameters.fill = false;
        elementSourcesJSON[vindex].parameters.replace = true;
        yourDesigner.addElement(
                'image',
                newSource,
                'Shirt',
                elementSourcesJSON[vindex].parameters
                );
    } else {
        rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope');
        product_arr = yourDesigner.getProduct();

        shadowObj =
                yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
        if (
                shadowObj &&
                typeof elementSourcesJSON[vindex]['noShadowForSourceAvlColors'] !==
                'undefined' &&
                elementSourcesJSON[vindex]['noShadowForSourceAvlColors']
                ) {
            rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
            rparams.opacity = 1;
           // rparams.z = 9999;

            yourDesigner.setElementParameters(rparams, shadowObj);
        }
        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');

        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        newSource = elementSourcesJSON[vindex].source;

        /*
         * Check if size based shirt image is uploaded
         */
        sizeId = $('#ord_size').val();
        sourceToCheck = 'sourcesize' + sizeId;
        if (typeof elementSourcesJSON[vindex][sourceToCheck] !== 'undefined') {
            newSource = elementSourcesJSON[vindex][sourceToCheck];
            // console.log('newSourceis overwritten');
        }
        /*
         * end check
         */

        //   elementSourcesJSON[vindex].parameters.z=parseInt(-88);
        //newShirt = yourDesigner.currentViewInstance.addElement("image", newSource, "Shirt", elementSourcesJSON[vindex]);
        elementSourcesJSON[vindex].parameters.topped = 0;
        elementSourcesJSON[vindex].parameters.fill = hex;
        yourDesigner.addElement(
                'image',
                newSource,
                'Shirt',
                elementSourcesJSON[vindex].parameters
                );

        //   console.log("This is new element params");
        //   console.log(elementSourcesJSON[vindex].parameters);

        rparams = setupRopeParams(product_arr[vindex]);
        if (rope_obj) {
            rparams.colorLinkGroup = 'shirtGroup';
            rparams.fill = false;
            rparams.topped = 1;
            yourDesigner.setElementParameters(rparams, rope_obj);
        }

        if (typeof window.acc_mockup !== 'undefined' && window.acc_mockup) {
            tParam = {fill: hex};
        } else {
            tParam = {fill: hex, topped: 1};
        }

        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');

        if (typeof shirt_obj !== 'undefined') {
            yourDesigner.setElementParameters(tParam, shirt_obj);
        }
        /*
         * Added for accomodating frame posters and pathches which has shadow images for specific sizes
         */
         shadowObj =
        yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
                if (
                shadowObj &&
                typeof elementSourcesJSON[vindex]['noShadowForSourceAvlColors'] !==
                'undefined' &&
                elementSourcesJSON[vindex]['noShadowForSourceAvlColors']
                ) {
            rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
            rparams.opacity = 1;
            rparams.z = 9999;
             rparams.topped = 1;
            yourDesigner.setElementParameters(rparams, shadowObj);
        }
        
        
        if (typeof window.shadowElementSources !== 'undefined') {
            elementSourcesJSON = JSON.parse(window.shadowElementSources);
            vindex = yourDesigner.currentViewIndex;

            sizeId = $('#ord_size').val();
            sourceToCheck = 'sourcesize' + sizeId;

            if (
                    typeof elementSourcesJSON[vindex] !== "undefined" && typeof elementSourcesJSON[vindex][sourceToCheck] !==
                    'undefined' &&
                    elementSourcesJSON[vindex][sourceToCheck] &&
                    elementSourcesJSON[vindex][sourceToCheck] !== '{}'
                    ) {
                shirt_obj =
                        yourDesigner.currentViewInstance.getElementByTitle('Shirt');

                if (typeof shirt_obj !== 'undefined') {
                    // console.log('settinga');
                    //    tParam = {"fill": false};
                    //  yourDesigner.setElementParameters(tParam, shirt_obj);
                }
            }
        }
      //  setTimeout(function () {
        //    makeRopeFront();
      //  }, 0);
    }

    if (from == 'custom.js') {
        return true;
}

}








function changeTshirtColorNewFlow(hex, id, from = '') {
    return new Promise((resolve, reject) => {
        try {
            shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
            $('.swiper-slide img').css('background-color', hex);
            let elementSources = window.ShirtElementSources;

            let elementSourcesJSON = JSON.parse(elementSources);

            let vindex = yourDesigner.currentViewIndex;

            sourceToCheck = 'source' + id;
            ropeSourceToCheck = 'sourceRope' + id;
            defaultropeSourceToCheck = 'defaultSourceRope';

            if (typeof elementSourcesJSON[vindex][sourceToCheck] !== 'undefined') {
                rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope');

                product_arr = yourDesigner.getProduct();
                rparams = setupRopeParams(product_arr[vindex], 'rope');
                if (rope_obj && rparams) {
                    rparams.fill = hex;
                    rparams.colorLinkGroup = false;
                    rparams.topped = 1;
                    yourDesigner.setElementParameters(rparams, rope_obj);
                }

                shadowObj = yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
                if (
                        shadowObj &&
                        typeof elementSourcesJSON[vindex]['noShadowForSourceAvlColors'] !== 'undefined' &&
                        elementSourcesJSON[vindex]['noShadowForSourceAvlColors']
                        ) {
                    rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
                    rparams.opacity = 0;
                    yourDesigner.setElementParameters(rparams, shadowObj);
                }

                shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
                if (shirt_obj) {
                    yourDesigner.currentViewInstance.removeElement(shirt_obj);
                }

                newSource = elementSourcesJSON[vindex][sourceToCheck];
                elementSourcesJSON[vindex].parameters.topped = 0;
                elementSourcesJSON[vindex].parameters.fill = false;
                elementSourcesJSON[vindex].parameters.replace = true;
                yourDesigner.addElement(
                        'image',
                        newSource,
                        'Shirt',
                        elementSourcesJSON[vindex].parameters
                        );
            } else {
                rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope');
                product_arr = yourDesigner.getProduct();

                shadowObj = yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
                if (
                        shadowObj &&
                        typeof elementSourcesJSON[vindex]['noShadowForSourceAvlColors'] !== 'undefined' &&
                        elementSourcesJSON[vindex]['noShadowForSourceAvlColors']
                        ) {
                    rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
                    rparams.opacity = 1;
                    yourDesigner.setElementParameters(rparams, shadowObj);
                }

                shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
                if (shirt_obj) {
                    yourDesigner.currentViewInstance.removeElement(shirt_obj);
                }

                newSource = elementSourcesJSON[vindex].source;

                sizeId = $('#ord_size').val();
                sourceToCheck = 'sourcesize' + sizeId;
                if (typeof elementSourcesJSON[vindex][sourceToCheck] !== 'undefined') {
                    newSource = elementSourcesJSON[vindex][sourceToCheck];
                    // console.log('newSourceis overwritten');
                }

                elementSourcesJSON[vindex].parameters.topped = 0;
                elementSourcesJSON[vindex].parameters.fill = hex;
                yourDesigner.addElement(
                        'image',
                        newSource,
                        'Shirt',
                        elementSourcesJSON[vindex].parameters
                        );

                rparams = setupRopeParams(product_arr[vindex]);
                if (rope_obj) {
                    rparams.colorLinkGroup = 'shirtGroup';
                    rparams.fill = false;
                    rparams.topped = 1;
                    yourDesigner.setElementParameters(rparams, rope_obj);
                }

                if (typeof window.acc_mockup !== 'undefined' && window.acc_mockup) {
                    tParam = {fill: hex};
                } else {
                    tParam = {fill: hex, topped: 1};
                }

                shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
                if (typeof shirt_obj !== 'undefined') {
                    yourDesigner.setElementParameters(tParam, shirt_obj);
                }

                if (typeof window.shadowElementSources !== 'undefined') {
                    elementSourcesJSON = JSON.parse(window.shadowElementSources);
                    vindex = yourDesigner.currentViewIndex;

                    sizeId = $('#ord_size').val();
                    sourceToCheck = 'sourcesize' + sizeId;

                    if (
                            typeof elementSourcesJSON[vindex] !== "undefined" &&
                            typeof elementSourcesJSON[vindex][sourceToCheck] !== 'undefined' &&
                            elementSourcesJSON[vindex][sourceToCheck] &&
                            elementSourcesJSON[vindex][sourceToCheck] !== '{}'
                            ) {
                        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
                        if (typeof shirt_obj !== 'undefined') {
                            // console.log('settinga');
                        }
                    }
                }

                setTimeout(function () {
                    makeRopeFront();
                }, 0);
            }

            // ✅ Resolve the promise when complete
            resolve();
        } catch (err) {
            console.error("changeTshirtColor error:", err);
            reject(err);
        }
    });
}








$(document).ready(function () {
    var myElement = document.getElementById('data-simplebar');
    new SimpleBar(myElement, {autoHide: true});

    document.getElementById('no-designs').style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    document.getElementById('data-simplebar').style.display = '';
    document.getElementById('mod-footer').style.display = '';
});
// scroll bar

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('page-link')) {
        e.preventDefault(); // Prevent the default action of the link

        var page = e.target.getAttribute('data-page'); // Get the value of data-page attribute

        if (page && page > 0) {
            getImageData(parseInt(page)); // Pass the page number to the function
        }
    }
});

function setupRopeParams(ropeData, elemName = 'rope') {
    rp = false;
    $.each(ropeData.elements, function (index, value) {
        if (value.title == elemName) {
            rp = value.parameters;
        }
    });

    return rp;
}
// Paginatio initial
function generatePagination(currentPage, totalPages) {
    var paginationHtml =
            '<ul class="pagination pagination-sm pagination-separated">';

    // Previous Button
    paginationHtml +=
            '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '">';
    paginationHtml +=
            '<a href="#" class="page-link" data-page="' +
            (currentPage - 1) +
            '">←</a>';
    paginationHtml += '</li>';

    // Page Numbers with Ellipses
    if (totalPages <= 5) {
        // If there are 5 or fewer pages, show all of them
        for (var i = 1; i <= totalPages; i++) {
            paginationHtml +=
                    '<li class="page-item' +
                    (i === currentPage ? ' active' : '') +
                    '">';
            paginationHtml +=
                    '<a href="#" class="page-link" data-page="' +
                    i +
                    '">' +
                    i +
                    '</a>';
            paginationHtml += '</li>';
        }
    } else {
        // Show first page, ellipsis, current page and last page
        paginationHtml +=
                '<li class="page-item' +
                (currentPage === 1 ? ' active' : '') +
                '">';
        paginationHtml += '<a href="#" class="page-link" data-page="1">1</a>';
        paginationHtml += '</li>';

        if (currentPage > 4) {
            paginationHtml +=
                    '<li class="page-item disabled"><a href="#">...</a></li>';
        }

        for (
                var i = Math.max(currentPage - 1, 2);
                i <= Math.min(currentPage + 1, totalPages - 1);
                i++
                ) {
            paginationHtml +=
                    '<li class="page-item' +
                    (i === currentPage ? ' active' : '') +
                    '">';
            paginationHtml +=
                    '<a href="#" class="page-link" data-page="' +
                    i +
                    '">' +
                    i +
                    '</a>';
            paginationHtml += '</li>';
        }

        if (currentPage < totalPages - 3) {
            paginationHtml +=
                    '<li class="page-item disabled"><a href="#">...</a></li>';
        }

        paginationHtml +=
                '<li class="page-item' +
                (currentPage === totalPages ? ' active' : '') +
                '">';
        paginationHtml +=
                '<a href="#" class="page-link" data-page="' +
                totalPages +
                '">' +
                totalPages +
                '</a>';
        paginationHtml += '</li>';
    }

    // Next Button
    paginationHtml +=
            '<li class="page-item' +
            (currentPage === totalPages ? ' disabled' : '') +
            '">';
    paginationHtml +=
            '<a href="#" class="page-link" data-page="' +
            (currentPage + 1) +
            '">→</a>';
    paginationHtml += '</li>';

    paginationHtml += '</ul>';

    return paginationHtml;
}

function getImageData(page) {
    // For Modal Always Show When Click Outside Too vytu
    // $("#myModal").modal({
    //     backdrop: "static"
    // });

    $('#myModal').modal({
        backdrop: false,
    });

    // For Check the Printing is Checked or Not
    radioChecked = document.querySelector(
            'input[name="printingOption"]:checked'
            );
    // Check if vinyl selected
    vPrint = $("input[name='printingOption']:checked").val();
    vPrintDropdown = $('#print_type_dropdown').val();
    if (vPrintDropdown == '' && vPrint == 'vinyl_printing') {
        showToast(
                'Please choose Vinyl type before adding Design',
                'danger',
                4000
                );
        return false;
    }
    if (!radioChecked) {
        showToast(
                'Please choose a Printing Option before proceeding..!',
                'danger',
                4000
                );
        return false;
    } else {
        $('#myModal').modal('show');
    }

    /*
     * Get Print type
     */
    ptid = $("input[name='printingOption']:checked").val();
    mTitle = 'My Design Library';
    if (ptid === 3 || ptid === '3') {
        mTitle = 'My Embroidery Design Library';
    }
    $('#myModal h5:first-of-type').html(mTitle);

    document.getElementById('no-designs').style.display = 'none';
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('data-simplebar').style.display = '';
    document.getElementById('mod-footer').style.display = '';

    var offset = 0;

    if (page > 1) {
        offset = 15 * (page - 1);
    }

    $.ajax({
        url: baseUrl + '/mockup-get-image', // Replace with your server URL
        type: 'POST',
        data: {
            printType: ptid,
            clientId: 1,
            page: 15,
            offset: offset,
            searchedval:
                    window.SearchedValue == null || window.SearchedValue == ''
                    ? ''
                    : window.SearchedValue,
        },
        success: function (response) {
            var data = response.designs;
            if (response.Total == 0 && data.length == 0) {
                document.getElementById('no-designs').style.display = 'flex';
                document.getElementById('loader').style.display = 'none';
                document.getElementById('data-simplebar').style.display =
                        'none';
                document.getElementById('mod-footer').style.display = 'none';
            }

            if (page == 1) {
                var total =
                        response.Total == null || response.Total == ''
                        ? 15
                        : response.Total;

                window.total = total;
                window.PaginationCount = Math.ceil(total / 15);
            }

            $('.modal-footer').html(generatePagination(page, PaginationCount));

            if (page == 1) {
                var pageLinks = document.querySelectorAll(
                        '.pagination .page-link'
                        );
                pageLinks[0].classList.add('disabled');

                pageLinks.forEach(function (link) {
                    if (link.textContent === '1') {
                        link.parentElement.classList.add('active');
                    }
                });
            }

            // Assuming data is an array of image URLs
            if (Array.isArray(data)) {
                var $imageContainer = $('.image-container'); // Target the container

                // Clear existing images
                $imageContainer.empty();

                data.forEach(function (imageUrl) {
                    // Create a new container for each image
                    var $imageWrapper = $('<div>').addClass(
                            'col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 mt-2 img-list-container'
                            );
                    var $borderDiv = $('<div>').addClass(
                            'border rounded fullHeight'
                            );

                    // Create a wrapper for the image and name
                    var $contentDiv = $('<div>')
                            .addClass('d-flex p-2 subHeight')
                            .css({
                                'justify-content': 'center',
                                'flex-direction': 'column',
                                'align-items': 'center',
                                background: '#f3f6f9',
                            });

                    // Create and append the image
                    // var $img = $('<img>').attr('src', 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/thumbs/'+imageUrl.design_image).addClass(' bg-light rounded selected-img').on('click', function () {
                    //     putCustomImageData(imageUrl);
                    // });

                    if (imageUrl.ext !== "2" && imageUrl.ext !== 2 && (
                            imageUrl.design_type_id == 3 ||
                            imageUrl.design_type_id == 4 ||
                            imageUrl.ext == 1
                            )) {
                        prefix_url =
                                'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/thumbs/';
                    } else if (imageUrl.ext == 2) {
                        prefix_url =
                                'https://qikink-assets.s3.ap-south-1.amazonaws.com/erp2/assets/designs/thumbs/';
                    } else {
                        prefix_url =
                                //   'https://dashboard.qikink.com/assets/designs/thumbs/';
                                prefix_url = 'https://qikink-assets.s3.ap-south-1.amazonaws.com/qikink.com/erp2/assets/designs/thumbs/';

                    }
                    var $img = $('<img>')
                            .attr('src', prefix_url + imageUrl.design_image)
                            .attr('data-res-x', imageUrl.res_x)
                            .attr('data-width-px', imageUrl.width_px)
                            .attr('data-ext', imageUrl.ext)
                            .attr('data-height-px', imageUrl.height_px)
                            .attr('data-dpi', imageUrl.image_dpi)
                            .attr('data-design-id', imageUrl.design_id)
                            .attr('data-width', imageUrl.design_width)
                            .attr('data-height', imageUrl.design_height)
                            .attr('data-design-type-id', imageUrl.design_type_id)
                            .addClass('bg-light rounded selected-img img-fluid')
                            .on('click', function () {
                                putCustomImageData(imageUrl);
                            });

                    $contentDiv.append($img);

                    // Append the content div to the border div
                    $borderDiv.append($contentDiv);

                    // Create and append the name
                    var $nameDiv = $('<div>').addClass('pt-1 fullWidth');
                    var $name = $('<h5>')
                            .addClass('fs-14 mb-1 tag-name')
                            .text(imageUrl.design_name || '')
                            .css('text-align', 'center')
                            .attr('title', imageUrl.design_name);
                    $nameDiv.append($name);
                    $borderDiv.append($nameDiv);

                    // Append the border div to the image wrapper
                    $imageWrapper.append($borderDiv);

                    // Finally, append the image wrapper to the container
                    $imageContainer.append($imageWrapper);
                });
            }

            document.getElementById('loader').style.display = 'none';
        },
        error: function (xhr, status, error) {
            console.log('Failed to add design. Please try again.', error);
        },
    });
}

// Search
function getSearchedValue(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form submission

        const searchInput = document.getElementById('search_design');
        if (searchInput) {
            // Check if the input element exists
            const searchValue = searchInput.value;
            window.SearchedValue = searchValue; // Use window object cautiously

            getImageData(1);
        } else {
            console.error('Input element with ID "search_design" not found.');
        }
    }
}

//-----------------------
$(document).ready(function () {
    // For get the Design ANgle As Input from Users & Rotate the Design Image As per the Value
    $('#design_angle').on('change', function () {
        let angleValue = parseFloat($(this).val());
        if (angleValue > 360) {
            angleValue = 360;
            $(this).val(360);
        }

        const currentViewInstance = yourDesigner.currentViewInstance;

        if (currentViewInstance) {
            const design_obj = currentViewInstance.getElementByTitle('Design');
            if (design_obj) {
                yourDesigner.setElementParameters(
                        {
                            angle: angleValue,
                        },
                        design_obj
                        );
            }
        }
    });

    $(document).on('click', '.btn-close', function () {
        document.getElementById('search_design').value = '';
        window.SearchedValue = '';
    });
});

function putCustomImageData(objItems) {
    $('.design-align-icons').removeClass('d-none');

    document.getElementById('image_width_temp').value = objItems.design_width;
    document.getElementById('image_height_temp').value = objItems.design_height;
    document.getElementById('image_dpi_temp').value = objItems.res_y;
    document.getElementById('image_width_in_px_temp').value = objItems.width_px;
    document.getElementById('image_height_in_px_temp').value =
            objItems.height_px;

    document.getElementById('width').value = objItems.design_width;
    document.getElementById('height').value = objItems.design_height;
    document.getElementById('dpi').value = objItems.image_dpi;

    $.ajax({
        url: baseUrl + '/mockup-put-image',
        type: 'POST',
        data: {
            design_type_id: objItems.design_type_id,
            design_image: objItems.design_image,
            res_x: objItems.res_x,
            res_y: objItems.res_y,
            height_px: objItems.height_px,
            width_px: objItems.width_px,
            design_id: objItems.design_id,
            ext: objItems.ext,
        },
        success: function (response) {
            window.do_not_reset_designId = true;
            addCustomImageFpd(response);

            showToast('Design Image Added..!', 'success', 2500);
        },
        error: function (xhr, status, error) {
            console.log('Failed to Add Design. Please try again.', error);
            showToast(
                    'Failed to Add Design. Please try again.',
                    'danger',
                    4000
                    );
        },
    });
}

function changeBoundingBox(design_json, size_id_selected) {

    if (yourDesigner) {
        title_view = yourDesigner.currentViewInstance.title;
    } else {
        title_view = 'Front';
    }
    if (typeof design_json[title_view] == 'undefined') {
        return;
    }
    printtype = $("input[name='printingOption']:checked").val();

    // design json is the placement's design parameters
    design_params = design_json[title_view];

    // check for bounding box size wise

    // end
    if (
            typeof design_json[title_view]['boundingBoxSize' + size_id_selected] !==
            'undefined'
            ) {
        window.customBoundingBox = true;
        design_params.boundingBox =
                design_json[title_view]['boundingBoxSize' + size_id_selected];
    } else {
        if (
                typeof window.customBoundingBox !== 'undefined' &&
                window.customBoundingBox
                ) {
            design_params.boundingBox =
                    window.design_json_static[title_view]['boundingBox'];
            window.customBoundingBox = false;
        } else {
            return false;
        }
    }
    // design_json[title_view].z = "999";
    design_params.topped = 1;
    design_params.z = 1;
    design_params.resizable = 1;
    design_params.draggable = 1;
    design_params.draggable = 1;
    return design_params;
}

function addCustomImageFpd(values) {
    var design_element =
            window.yourDesigner.currentViewInstance.getElementByTitle('Design');
    if (design_element) {
        window.yourDesigner.currentViewInstance.removeElement(design_element);
    }

    title_view = yourDesigner.currentViewInstance.title;
    // get print type id
    printtype = $('#' + yourDesigner.currentViewIndex + '_printtype').val();
    size_id_selected = $('#ord_size').val();
    if (printtype == '') {
        printtype = $("input[name='printingOption']:checked").val();
    }

    /*
     * Not sure what this code does
     */
    if (typeof window.constant_design_json == 'undefined') {
        window.constant_design_json = design_json;
    } else {
        design_json = window.constant_design_json;
        //alert("Constant value is");
        // alert(window.constant_design_json);
    }
    /*
     * End 26-03-2025
     */
    design_paramss = JSON.parse(JSON.stringify(design_json[title_view]));

    // check for bounding box size wise

    if (
            typeof design_json[title_view]['boundingBox' + printtype] !==
            'undefined'
            ) {
        design_paramss.boundingBox =
                design_json[title_view]['boundingBox' + printtype];
    } else {
        // alert(JSON.stringify(design_json[title_view]["boundingBox"]));

        design_paramss.boundingBox = design_json[title_view]['boundingBox'];
    }
    // end
    if (
            typeof design_json[title_view]['boundingBoxSize' + size_id_selected] !==
            'undefined'
            ) {
        design_paramss.boundingBox =
                design_json[title_view]['boundingBoxSize' + size_id_selected];
    } else {
    }

    // design_json[title_view].z = "999";
    design_paramss.topped = 1;
    design_paramss.z = 1;
  if (window.mockup_id == "148" || design_json[title_view]?.designAtTop === 1) {
    design_paramss.z = 999;
}
    design_paramss.resizable = 1;
    design_paramss.draggable = 1;
    design_paramss.draggable = 1;

    window.yourDesigner.addCustomImage(
            baseUrl + values.file_url,
            'Design',
            design_paramss
            );

    // Store Design Object
    window.current_design_object = values;
    $('.image_dimentions_menu').removeClass('d-none');
    $('#myModal').modal('hide');
    $('.modal-backdrop').remove();
}

function resetDesForm() {
    $('#width').val('');
    $('#height').val('');
    $('#dpi').val('');
    $('#print_quality').val('');
    //design_angle
    $('#design_angle').val('');
}

function resetHiddenDesForm(vindex) {
    $('#' + vindex + '_width').val('');
    $('#' + vindex + '_dpi').val('');
    $('#' + vindex + '_zoom_percentage').val('');
    $('#' + vindex + '_height').val('');
    if (!window.do_not_reset_designId) {
        $('#' + vindex + '_designid').val('');
    } else {
        window.do_not_reset_designId = false;
    }
    // $('#' + vindex + '_printtype').val("");
    // $('#' + vindex + '_placement').val("");
    $('#' + vindex + '_mockup_url').val('');
}
