$(document).ready(function () {


    $(".form-mockup").on('click', '.size-button', function () {

        if ([62, 89, 266, 267].includes(Number(window.mockup_id))) {
            $(".size-button").removeClass("selected");

            $(".size-buttons").addClass("size-mockups");
            design_obj = yourDesigner.getElementByTitle("Design");
            var sizeId = $(this).attr('id');


            updateColorButtons(sizeId);
            if (design_obj) {
                design_return_params = changeBoundingBox(window.design_json_static, sizeId);
                if (design_return_params) {
                    design_return_params.scaleX = design_obj.scaleX;
                    design_return_params.scaleY = design_obj.scaleX;
                    yourDesigner.setElementParameters(design_return_params, "Design");
                }
            }

            changeTshirtColorAccSP(false, sizeId, "size");
            changeTshirtShadowSP(sizeId, "size");
            $('.size-button').removeClass('selected');
            $(this).addClass('selected');
            const sizeName = $(this).text();
            getimgSize(sizeId);
            $('#temp_size').val(sizeId);
              $('#multiSelectedSizes').val(sizeId);
            var firstSizeId = $(".size-button").first().attr("id");
            if ($('#plain_order_check').is(':checked')) {
                setPriceForPlainProduct();
            } else {
                pricesValidation("1", "colors");
            }
        } else {
            $(".size-buttons").removeClass("size-mockups");
        }
    });
    $('.mockup_design_starts').on('click', '.mockup2 .size-button', function () {
        //  if(!$(this).hasClass("selected")){
        if (![62, 89, 266, 267].includes(Number(window.mockup_id))) {
            bgSizeColor = $(this).attr("bg-size-color");
            var sizeId = $(this).attr('id');
            var selectedSizes = $("#multiSelectedSizes").val(); // Get comma-separated values
            if (selectedSizes) {
                var sizesArray = selectedSizes.split(',').map(function (item) {
                    return item.trim(); // Trim whitespace from each item
                });

                // Remove 'selected' class if sizeId is not in the list
                if (!sizesArray.includes(sizeId)) {
                    $(this).removeClass('selected');
                    return;
                }
            } else {
                // If multiSelectedSizes is empty, remove 'selected' class
                $(this).removeClass('selected');
                return;
            }


            design_obj = yourDesigner.getElementByTitle("Design");

            if (design_obj) {
                design_return_params = changeBoundingBox(window.design_json_static, sizeId);
                if (design_return_params) {
                    design_return_params.scaleX = design_obj.scaleX;
                    design_return_params.scaleY = design_obj.scaleX;
                    yourDesigner.setElementParameters(design_return_params, "Design");
                }
            }
            changeTshirtColorAcc(false, sizeId, "size");
          // allow multiselect only for mobile cases
            if (!($('.rightsidecontainer').hasClass('mockup2') && ($('.mockup_name_h3').html().toLowerCase().indexOf(' case') !== -1 || $('.mockup_name_h3').html().toLowerCase().indexOf('aop') !== -1 ) )) {
             if( window.mockup_id !== "280" && window.mockup_id!=="69" && window.mockup_id !=="124"){
                
                $('.size-button').removeClass('selected');
                $('#multiSelectedSizes').val(sizeId);
            }
            } else {
                // Optional: Add logic here if needed
            }

            $(this).addClass('selected');






            const sizeName = $(this).text();
            getimgSize(sizeId);
            $('#temp_size').val(sizeId);

        }


    });
});

function changeTshirtColorAccSP(hex, id, prefix = "") {
    shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
    if (hex) {
        $(".swiper-slide img").css("background-color", hex);
    }
    let elementSources = window.ShirtElementSources;
    let elementSourcesJSON = JSON.parse(elementSources);
    let vindex = yourDesigner.currentViewIndex;
    bgColorId = $("#ord_color").val();
    $('button[bg-color-id="' + bgColorId + '"]').attr('bg-color');
    // elementSourcesJSON[vindex].parameters.fill = hex;


    sourceToCheck = "source" + prefix + id;
    if (typeof elementSourcesJSON[vindex][sourceToCheck] !== "undefined") {

        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        newSource = elementSourcesJSON[vindex][sourceToCheck];
        elementSourcesJSON[vindex].parameters.topped = 1;
        elementSourcesJSON[vindex].parameters.replace = true;
        if (bgColorId !== "undefined" && bgColorId !== "") {

            elementSourcesJSON[vindex].parameters.fill = $('button[bg-color-id="' + bgColorId + '"]').attr("bg-color");
        } else {
            elementSourcesJSON[vindex].parameters.fill = false;
        }
        //     elementSourcesJSON[vindex].parameters.top=750;

        yourDesigner.addElement("image", newSource, "Shirt", elementSourcesJSON[vindex].parameters);
        //  changeTshirtColor($('button[bg-color-id="' + bgColorId + '"]').attr('bg-color'),bgColorId);

    } else {

        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        newSource = elementSourcesJSON[vindex].source;
        //   elementSourcesJSON[vindex].parameters.z=parseInt(-88);
        //newShirt = yourDesigner.currentViewInstance.addElement("image", newSource, "Shirt", elementSourcesJSON[vindex]);
        elementSourcesJSON[vindex].parameters.topped = 1;
        elementSourcesJSON[vindex].parameters.fill = $('button[bg-color-id="' + bgColorId + '"]').attr('bg-color');
        // elementSourcesJSON[vindex].parameters.fill = hex;
        yourDesigner.addElement("image", newSource, "Shirt", elementSourcesJSON[vindex].parameters);
}

}

function changeTshirtShadowSP(id, prefix = "") {

    shadow_obj = yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
    let elementSourcesJSONShadow = JSON.parse(window.shadowElementSources);
    let vindex = yourDesigner.currentViewIndex;

    // elementSourcesJSON[vindex].parameters.fill = hex;


    sourceToCheck = "source" + prefix + id;

    if (typeof elementSourcesJSONShadow[vindex][sourceToCheck] !== "undefined") {

        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }

        newSource = elementSourcesJSONShadow[vindex][sourceToCheck];
        elementSourcesJSONShadow[vindex].parameters.replace = true;
        yourDesigner.addElement("image", newSource, "ShadowFront", elementSourcesJSONShadow[vindex].parameters);
        setTimeout(function () {
            bgColorId = $("#ord_color").val();
            $('button[bg-color-id="' + bgColorId + '"]').trigger("click");
        }, 10);
    } else {

        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        elementSourcesJSON[vindex].parameters.topped = 1;
        //       elementSourcesJSON[vindex].parameters.fill = false;
        newSource = elementSourcesJSON[vindex].source;
        //   elementSourcesJSON[vindex].parameters.z=parseInt(-88);
        //newShirt = yourDesigner.currentViewInstance.addElement("image", newSource, "Shirt", elementSourcesJSON[vindex]);
        //   elementSourcesJSON[vindex].parameters.topped = 0;

        // elementSourcesJSON[vindex].parameters.fill = hex;
        yourDesigner.addElement("image", newSource, "ShadowFront", elementSourcesJSON[vindex].parameters);
}


}
function setInputWidth() {
    $('.each-button.dynamic-button').each(function () {
        var $button = $(this).find('.size-button');
        var $input = $(this).find('.input-price-per-size');
        if ($button.length && $input.length) {
            $input.css('width', $button.outerWidth());
        }
    });
}

function changeSizeImages(sizeId) {
    design_obj = yourDesigner.getElementByTitle("Design");

    if (design_obj) {
        design_return_params = changeBoundingBox(window.design_json_static, sizeId);
        if (design_return_params) {
            design_return_params.scaleX = design_obj.scaleX;
            design_return_params.scaleY = design_obj.scaleX;
            design_return_params.angle = design_obj.angle;
            yourDesigner.setElementParameters(design_return_params, "Design");
        }
    }
    if (![62, 89, 266, 267].includes(Number(window.mockup_id))) {

        if ($('[bg-size-id="' + sizeId + '"]').attr('bg-size-color') !== undefined && $('[bg-size-id="' + sizeId + '"]').attr('bg-size-color')) {
            ccode = $('[bg-size-id="' + sizeId + '"]').attr('bg-size-color');
        } else {
            ccode = false;
        }
        changeTshirtColorAcc(ccode, sizeId, "size");
    } else {
        changeTshirtColorAccSP(false, sizeId, "size");
    }
}
function getColorIdsForSize(sizeId) {
    if (!sizeId || isNaN(sizeId)) {
        return []; // Return empty array for invalid input
    }
    const colorIds = [];
    const pricesJson = window.prices_json;

    if (!pricesJson) {
        console.error('prices_json is not defined');
        return [];
    }

    Object.keys(pricesJson).forEach(key => {
        const [size, color] = key.split('_');
        if (size === sizeId.toString()) {
            colorIds.push(parseInt(color));
        }
    });

    return colorIds.sort((a, b) => a - b);
}

function updateColorButtons(sizeId) {
    // Get available color IDs for the given size
    const availableColorIds = getColorIdsForSize(sizeId);

    // Get all color buttons
    const colorButtons = document.querySelectorAll('.colors .color-button');

    // Iterate through each color button to update visibility
    colorButtons.forEach(button => {
        const colorId = parseInt(button.getAttribute('bg-color-id'));
        if (availableColorIds.includes(colorId)) {
            button.classList.remove('d-none'); // Show button
        } else {
            button.classList.add('d-none'); // Hide button
        }
    });

    // Set the first available color_id to input fields
    if (availableColorIds.length > 0) {
        const ordColorInput = document.getElementById('ord_color');
        const multiSelectedColorsInput = document.getElementById('multiSelectedColors');
        if (ordColorInput) {
            ordColorInput.value = availableColorIds[0];
        }
        if (multiSelectedColorsInput) {
            multiSelectedColorsInput.value = availableColorIds[0];
        }

        // Find and trigger click on the first visible color button
        const firstVisibleButton = Array.from(colorButtons).find(button =>
            !button.classList.contains('d-none') &&
                    parseInt(button.getAttribute('bg-color-id')) === availableColorIds[0]
        );
        if (firstVisibleButton) {
            firstVisibleButton.click(); // Trigger click event
        }
    } else {
        // Clear inputs if no colors are available
        const ordColorInput = document.getElementById('ord_color');
        const multiSelectedColorsInput = document.getElementById('multiSelectedColors');
        if (ordColorInput) {
            ordColorInput.value = '';
        }
        if (multiSelectedColorsInput) {
            multiSelectedColorsInput.value = '';
        }
    }
}