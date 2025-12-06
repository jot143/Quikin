var mockup_id = window.mockup_id;
var mockup_title = "MockupName";
window.isCreateProduct = 3; // here We Set isCreateProduct & pageType 3 for Create Product

jQuery(document).ready(function() {
    // Mockup ID specific logic for default color
    if (mockup_id == 16) {
        $('.default_color_div').addClass('d-none');
    } else {
        $('.default_color_div').removeClass('d-none');
    }

    // Logic for specific mockups (62, 89) when size is clicked
    if (mockup_id == 62 || mockup_id == 89) {
        $('.size-button').on('click', function() {
            design_obj = yourDesigner.getElementByTitle("Design");
            var sizeId = $(this).attr('id');
            if (design_obj) {
                design_return_params = changeBoundingBox(window.design_json_static, sizeId);
                if (design_return_params) {
                    design_return_params.scaleX = design_obj.scaleX;
                    design_return_params.scaleY = design_obj.scaleX;
                    yourDesigner.setElementParameters(design_return_params, "Design");
                }
            }

            changeTshirtColorAcc(false, sizeId, "size");
            changeTshirtShadow(sizeId, "size");

            $('.size-button').removeClass('selected');
            $(this).addClass('selected');
            // const sizeName = $(this).text(); // Unused variable

            getimgSize(sizeId);
            $('#temp_size').val(sizeId);

            // var firstSizeId = $(".size-button").first().attr("id"); // Unused variable
            if ($('#plain_order_check').is(':checked')) {
                // setPriceForPlainProduct(); // Commented out function
            } else {
                // pricesValidation("1", "colors"); // Commented out function
            }
        });
    }

    // Show swiper container
    $(".swiper-container").removeClass("d-none");

    // Here we get the Design Json File
    design_json = window.design_json;
    var default_design_param;
    if (typeof design_json.Front !== "undefined") {
        default_design_param = design_json.Front;
    } else if (typeof design_json.Back !== "undefined") {
        default_design_param = design_json.Back;
    } else {
        default_design_param = design_json;
    }

    // Here we get the Price Json File (prices_json is declared but not used in the provided logic)
    // prices_json = window.prices_json;

    // For get the Design Angle As Input from Users & Rotate the Design Image As per the Value
    $('#design_angle').on('change', function() {
        let angleValue = parseFloat($(this).val());
        if (angleValue > 360) {
            angleValue = 360;
            $(this).val(360);
        }

        const currentViewInstance = yourDesigner.currentViewInstance;

        if (currentViewInstance) {
            const design_obj = currentViewInstance.getElementByTitle("Design");
            if (design_obj) {
                yourDesigner.setElementParameters({
                    angle: angleValue
                }, design_obj);
            }
        }
    });

    // Function to set fill color for background and shirt
    function fpdsetFillClr(qiHexcolor) {
        qikParam = {
            "fill": qiHexcolor
        };
        shirt_obj = yourDesigner.getElementByTitle("Shirt");
        tshirt_color = shirt_obj.fill;
        tParam = {
            "fill": tshirt_color,
        };

        background_obj = yourDesigner.getElementByTitle("QikinkBackground");
        yourDesigner.setElementParameters(qikParam, background_obj);
        yourDesigner.setElementParameters(tParam, shirt_obj);
    }
});

$(document).ready(function() {
    // Initial selection for view item
    $(".viewItemSelect:first-of-type").addClass("viewSelected");

    // Event handler for view item selection
    $(".placementsDiv").on("click", ".viewItemSelect", function() {
        $(".viewItemSelect").removeClass("viewSelected");
        $(this).addClass("viewSelected");
        vIndex = $(this).attr("data-viewindex");

        yourDesigner.selectView(vIndex);
        // Set Print type Id in form
        pval = $("input[name='printingOption']:checked").val();
        $("#" + vIndex + "_printtype").val(pval);
        
        // Color selection logic based on mockup_id
        colorId = $('#defaultProductColor').val();
        elem_c = $("button[bg-color-id='" + colorId + "']");
        bgcolor = elem_c.attr("bg-color");

        changeTshirtColor(bgcolor, colorId);
        setViewFormValues(vIndex);
    });

    // Tab click handler
    $('#design_and_product_tab .nav-link').on('click', function() {
        $('#design_and_product_tab .nav-link').removeClass('create-prod-custom-active-tab')
            .addClass('create-prod-custom-inactive-tab');
        $(this).removeClass('create-prod-custom-inactive-tab').addClass(
            'create-prod-custom-active-tab');
    });

    // Center Align icon load handler (functionality to hide something on click)
    $('#center-align-icon').on('load', function() {
        var svgDoc = this.contentDocument;
        var svgElement = svgDoc.querySelector('svg');
        $(svgElement).on('click', function() {
            $('.fpd-visibility.fpd-show').css({
                'display': 'none'
            });
        });
    });

    // Vertical carousel logic (incomplete/redundant for modern frameworks)
    $('.carousel .vertical .item').each(function() {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        for (var i = 1; i < 2; i++) {
            next = next.next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }
            next.children(':first-child').clone().appendTo($(this));
        }
    });

    // Default state for Select All Colors
    $(".selectAllColors").text("Select All");
    let allSelected = true; // Tracks the current state

    // Function to add a selected color to the default color dropdown
    function addSelectedColorsToDefaultColor(colorId, colorName) {
        const dropdown = $('#defaultColorDropdown');
        let existingOption = dropdown.find(`option[value="${colorId}"]`);

        if (existingOption.length === 0) {
            // Add new option
            const newOption = new Option(colorName, colorId, true, true);
            dropdown.prepend(newOption); // Add directly to top
        } else {
            // If it exists, move it to top
            existingOption.remove();
            dropdown.prepend(existingOption);
            dropdown.val(colorId); // Set it as selected
        }
        dropdown.trigger('change.select2');
    }

    // Event handler for individual color button clicks
    let selectedColors = [];
    let toastAlreadyShown = false;
    $(".form-mockup").on("click", ".colors button", function() {
        toggleColorSelection($(this), "none");
    });

    // By Default here We ADd the printing_cost to the base prise based on the product size
    function toggleColorSelection(button, from = "none") {
        const colorCode = button.attr("bg-color");
        const colorId = button.attr("bg-color-id");
        const colorName = button.attr('bg-color-name');

        const colorIndex = selectedColors.findIndex(color => color.colorId === colorId);

        if (colorIndex === -1) {
            var isVariantAvailable = checkVariantLimit('colors', toastAlreadyShown);

            if (!isVariantAvailable) {
                if (!toastAlreadyShown) {
                    toastAlreadyShown = true;
                    setTimeout(() => {
                        toastAlreadyShown = false;
                    }, 3000);
                }
                return false; // Stop execution
            }

            selectedColors.push({
                colorId,
                colorCode
            });
            button.css({
                'border': '1px solid #f2782c',
                'border-radius': '50%',
                'color': '#f2782c',
                'box-shadow': '0 3px 3px rgba(0, 0, 0, 0.5)',
                'width': '28px',
                'height': '28px'
            });

            // Add the selected color to the Default Color Dropdown
            addSelectedColorsToDefaultColor(colorId, colorName);

            $("#ord_color").val(colorId);
            getimgColor(colorCode, colorId);

        } else {
            selectedColors.splice(colorIndex, 1);
            button.css({
                'border': 'none',
                'box-shadow': 'none',
                'color': '',
                'border-radius': '5px',
                'width': '26px',
                'height': '26px'
            });

            $('#defaultColorDropdown').find(`option[value="${colorId}"]`).remove();

            // const allTexts = $('#defaultColorDropdown option').map(function() { // Unused variable
            //     return $(this).text();
            // }).get().filter(text => text !== "Default Color");

            const lastColorId = selectedColors[selectedColors.length - 1]?.colorId;
            $("#ord_color").val(lastColorId);
            $('#defaultProductColor').val(lastColorId);
        }

        $('#multiSelectedColors').val(selectedColors.map(color => color.colorId).join(','));

        if (from !== "selectAll") {
            const exists = selectedColors.some(color => color.colorId === colorId);

            if (exists == true) {
                changeTshirtColor(colorCode, colorId);
            }

            if (colorIndex === -1) {
                printCostTotal = calculateTotalPrintCost();
                setBasePriceToSizes(printCostTotal);
            }
        }
        $('#temp_color').val(colorId);
        // if ($('#plain_order_check').is(':checked')) { // Commented out function
        //     setPriceForPlainProduct();
        // } else {
        //     pricesValidation("1", "colors");
        // }
    }

    // Event handler for "Select All" click
    $('.mcontainer').on('click', '.selectAllColors', function() {
        let toastAlreadyShown = false; // flag to prevent repeated toasts

        // Toggle selection state
        $('.colors button').each(function() {
            const button = $(this);
            const colorCode = button.attr('bg-color');
            const colorId = button.attr('bg-color-id');
            const colorName = button.attr('bg-color-name');

            if (allSelected) {
                // Select all colors
                var isVariantAvailable = checkVariantLimit('colors', toastAlreadyShown);

                if (!isVariantAvailable) {
                    if (!toastAlreadyShown) {
                        toastAlreadyShown = true;
                        setTimeout(() => {
                            toastAlreadyShown = false;
                        }, 3000);
                    }
                    return false; // Stop loop
                }

                selectedColors.push({
                    colorId,
                    colorCode,
                });

                button.css({
                    border: '1px solid #f2782c',
                    'border-radius': '50%',
                    color: '#f2782c',
                    'box-shadow': '0 3px 3px rgba(0, 0, 0, 0.5)',
                    width: '28px',
                    height: '28px',
                });

                // Call function to add color to default dropdown
                addSelectedColorsToDefaultColor(colorId, colorName);
            } else {
                // Deselect all colors
                button.css({
                    border: 'none',
                    'box-shadow': 'none',
                    color: '',
                    'border-radius': '5px',
                    width: '26px',
                    height: '26px',
                });

                // Remove color from default dropdown
                $('#defaultColorDropdown')
                    .find(`option[value="${colorId}"]`)
                    .remove();
            }
        });

        // Update selectedColors array and hidden input based on state
        if (allSelected) {
            $(this).text('Clear All');
        } else {
            $(this).text('Select All');
            selectedColors = []; // Clear array when deselecting all
        }

        // Update the hidden input with selected color IDs
        $('#multiSelectedColors').val(
            selectedColors.map((color) => color.colorId).join(',')
        );

        // Flip the state for next click
        allSelected = !allSelected;
    });

    function checkVariantLimit(from, toastAlreadyShown = false) {
        var sizes = $('#multiSelectedSizes').val().split(',').map(Number);
        var colors = $('#multiSelectedColors').val().split(',').map(Number);

        if (from == 'sizes' || from == 'colors') {
            const variantCount = sizes.length * colors.length;
            var store_type = $('#store_type').val();
            var maxVariantLimit = (store_type != 'woocommerce') ? 100 : 50;

            if (variantCount > maxVariantLimit) {
                if (!toastAlreadyShown) {
                    showToast(`Max ${from} limit Reached. (${maxVariantLimit} Variants)`, 'warning', 10000);
                }
                // console.log("Variants 100 reached");
                return false;
            } else {
                console.log(`Max ${from} limit Still There. (${maxVariantLimit} Variants)`);
                return true;
            }
        }
    }
});

function setBasePriceToSizes(printing_cost = 0) {
    // For by Default select the First Print Type Option
    var radioChecked = $("input[name='printingOption']:checked").val();
    if (!radioChecked) {
        $("input[name='printingOption']").first().prop('checked', true);
        $("input[name='printingOption']").first().trigger('change');
        radioChecked = $("input[name='printingOption']:checked").val();
        getValueAsPerPrintType(radioChecked);
    }

    printing_cost = parseFloat(printing_cost);
    $(".basePricePerSize").each(function() {
        // Extract values from data attributes
        var basePrice = parseFloat($(this).data("price")) || 0;
        var handlingCost = parseFloat($(this).attr("data-handling")) || 0;
        var taxRate = parseFloat($(this).data("producttax")) || 0;

        // Calculate the tax amount
        var taxAmount = ((basePrice + printing_cost) / 100) * taxRate;

        // Calculate the updated price
        var updatedPrice = basePrice + handlingCost + taxAmount + printing_cost;

        // Update the text with the new price
        $(this).text("₹ " + updatedPrice.toFixed(2));
        $(this).attr('data-updated-price', updatedPrice.toFixed(2));

        // Construct the detailed tooltip content with line breaks
        var tooltipContent = `
            Product Price: ₹ ${basePrice.toFixed(2)}<br>
            Printing Price: ₹ ${printing_cost.toFixed(2)}<br>
            Handling Price: ₹ ${handlingCost.toFixed(2)}<br>
            GST: ₹ ${taxAmount.toFixed(2)}<br>
            Total: ₹ ${updatedPrice.toFixed(2)}
        `;

        // Update the parent button's data-bs-original-title with the detailed content
        var $parentButton = $(this).closest('button');
        if ($parentButton.length && $parentButton.attr('data-bs-toggle') === 'tooltip') {
            $parentButton.attr('data-bs-original-title', tooltipContent);
            $parentButton.attr('data-bs-html', 'true'); // Enable HTML rendering

            // Re-initialize the tooltip
            var tooltip = bootstrap.Tooltip.getInstance($parentButton[0]);
            if (tooltip) {
                tooltip.dispose(); // Remove existing tooltip instance
            }
            new bootstrap.Tooltip($parentButton[0]); // Create new tooltip with updated content
        }
    });
}

function handlePrintTypeChange(element, printTypeId) {
    // Handle other logic related to printTypeId change if needed
    if (printTypeId === 17) {
        alert("test");
    }
}

function validateMultiplePT(pt) {
    // design_static = window.design_json_static; // Unused variable
    for (i = 0; i < 10; i++) {
        if ($("#" + i + "_printtype").length && $("#" + i + "_printtype").val() !== "" && $("#" + i + "_printtype").val() !== pt) {
            vobj = {
                success: false,
                pt: $("#" + i + "_printtype").val()
            };
            return vobj;
        }
    }
    vobj = {
        success: true
    };
    return vobj;
}

function resetDesForm() {
    $("#width").val("");
    $("#height").val("");
    $("#dpi").val("");
    $("#print_quality").val("");
    $("#design_angle").val("");
}

function resetHiddenDesForm(vindex) {
    $('#' + vindex + '_width').val("");
    $('#' + vindex + '_dpi').val("");
    $('#' + vindex + '_height').val("");
    $('#' + vindex + '_designid').val("");
    // $('#' + vindex + '_printtype').val(""); // printtype is intentionally left out
    $('#' + vindex + '_placement').val("");
    $('#' + vindex + '_mockup_url').val("");
}

tooltipTrigger();
// Tootltip triggering
function tooltipTrigger() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add event listener to buttons to hide tooltip on click
    document.querySelectorAll('.color-button').forEach(function(button) {
        button.addEventListener('click', function() {
            var tooltipInstance = bootstrap.Tooltip.getInstance(button);
            if (tooltipInstance) {
                tooltipInstance.hide();
            }
        });
    });
}