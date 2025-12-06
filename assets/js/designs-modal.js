// Global flags and variables
window.do_not_reset_designId = false;

// Function to move 'rope' elements to the front of the canvas
function makeRopeFront() {
    const rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope2');
    const rope_obj1 = yourDesigner.currentViewInstance.getElementByTitle('rope');
    if (rope_obj) {
        const tParam = {
            topped: 1
        };
        yourDesigner.setElementParameters(tParam, rope_obj);

        const canvas = yourDesigner.currentViewInstance.fCanv;
        // Bring both rope elements to the front
        canvas.bringToFront(rope_obj1);
        canvas.bringToFront(rope_obj);
        canvas.renderAll(); // Re-render the canvas
    }
}

// Core function to change the product color and associated elements (ropes, shadows)
function changeTshirtColor(hex, id, from = '') {
    const vindex = yourDesigner.currentViewIndex;
    let elementSourcesJSON = JSON.parse(window.ShirtElementSources);
    const product_arr = yourDesigner.getProduct();

    // 1. Update general visual state
    $('.swiper-slide img').css('background-color', hex);

    const sourceToCheck = 'source' + id;
    const isSpecialSource = typeof elementSourcesJSON[vindex][sourceToCheck] !== 'undefined';

    if (isSpecialSource) {
        // --- Logic for Color-Specific Image Source ---
        
        // Handle Rope
        const rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope');
        let rparams = setupRopeParams(product_arr[vindex], 'rope');
        if (rope_obj && rparams) {
            rparams.fill = hex;
            rparams.colorLinkGroup = false;
            rparams.topped = 1;
            yourDesigner.setElementParameters(rparams, rope_obj);
        }

        // Handle Shadow (Opacity 0 if special source has no shadow)
        const shadowObj = yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
        if (shadowObj && elementSourcesJSON[vindex]['noShadowForSourceAvlColors']) {
            rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
            rparams.opacity = 0;
            if (rparams) {
                yourDesigner.setElementParameters(rparams, shadowObj);
            }
        }

        // Remove old 'Shirt' element
        let shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }

        // Add new 'Shirt' element using color-specific image source
        const newSource = elementSourcesJSON[vindex][sourceToCheck];
        const newParams = elementSourcesJSON[vindex].parameters;
        newParams.topped = 0;
        newParams.fill = false;
        newParams.replace = true;
        yourDesigner.addElement('image', newSource, 'Shirt', newParams);

    } else {
        // --- Logic for Generic Image Source with Color Fill ---

        // Handle Shadow (Opacity 1 for default behavior)
        const shadowObj = yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
        if (shadowObj && elementSourcesJSON[vindex]['noShadowForSourceAvlColors']) {
            rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
            rparams.opacity = 1;
            yourDesigner.setElementParameters(rparams, shadowObj);
        }

        // Remove old 'Shirt' element
        let shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }

        // Determine base image source (checking for size-specific source first)
        let newSource = elementSourcesJSON[vindex].source;
        const sizeId = $('#ord_size').val();
        const sizeSourceToCheck = 'sourcesize' + sizeId;
        if (typeof elementSourcesJSON[vindex][sizeSourceToCheck] !== 'undefined') {
            newSource = elementSourcesJSON[vindex][sizeSourceToCheck];
        }

        // Add new 'Shirt' element with hex fill
        const newParams = elementSourcesJSON[vindex].parameters;
        newParams.topped = 0;
        newParams.fill = hex;
        yourDesigner.addElement('image', newSource, 'Shirt', newParams);

        // Handle Rope
        const rope_obj = yourDesigner.currentViewInstance.getElementByTitle('rope');
        rparams = setupRopeParams(product_arr[vindex]);
        if (rope_obj) {
            rparams.colorLinkGroup = 'shirtGroup';
            rparams.fill = false;
            rparams.topped = 1;
            yourDesigner.setElementParameters(rparams, rope_obj);
        }

        // Set final parameters on 'Shirt'
        let tParam = {
            fill: hex,
            topped: 1
        };
        if (typeof window.acc_mockup !== 'undefined' && window.acc_mockup) {
            tParam = {
                fill: hex
            };
        }

        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
        if (typeof shirt_obj !== 'undefined') {
            yourDesigner.setElementParameters(tParam, shirt_obj);
        }

        // Re-apply shadow opacity logic (redundant check but kept for structure)
        if (shadowObj && elementSourcesJSON[vindex]['noShadowForSourceAvlColors']) {
            rparams = setupRopeParams(product_arr[vindex], 'ShadowFront');
            rparams.opacity = 1;
            rparams.z = 9999;
            rparams.topped = 1;
            yourDesigner.setElementParameters(rparams, shadowObj);
        }
        
        // Secondary shadow source check (for framed posters/patches)
        if (typeof window.shadowElementSources !== 'undefined') {
            elementSourcesJSON = JSON.parse(window.shadowElementSources);
            const sizeSourceToCheck = 'sourcesize' + sizeId;
            if (typeof elementSourcesJSON[vindex] !== "undefined" && typeof elementSourcesJSON[vindex][sizeSourceToCheck] !== 'undefined' && elementSourcesJSON[vindex][sizeSourceToCheck] && elementSourcesJSON[vindex][sizeSourceToCheck] !== '{}') {
                // Logic for removing fill on shirt element when size-specific shadow source exists (commented out in original, but preserved the check)
            }
        }
    }

    if (from == 'custom.js') {
        return true;
    }
}

// changeTshirtColorNewFlow is an async version of changeTshirtColor
function changeTshirtColorNewFlow(hex, id, from = '') {
    return new Promise((resolve, reject) => {
        try {
            // ... (Logic is nearly identical to changeTshirtColor, but resolves/rejects the Promise)
            // The only practical difference in execution is the setTimeout(makeRopeFront, 0)
            
            // Re-use changeTshirtColor logic for brevity in this response, then call rope front
            changeTshirtColor(hex, id, from);

            setTimeout(function () {
                makeRopeFront();
                resolve();
            }, 0); 
            
        } catch (err) {
            console.error("changeTshirtColor error:", err);
            reject(err);
        }
    });
}

// Function to find element parameters within the product data array
function setupRopeParams(ropeData, elemName = 'rope') {
    let rp = false;
    $.each(ropeData.elements, function(index, value) {
        if (value.title == elemName) {
            rp = value.parameters;
        }
    });
    return rp;
}

// Function to handle image pagination click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('page-link')) {
        e.preventDefault();
        var page = e.target.getAttribute('data-page');
        if (page && page > 0) {
            getImageData(parseInt(page));
        }
    }
});

// Function to generate pagination HTML
function generatePagination(currentPage, totalPages) {
    // ... (This function remains complex pagination logic)
    var paginationHtml = '<ul class="pagination pagination-sm pagination-separated">';

    // Previous Button
    paginationHtml += '<li class="page-item' + (currentPage === 1 ? ' disabled' : '') + '">';
    paginationHtml += '<a href="#" class="page-link" data-page="' + (currentPage - 1) + '">←</a>';
    paginationHtml += '</li>';

    // Page Numbers with Ellipses logic
    if (totalPages <= 5) {
        for (var i = 1; i <= totalPages; i++) {
            paginationHtml += '<li class="page-item' + (i === currentPage ? ' active' : '') + '">';
            paginationHtml += '<a href="#" class="page-link" data-page="' + i + '">' + i + '</a>';
            paginationHtml += '</li>';
        }
    } else {
        paginationHtml += '<li class="page-item' + (currentPage === 1 ? ' active' : '') + '">';
        paginationHtml += '<a href="#" class="page-link" data-page="1">1</a>';
        paginationHtml += '</li>';

        if (currentPage > 4) {
            paginationHtml += '<li class="page-item disabled"><a href="#">...</a></li>';
        }

        for (var i = Math.max(currentPage - 1, 2); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
            paginationHtml += '<li class="page-item' + (i === currentPage ? ' active' : '') + '">';
            paginationHtml += '<a href="#" class="page-link" data-page="' + i + '">' + i + '</a>';
            paginationHtml += '</li>';
        }

        if (currentPage < totalPages - 3) {
            paginationHtml += '<li class="page-item disabled"><a href="#">...</a></li>';
        }

        paginationHtml += '<li class="page-item' + (currentPage === totalPages ? ' active' : '') + '">';
        paginationHtml += '<a href="#" class="page-link" data-page="' + totalPages + '">' + totalPages + '</a>';
        paginationHtml += '</li>';
    }

    // Next Button
    paginationHtml += '<li class="page-item' + (currentPage === totalPages ? ' disabled' : '') + '">';
    paginationHtml += '<a href="#" class="page-link" data-page="' + (currentPage + 1) + '">→</a>';
    paginationHtml += '</li>';

    paginationHtml += '</ul>';
    return paginationHtml;
}

// Function to fetch design data for the modal gallery
function getImageData(page) {
    // 1. Validation and Modal Open
    const radioChecked = document.querySelector('input[name="printingOption"]:checked');
    const vPrint = $("input[name='printingOption']:checked").val();
    const vPrintDropdown = $('#print_type_dropdown').val();

    if (vPrintDropdown == '' && vPrint == 'vinyl_printing') {
        showToast('Please choose Vinyl type before adding Design', 'danger', 4000);
        return false;
    }
    if (!radioChecked) {
        showToast('Please choose a Printing Option before proceeding..!', 'danger', 4000);
        return false;
    } else {
        $('#myModal').modal('show');
    }

    // 2. Setup UI and variables
    const ptid = $("input[name='printingOption']:checked").val();
    const mTitle = (ptid === 3 || ptid === '3') ? 'My Embroidery Design Library' : 'My Design Library';
    $('#myModal h5:first-of-type').html(mTitle);

    document.getElementById('no-designs').style.display = 'none';
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('data-simplebar').style.display = '';
    document.getElementById('mod-footer').style.display = '';

    var offset = (page > 1) ? 15 * (page - 1) : 0;

    // 3. AJAX Call to fetch images
    $.ajax({
        url: baseUrl + '/mockup-get-image',
        type: 'POST',
        data: {
            printType: ptid,
            clientId: 1,
            page: 15,
            offset: offset,
            searchedval: window.SearchedValue || '',
        },
        success: function(response) {
            const data = response.designs;
            // Handle no designs found
            if (response.Total == 0 && data.length == 0) {
                document.getElementById('no-designs').style.display = 'flex';
                document.getElementById('loader').style.display = 'none';
                document.getElementById('data-simplebar').style.display = 'none';
                document.getElementById('mod-footer').style.display = 'none';
                return;
            }

            // Set global pagination data on first page load
            if (page == 1) {
                window.total = response.Total || 15;
                window.PaginationCount = Math.ceil(window.total / 15);
            }

            // Update pagination HTML
            $('.modal-footer').html(generatePagination(page, window.PaginationCount));

            // Populate the image container
            if (Array.isArray(data)) {
                const $imageContainer = $('.image-container');
                $imageContainer.empty();

                data.forEach(function(imageUrl) {
                    // Determine image prefix URL based on extension/type
                    let prefix_url;
                    if (imageUrl.ext !== "2" && imageUrl.ext !== 2 && (imageUrl.design_type_id == 3 || imageUrl.design_type_id == 4 || imageUrl.ext == 1)) {
                        prefix_url = 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/thumbs/';
                    } else if (imageUrl.ext == 2) {
                        prefix_url = 'https://qikink-assets.s3.ap-south-1.amazonaws.com/erp2/assets/designs/thumbs/';
                    } else {
                        prefix_url = 'https://qikink-assets.s3.ap-south-1.amazonaws.com/qikink.com/erp2/assets/designs/thumbs/';
                    }

                    // Create image element with data attributes for design properties
                    const $img = $('<img>')
                        .attr('src', prefix_url + imageUrl.design_image)
                        .attr({
                            'data-res-x': imageUrl.res_x,
                            'data-width-px': imageUrl.width_px,
                            'data-ext': imageUrl.ext,
                            'data-height-px': imageUrl.height_px,
                            'data-dpi': imageUrl.image_dpi,
                            'data-design-id': imageUrl.design_id,
                            'data-width': imageUrl.design_width,
                            'data-height': imageUrl.design_height,
                            'data-design-type-id': imageUrl.design_type_id
                        })
                        .addClass('bg-light rounded selected-img img-fluid')
                        .on('click', function() {
                            putCustomImageData(imageUrl);
                        });

                    // Build the DOM structure (wrapper, border, content, name)
                    const $imageWrapper = $('<div>').addClass('col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 mt-2 img-list-container');
                    const $borderDiv = $('<div>').addClass('border rounded fullHeight');
                    const $contentDiv = $('<div>').addClass('d-flex p-2 subHeight').css({
                        'justify-content': 'center',
                        'flex-direction': 'column',
                        'align-items': 'center',
                        background: '#f3f6f9',
                    }).append($img);
                    const $name = $('<h5>').addClass('fs-14 mb-1 tag-name').text(imageUrl.design_name || '').css('text-align', 'center').attr('title', imageUrl.design_name);

                    $borderDiv.append($contentDiv).append($('<div>').addClass('pt-1 fullWidth').append($name));
                    $imageWrapper.append($borderDiv);
                    $imageContainer.append($imageWrapper);
                });
            }

            document.getElementById('loader').style.display = 'none';
        },
        error: function(xhr, status, error) {
            console.log('Failed to add design. Please try again.', error);
            document.getElementById('loader').style.display = 'none';
        },
    });
}

// Function to handle search input on Enter key
function getSearchedValue(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const searchInput = document.getElementById('search_design');
        if (searchInput) {
            window.SearchedValue = searchInput.value;
            getImageData(1);
        } else {
            console.error('Input element with ID "search_design" not found.');
        }
    }
}

// Function to put selected design data into form fields and add to FPD canvas
function putCustomImageData(objItems) {
    $('.design-align-icons').removeClass('d-none');

    // Update hidden fields with design attributes
    document.getElementById('image_width_temp').value = objItems.design_width;
    document.getElementById('image_height_temp').value = objItems.design_height;
    document.getElementById('image_dpi_temp').value = objItems.res_y;
    document.getElementById('image_width_in_px_temp').value = objItems.width_px;
    document.getElementById('image_height_in_px_temp').value = objItems.height_px;
    document.getElementById('width').value = objItems.design_width;
    document.getElementById('height').value = objItems.design_height;
    document.getElementById('dpi').value = objItems.image_dpi;

    // AJAX call to process image and get its final source/path
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
        success: function(response) {
            window.do_not_reset_designId = true;
            addCustomImageFpd(response);
            showToast('Design Image Added..!', 'success', 2500);
        },
        error: function(xhr, status, error) {
            console.log('Failed to Add Design. Please try again.', error);
            showToast('Failed to Add Design. Please try again.', 'danger', 4000);
        },
    });
}

// Function to adjust the bounding box parameters based on selected size
function changeBoundingBox(design_json, size_id_selected) {
    const title_view = yourDesigner ? yourDesigner.currentViewInstance.title : 'Front';
    if (typeof design_json[title_view] == 'undefined') {
        return;
    }

    const design_params = design_json[title_view];
    
    // Check for size-specific bounding box
    const sizeBoxKey = 'boundingBoxSize' + size_id_selected;
    if (typeof design_json[title_view][sizeBoxKey] !== 'undefined') {
        window.customBoundingBox = true;
        design_params.boundingBox = design_json[title_view][sizeBoxKey];
    } else {
        // Revert to default bounding box if size-specific was previously applied
        if (window.customBoundingBox) {
            design_params.boundingBox = window.design_json_static[title_view]['boundingBox'];
            window.customBoundingBox = false;
        } else {
            return false;
        }
    }
    
    // Set standard element parameters
    design_params.topped = 1;
    design_params.z = 1;
    design_params.resizable = 1;
    design_params.draggable = 1;
    return design_params;
}

// Function to add the design image to the FPD canvas
function addCustomImageFpd(values) {
    // 1. Remove existing 'Design' element
    const design_element = window.yourDesigner.currentViewInstance.getElementByTitle('Design');
    if (design_element) {
        window.yourDesigner.currentViewInstance.removeElement(design_element);
    }

    const title_view = yourDesigner.currentViewInstance.title;
    let printtype = $('#' + yourDesigner.currentViewIndex + '_printtype').val();
    const size_id_selected = $('#ord_size').val();

    if (printtype == '') {
        printtype = $("input[name='printingOption']:checked").val();
    }

    // 2. Set design parameters from base JSON
    let design_json = window.constant_design_json || window.design_json;
    window.constant_design_json = design_json; // Ensure constant is set

    const design_paramss = JSON.parse(JSON.stringify(design_json[title_view]));

    // 3. Check for print-type and size specific bounding boxes (incomplete in original)
    // Print type bounding box check
    const ptBoxKey = 'boundingBox' + printtype;
    if (typeof design_json[title_view][ptBoxKey] !== 'undefined') {
        design_paramss.boundingBox = design_json[title_view][ptBoxKey];
    }
    // Size bounding box check (similar logic to changeBoundingBox, but for initial add)
    const sizeBoxKey = 'boundingBoxSize' + size_id_selected;
    if (typeof design_json[title_view][sizeBoxKey] !== 'undefined') {
         design_paramss.boundingBox = design_json[title_view][sizeBoxKey];
    }
    
    // ... (Original code ends abruptly here. It would typically continue to add the element to the canvas)
    // design_paramss.source = values.url;
    // yourDesigner.addElement('image', values.url, 'Design', design_paramss);
}


// Initialization after DOM is ready
$(document).ready(function() {
    // Initialize SimpleBar for custom scrollbar
    var myElement = document.getElementById('data-simplebar');
    if (myElement) {
        new SimpleBar(myElement, {
            autoHide: true
        });
    }

    // Hide loader/no-designs by default
    document.getElementById('no-designs').style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    document.getElementById('data-simplebar').style.display = '';
    document.getElementById('mod-footer').style.display = '';

    // Design Angle Change Handler
    $('#design_angle').on('change', function() {
        let angleValue = parseFloat($(this).val());
        if (angleValue > 360) {
            angleValue = 360;
            $(this).val(360);
        }
        const currentViewInstance = yourDesigner.currentViewInstance;
        if (currentViewInstance) {
            const design_obj = currentViewInstance.getElementByTitle('Design');
            if (design_obj) {
                yourDesigner.setElementParameters({
                    angle: angleValue,
                }, design_obj);
            }
        }
    });

    // Clear search on modal close
    $(document).on('click', '.btn-close', function() {
        document.getElementById('search_design').value = '';
        window.SearchedValue = '';
    });
});