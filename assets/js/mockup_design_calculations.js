// For Adding a Design to Mockup, the ElementAdd function will trigger this function
function designElementAdd(element) {
    var img = new Image();
    img.onload = function () {
        // Example of completing a process in 4 seconds
        if (window.myToast) {
            window.myToast.hideToast();
        }

        var maxWidthInches = element.maxWidthInches;
        var maxHeightInches = element.maxHeightInches;
        var boundingBoxWidth = element.boundingBox.width;
        var boundingBoxHeight = element.boundingBox.height;

        var actualImageWidthInInches = parseFloat(
                document.getElementById('image_width_temp').value
                );
        var actualImageWidthInPixels = parseFloat(
                document.getElementById('image_width_in_px_temp').value
                );
        var actualImageHeightInInches = parseFloat(
                document.getElementById('image_height_temp').value
                );
        var actualImageHeightInPixels = parseFloat(
                document.getElementById('image_height_in_px_temp').value
                );
        var actualImageDPI = parseFloat(
                document.getElementById('image_dpi_temp').value
                );

        let reductionPercentage = 0;

        // Calculate reduction percentage if width exceeds max width
        if (actualImageWidthInInches > maxWidthInches) {
            reductionPercentage =
                    ((actualImageWidthInInches - maxWidthInches) /
                            actualImageWidthInInches) *
                    100;
        }

        // Calculate reduced dimensions based on the reduction percentage
        let reducedWidthInInches =
                actualImageWidthInInches * (1 - reductionPercentage / 100);
        let reducedHeightInInches =
                actualImageHeightInInches * (1 - reductionPercentage / 100);
        let reducedWidthInPixels =
                actualImageWidthInPixels * (1 - reductionPercentage / 100);
        let reducedHeightInPixels =
                actualImageHeightInPixels * (1 - reductionPercentage / 100);

        // Calculate new DPI
        const newDPI = reducedWidthInPixels / reducedWidthInInches;
        // console.log(`The new DPI after reduction is ${newDPI.toFixed(2)}.`);

        // Update values in the document
        document.getElementById('width').value =
                reducedWidthInInches.toFixed(2);
        document.getElementById('height').value =
                reducedHeightInInches.toFixed(2);
        document.getElementById('dpi').value = newDPI.toFixed(0);

        // Calculate scaling factors based on bounding box dimensions and reduced image dimensions
        var scaleX =
                (boundingBoxWidth / maxWidthInches) *
                (reducedWidthInInches / reducedWidthInPixels);
        var scaleY =
                (boundingBoxHeight / maxHeightInches) *
                (reducedHeightInInches / reducedHeightInPixels);

        // console.log('Scale X: ' + scaleX);
        // console.log('Scale Y: ' + scaleY);

        // Apply scaling factors
        if (
                actualImageWidthInInches > maxWidthInches ||
                actualImageHeightInInches > maxHeightInches
                ) {
            scaleX = 0.3;
            scaleY = 0.3;
        }

        element.scaleX = scaleX;
        element.scaleY = scaleY;

        document.getElementById('initial_scale_x').value = scaleX;
        document.getElementById('initial_scale_y').value = scaleX;

        var objItem = {};

        objItem = {
            width: 4 * reducedWidthInInches.toFixed(2),
            height: 4 * reducedHeightInInches.toFixed(2),
            dpi: actualImageDPI.toFixed(0),
        };

        getSelDesignsModalAfter(window.yourDesigner.currentViewIndex, objItem);

        // window.yourDesigner.render();
    };

    img.src = element.source;
}


function designElementAddCustom(element) {

    $('#zoom_percentage').val('0');
    $('#design_angle').val('0');
    // Get Print type based current width inches.
    ptval = $("input[name='printingOption']:checked").val();

    incheswCheck = 'maxWidthInches' + ptval;
    incheshCheck = 'maxHeightInches' + ptval;
    if (element[incheswCheck]) {
        var maxWidthInches = element[incheswCheck];
        var maxHeightInches = element[incheshCheck];
    } else {
        var maxWidthInches = element.maxWidthInches;
        var maxHeightInches = element.maxHeightInches;
    }

    var boundingBoxWidth = element.boundingBox.width;
    var boundingBoxHeight = element.boundingBox.height;
    var currentScale = element.scaleX;

    current_design_values = window.current_design_object;
    if (
            current_design_values.image_width_inches > maxWidthInches ||
            current_design_values.image_height_inches > maxHeightInches
            ) {
        percent_diff_width = get_percentage_increase(
                current_design_values.image_width_inches,
                maxWidthInches
                );
        percent_diff_height = get_percentage_increase(
                current_design_values.image_height_inches,
                maxHeightInches
                );

        minimize_percentage_width = percent_diff_width * -1;
        minimize_percentage_height = percent_diff_height * -1;
        // Minimize the inches by percentage whichever is highter
        if (minimize_percentage_width < minimize_percentage_height) {
            minimize_percentage = minimize_percentage_height;
        } else {
            minimize_percentage = minimize_percentage_width;
        }

        current_design_values = alter_design_data(
                current_design_values,
                minimize_percentage
                );
    } else {
    }
    width_per_inch_pixel_count = boundingBoxWidth / maxWidthInches;

    height_per_inch_pixed_count = boundingBoxHeight / maxHeightInches;

    needed_width_px =
            current_design_values.image_width_inches * width_per_inch_pixel_count;

    current_width = element.width * element.scaleX;

    px_increase = needed_width_px - current_width;

    percent_increase = (px_increase / current_width) * 100;

    scale_increase = (element.scaleX / 100) * percent_increase;
    newScale = parseFloat(element.scaleX) + parseFloat(scale_increase);

    element.scaleX = newScale;
    element.scaleY = newScale;
    window.current_design_object = current_design_values;
    window.current_design_object.scale = newScale;

    // get positive values so *-1, here we get the percentage of bounding box
    //  percent_diff_width = get_percentage_increase(current_width,needed_width_px);
    window.current_design_object.zoom_percentage = '0';
    setInputValues(window.current_design_object);
    // pricesValidation("test","elementAdd");
}


function setInputValuesModify(percent) {
    h_inches_val = $('#height').val();
    w_inches_val = $('#width').val();
    dpi_inches_val = $('#dpi').val();

    new_h_inches_val =
            parseFloat(h_inches_val) + parseFloat((h_inches_val / 100) * percent);
    new_w_inches_val =
            parseFloat(w_inches_val) + parseFloat((w_inches_val / 100) * percent);
    new_dpi_inches_val =
            parseFloat(dpi_inches_val) -
            parseFloat((dpi_inches_val / 100) * percent);

    $('#width').val(new_w_inches_val);
    $('#height').val(new_h_inches_val);
    $('#dpi').val(new_dpi_inches_val);
}
function setInputValues(dvalues) {
    if (typeof dvalues.scale !== 'undefined') {
        swidth = dvalues.image_width_inches.toFixed(2);
        sheight = dvalues.image_height_inches.toFixed(2);
        $('#width').val(swidth);
        $('#height').val(sheight);
        $('#dpi').val(dvalues.res_y);
        ptval = $("input[name='printingOption']:checked").val();
        if(ptval=="vinyl_printing"){
            ptval=$("#print_type_dropdown").val();
        }
        $('#' + window.yourDesigner.currentViewIndex + '_printtype').val(ptval);
        // save form values
        $('#' + window.yourDesigner.currentViewIndex + '_width').val(swidth);
        $('#' + window.yourDesigner.currentViewIndex + '_width').val(swidth);

        $('#' + window.yourDesigner.currentViewIndex + '_height').val(sheight);
        $('#' + window.yourDesigner.currentViewIndex + '_dpi').val(
                dvalues.res_y
                );

        $('#' + window.yourDesigner.currentViewIndex + '_zoom_percentage').val(
                dvalues.zoom_percentage
                );
        getSelDesignsModal(window.yourDesigner.currentViewIndex, dvalues);

        printCostTotal = calculateTotalPrintCost();
        setBasePriceToSizes(printCostTotal);

    }
}
function alter_design_data(current_design_values, percent) {
    /*
     * Minimize the height and width of the design in inches with the given percentage value
     */
    min_val_width = (current_design_values.image_width_inches / 100) * percent;
    res_increase = (current_design_values.res_y / 100) * percent * 2;

    current_design_values.image_width_inches =
            current_design_values.image_width_inches - min_val_width;

    min_val_height =
            (current_design_values.image_height_inches / 100) * percent;
    current_design_values.image_height_inches =
            current_design_values.image_height_inches - min_val_height;

    current_design_values.res_y =
            parseInt(current_design_values.res_y) + parseInt(res_increase);
    current_design_values.res_x =
            parseInt(current_design_values.res_x) + parseInt(res_increase);

    window.current_design_object = current_design_values;

    return current_design_values;
}
function get_percentage_increase(number1, number2) {
    return ((number2 / number1 - 1) * 100).toFixed(2);
}







// For Modify a Design in a Mockup, the ElementModify function will trigger this function
function designElementModify(element) {

//     console.log("test");

    ptval = $("input[name='printingOption']:checked").val();
    incheswCheck = 'maxWidthInches' + ptval;
    incheshCheck = 'maxHeightInches' + ptval;
    //alert(JSON.stringify(window.current_design_object));
    if (element[incheswCheck]) {
        var maxWidthInches = element[incheswCheck];
        var maxHeightInches = element[incheshCheck];
    } else {
        var maxWidthInches = element.maxWidthInches;
        var maxHeightInches = element.maxHeightInches;
    }
    var boundingBoxWidth = element.boundingBox.width;
    var boundingBoxHeight = element.boundingBox.height;
    var currentScale = element.scaleX;
    if (
            typeof window.current_design_object !== 'undefined' &&
            typeof window.current_design_object.scale !== 'undefined'
            ) {
        newScal = element.scaleX;
        oldScal = window.current_design_object.scale;

        // get the width in pixels
        newScaleWidth = element.width * newScal;
        width_per_inch_pixel_count = boundingBoxWidth / maxWidthInches;
        newWidthInches = newScaleWidth / width_per_inch_pixel_count;
        $('#width').val(newWidthInches.toFixed(2));
        $('#' + window.yourDesigner.currentViewIndex + '_width').val(
                newWidthInches.toFixed(2)
                );
        // get Height in Pixels
        newScaleWidth = element.height * newScal;
        height_per_inch_pixel_count = boundingBoxHeight / maxHeightInches;
        newHeightInches = newScaleWidth / width_per_inch_pixel_count;
        $('#height').val(newHeightInches.toFixed(2));

        $('#' + window.yourDesigner.currentViewIndex + '_height').val(
                newHeightInches.toFixed(2)
                );

        // DPI
        de_vals = window.current_design_object;
        var initalw = de_vals.image_width_inches;
        resY = de_vals.res_y;
        per_inc = ((initalw - newWidthInches / initalw) * 100) / 100;

        newDpi = Math.round((resY * initalw) / newWidthInches);

        $('#dpi').val(newDpi);

        /*
         * Zoom calculation base on initial dpi, current dpi different
         */
        if ($('#zoom_percentage').length) {

            if (de_vals.scale < element.scaleX) {
                // size has been reduced
                reduction_percentage =
                        ((de_vals.scale - element.scaleX) / de_vals.scale) * 100 * -1;
                $('#zoom_percentage').val(reduction_percentage.toFixed(2));
                zpercent = reduction_percentage;
            } else {
                increase_percentage =
                        ((element.scaleX - de_vals.scale) / element.scaleX) * 100;
                $('#zoom_percentage').val(increase_percentage.toFixed(2));
                zpercent = increase_percentage;
            }
            $(
                    '#' + window.yourDesigner.currentViewIndex + '_zoom_percentage'
                    ).val(zpercent.toFixed(2));

        }

        /*
         * End
         */

        // DPI calc
        $('#' + window.yourDesigner.currentViewIndex + '_dpi').val(newDpi);

        // Design angle value
        $('#' + window.yourDesigner.currentViewIndex + '_design_angle').val(
                $('#design_angle').val()
                );
        dpi_quality(newDpi);

    } else {
    }

//     console.log("Topped : " + element.topped)
//     console.log("Z-Index : " + element.z)

//     console.log("test end")
}



function setViewFormValues(viewIndex) {
    $('#width')
            .val($('#' + viewIndex + '_width').val())
            .val();
    $('#height').val($('#' + viewIndex + '_height').val());
    $('#dpi').val($('#' + viewIndex + '_dpi').val());
    $('#design_angle').val($('#' + viewIndex + '_design_angle').val());
    $('#zoom_percentage').val($('#' + viewIndex + '_zoom_percentage').val());

    dpi_quality($('#dpi').val());
}



function dpi_quality(newDpi) {
    if (newDpi === '') {
        $('#print_quality').val('');
    } else if (newDpi < 150) {
        $('#print_quality').val('Bad');
    } else if (newDpi <= 300) {
        $('#print_quality').val('Good');
    } else {
        $('#print_quality').val('Excellent');
    }
}



function designElementModifyOld(element) {
    var maxWidthInches = element.maxWidthInches;
    var maxHeightInches = element.maxHeightInches;

    var previousWidthInInches = parseFloat(
            document.getElementById('width').value
            );
    var previousWidthInPixels = parseFloat(
            document.getElementById('image_width_in_px_temp').value
            );
    var previousHeightInInches = parseFloat(
            document.getElementById('height').value
            );
    var previousHeightInPixels = parseFloat(
            document.getElementById('image_height_in_px_temp').value
            );

    var initialScaleX = parseFloat(
            document.getElementById('initial_scale_x').value
            );
    var initialScaleY = parseFloat(
            document.getElementById('initial_scale_y').value
            );

    var modifiedScaleX = element.scaleX;
    var modifiedScaleY = element.scaleY;



    var new_width;

    if (modifiedScaleX < initialScaleX) {
        var percentageDifferenceX =
                ((initialScaleX - modifiedScaleX) / initialScaleX) * 100;
        new_width =
                previousWidthInInches -
                previousWidthInInches * (percentageDifferenceX / 100);
        // console.log('Modified Scale X is lesser than Initial Scale X');
    } else if (modifiedScaleX > initialScaleX) {
        var percentageDifferenceX =
                ((modifiedScaleX - initialScaleX) / initialScaleX) * 100;
        new_width =
                previousWidthInInches +
                previousWidthInInches * (percentageDifferenceX / 100);
        // console.log('Modified Scale X is higher than Initial Scale X');
    } else {
        new_width = previousWidthInInches;
        // console.log('Modified Scale X is equal to Initial Scale X');
    }

    // Ensure new_width does not exceed maxWidthInches
    if (new_width > maxWidthInches) {
        new_width = maxWidthInches;
    }

//     console.log('New Width:' + new_width);

    var new_height;

    if (modifiedScaleY < initialScaleY) {
        var percentageDifferenceY =
                ((initialScaleY - modifiedScaleY) / initialScaleY) * 100;
        new_height =
                previousHeightInInches -
                previousHeightInInches * (percentageDifferenceY / 100);
        // console.log('Modified Scale Y is lesser than Initial Scale Y');
    } else if (modifiedScaleY > initialScaleY) {
        var percentageDifferenceY =
                ((modifiedScaleY - initialScaleY) / initialScaleY) * 100;
        new_height =
                previousHeightInInches +
                previousHeightInInches * (percentageDifferenceY / 100);
        // console.log('Modified Scale Y is higher than Initial Scale Y');
    } else {
        new_height = previousHeightInInches;
        // console.log('Modified Scale Y is equal to Initial Scale Y');
    }

    // Ensure new_height does not exceed maxHeightInches
    if (new_height > maxHeightInches) {
        new_height = maxHeightInches;
    }

//     console.log('New Height:' + new_height);

    // Calculate DPI for width and height
    var newDPI = previousWidthInPixels / new_width;

//     console.log('DPI is :', newDPI);

    var new_width = Number(new_width);
    var new_height = Number(new_height);
    var newDPI = Number(newDPI);

    // Update values in the document
    document.getElementById('width').value = new_width.toFixed(2);
    document.getElementById('height').value = new_height.toFixed(2);
    document.getElementById('dpi').value = newDPI.toFixed(0);

    var objItem = {};

    objItem = {
        width: 4 * new_width.toFixed(2),
        height: 4 * new_height.toFixed(2),
        dpi: newDPI.toFixed(1),
    };
    getSelDesignsModalAfter(window.yourDesigner.currentViewIndex, objItem);
}


// Here We Update the height , Width Of the Image Size from As per the Input Values
function updateImageSizeFromInputs(value, from) {
    var element =
            window.yourDesigner.currentViewInstance.getElementByTitle('Design');
    var viewIndex = window.yourDesigner.currentViewIndex;

    ptval = $("input[name='printingOption']:checked").val();

    incheswCheck = 'maxWidthInches' + ptval;
    incheshCheck = 'maxHeightInches' + ptval;
    if (element[incheswCheck]) {
        var maxWidth = element[incheswCheck];
        var maxHeight = element[incheshCheck];
    } else {
        var maxWidth = element.maxWidthInches;
        var maxHeight = element.maxHeightInches;
    }

    var oldScaleX = element.scaleX;
    var newWidthInches = parseFloat($('#width').val());
    var newHeightInches = parseFloat($('#height').val());
    var oldWidth = $('#' + viewIndex + '_width').val();
    var oldHeight = $('#' + viewIndex + '_height').val();

    var defaultScaledWidth = element.getScaledWidth();
    var defaultScaledHeight = element.getScaledHeight();
    if (
            isNaN(newWidthInches) ||
            isNaN(newHeightInches) ||
            newWidthInches < 0.1 ||
            newHeightInches < 0.1
            ) {
        showToast(`Please enter valid values`, 'danger', 4000);
        return;
    }

    if (
            isNaN(newWidthInches) ||
            newWidthInches > maxWidth ||
            isNaN(newHeightInches) ||
            newHeightInches > maxHeight ||
            newWidthInches < 0.1 ||
            newHeightInches < 0.1
            ) {
        showToast(
                `Please enter width below ${maxWidth} and height below ${maxHeight}.`,
                'danger',
                4000
                );
        $('#width').val(oldWidth);
        $('#height').val(oldHeight);
        return;
    } else {
        var widthPercentageDiff =
                ((newWidthInches - oldWidth) / oldWidth) * 100;
        var heightPercentageDiff =
                ((newHeightInches - oldHeight) / oldHeight) * 100;
        if (widthPercentageDiff == 0) {
            percent_val = heightPercentageDiff;
        } else {
            percent_val = widthPercentageDiff;
        }
        if (percent_val == 0) {
            return;
        }

        var resWidth = (defaultScaledWidth * percent_val) / 100;
        var resHeight = (defaultScaledHeight * percent_val) / 100;

        resWidth = resWidth + defaultScaledWidth;
        resHeight = resHeight + defaultScaledHeight;

        if (
                resWidth > element.boundingBox.width ||
                resHeight > element.boundingBox.height
                ) {
            showToast(
                    `Height/Width is not suitable for the design's aspect ratio`,
                    'danger',
                    4000
                    );
            $('#height').val(oldHeight);
            $('#width').val(oldWidth);
            return;
        }

        var diffScaleWidth = oldScaleX * (widthPercentageDiff / 100);
        var diffScaleHeight = oldScaleX * (heightPercentageDiff / 100);

        if (from == 'width') {
            newScaleValue = oldScaleX + diffScaleWidth;
        } else {
            newScaleValue = oldScaleX + diffScaleHeight;
        }

        element.scaleX = newScaleValue;
        element.scaleY = newScaleValue;

        $('#width').val(newWidthInches);
        $('#height').val(newHeightInches);

        $('#' + viewIndex + '_width').val(newWidthInches);
        $('#' + viewIndex + '_height').val(newHeightInches);

        window.yourDesigner.currentViewInstance.stage.renderAll();

        designElementModify(element);
    }
}



$(document).ready(function () {
    $('body').on('click', '.fpd-tool-remove', function () {
        // console.log('Yessss');
    });
    $('#width').on('change', function () {
        
           pcst = calculateTotalPrintCost();
                setBasePriceToSizes(pcst);
        var newWidth = $(this).val();
        updateImageSizeFromInputs(newWidth, 'width');
    });

    $('#height').on('change', function () {
        
           pcst = calculateTotalPrintCost();
                setBasePriceToSizes(pcst);
        var newHeight = $(this).val();
        updateImageSizeFromInputs(newHeight, 'height');
    });
}); 