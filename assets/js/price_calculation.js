// Here We Get the Prices.JSON File
priceDetails = window.prices_json;
print_cost_json = window.print_cost;

var printing_cost;
var gst_cost;
var product_cost;

// Here We Do a Price Calculations AS Per the Sizes & Colors
function pricesValidation(value, from) {
    var osize = $("#ord_size").val();
    var ocolor = $("#ord_color").val();
    var quantity = $("#product-quantity").val();
    var radioChecked = $("input[name='printingOption']:checked").val();

    // For by Default select the First Print Type Option
    if (!radioChecked) {
        $("input[name='printingOption']").first().prop("checked", true);
        $("input[name='printingOption']").first().trigger("change");
        radioChecked = $("input[name='printingOption']:checked").val();
        getValueAsPerPrintType(radioChecked);
    }

    if (!osize || isNaN(osize)) {
        osize = $("button[bg-size-id]").first().attr("id");
    }

    if (!ocolor || isNaN(osize)) {
        ocolor = $("button[bg-color-id]").first().attr("bg-color-id");
    }

    // For Update in the tooltip Quantity every time changes
    updateQuantity(quantity);

    // Here We Set Value to the Price Input
    // console.log(window.prices_json);
    if (typeof window.prices_json[osize + "_" + ocolor] !== "undefined") {
        var priceObj = window.prices_json[osize + "_" + ocolor];
        $("#price").val(priceObj.base_price);
    } else {

        if(window.mockup_id != 102){
        showToast(
                "This Size & Color Combination Currently Not Available",
                "danger",
                4000
                );
        return;

        }
    }

    // Here We Write a Calucation for Price Tooltip
    if (typeof window.prices_json[osize + "_" + ocolor] !== "undefined") {
        var priceObj = window.prices_json[osize + "_" + ocolor];

        product_cost = parseFloat(priceObj.base_price);
        var tax_rate_product = priceObj.tax_rate_product;

        gst_cost = (priceObj.base_price / 100) * parseFloat(tax_rate_product);
        gst_cost = gst_cost + parseFloat(tax_rate_product);

        updateProductCost(from, product_cost.toFixed(2), gst_cost.toFixed(2));
    }

    let isRadioChecked = $("input[name='printingOption']:checked").val();
    if (isRadioChecked) {

        setTimeout(() => {
        getValueAsPerPrintType(isRadioChecked);

        },0);
    }
} 

// Here We set the Printing Cost to the Tooltip
function getValueAsPerPrintType(print_type_id) { 
    if (window.print_cost_json ) {
        

        if(window.yourDesigner.currentViewInstance.title){
            // console.log("currentPlacementRaw = window.yourDesigner.currentViewInstance.title");
            // console.log(currentPlacementRaw = window.yourDesigner.currentViewInstance.title)
           currentPlacementRaw = window.yourDesigner.currentViewInstance.title;
        }else{
            currentPlacementRaw = "Front";
        }
        // currentPlacementRaw = window.yourDesigner.currentViewInstance.title;

        currentPlacement = currentPlacementRaw.replace(/ /g, "");
        var temp = window.print_cost_json[print_type_id];
        if (print_type_id === "vinyl_printing") {
            temp = window.print_cost_json[$("#print_type_dropdown").val()];
        }

        const placementData = temp[currentPlacement];

        var pricePerInch = placementData.price_per_inch;


        var minPrice = placementData.min_price;

        if ($("#ord_color").val() == 1 && print_type_id == 1) {
            var pricePerInch = 0.50;


            var minPrice = 50;
        }

        var updatedWidth = $("#width").val();
        var updatedHeight = $("#height").val();

        printing_cost = updatedWidth * updatedHeight * pricePerInch;

        // test
        // Apply the minimum price
        if (printing_cost < minPrice && printing_cost !== 0) {
            printing_cost = minPrice;


        }
     if (window.isCreateProduct !== 3) {
            printing_cost = printing_cost * $('#product-quantity').val();
        }
    }



    printing_cost_other = getOtherPlacementPrintingCost();

    printing_cost = parseFloat(printing_cost) + parseFloat(printing_cost_other);

    var osize = $("#ord_size").val();
    var ocolor = $("#ord_color").val();

    if (typeof window.prices_json[osize + "_" + ocolor] !== "undefined") {
        var priceObj = window.prices_json[osize + "_" + ocolor];

        product_cost = parseFloat(priceObj.base_price);
        var tax_rate_product = priceObj.tax_rate_product;

        tax_rate = (priceObj.base_price / 100) * parseFloat(tax_rate_product);

        if (printing_cost > 0) {
            gst_cost = (printing_cost / 100) * tax_rate_product;
        } else {
            gst_cost = 0;
        }
        // gst_cost = gst_cost * $("#product-quantity").val();
        gst_cost = gst_cost + (tax_rate * $('#product-quantity').val());



        updateProductPrintingCost(printing_cost.toFixed(2), gst_cost.toFixed(2));
    }
    //test end
}

// Here We get All Placement Total Values
function getOtherPlacementPrintingCost() {
    currentPlacementIndex = window.yourDesigner.currentViewIndex;
    var designJson = window.design_json;
    var keys = Object.keys(designJson);
    var placements_counts = keys.length;

    total_other_placement_cost = 0;
    for (i = 0; i < placements_counts; i++) {
        if (parseInt(currentPlacementIndex) !== parseInt(i)) {
            cprintTypeId = $("#" + currentPlacementIndex + "_printtype").val();

            if (cprintTypeId === 'vinyl_printing') {
                cprintTypeId = $("#print_type_dropdown").val();
            }

            if (!cprintTypeId || cprintTypeId === "" ) {
                cprintTypeId = $("input[name='printingOption']:checked").val();

            }

            json_cost = window.print_cost_json[cprintTypeId];

            cplacement = $("#" + i + "_placement").val();
            if (!cplacement) {
                cplacement = "-";
            }

            if (typeof json_cost[cplacement] !== "undefined") {
                cmin_price = json_cost[cplacement].min_price;

                price_per_inch = json_cost[cplacement].price_per_inch;

                if ($("#ord_color").val() == 1 && cprintTypeId == 1) {
                    var price_per_inch = 0.50;


                    var cmin_price = 50;
                }


                if (
                        typeof json_cost[cplacement] !== "undefined" &&
                        $("#" + i + "_width").val() > 0
                        ) {
                    printing_cost_other =
                            $("#" + i + "_width").val() *
                            $("#" + i + "_height").val() *
                            price_per_inch;

                    if (cmin_price > printing_cost_other) {

                        printing_cost_other = cmin_price;
                        if (window.isCreateProduct !== 3) {
                            printing_cost_other =
                                    printing_cost_other *
                                    $('#product-quantity').val();
                        }
                    } else {
                        if (window.isCreateProduct !== 3) {
                            printing_cost_other =
                                    printing_cost_other *
                                    $('#product-quantity').val();
                        }

                    }
                    total_other_placement_cost =
                            parseFloat(total_other_placement_cost) +
                            parseFloat(printing_cost_other);
                }
            } else {
                // cplacement not in json
            }
        }
    }

    //console.log(total_other_placement_cost);
    return total_other_placement_cost;
}

function reset_design_fields() {

    /*
     * This function is triggered whenever plan check box is checked, we reset all the design fields in hidden design fields
     * and also reset the height and width values in the view (#width,#height)
     */
    $(".resettable_fields input,#width,#height,#dpi").val("");
} 

// For Plian Product Enables
function setPriceForPlainProduct() {

    var osize = $("#ord_size").val();
    var ocolor = $("#ord_color").val();
    var quantity = $("#product-quantity").val();

    if (!osize || isNaN(osize)) {
        osize = 1;
    }
    if (!ocolor || isNaN(osize)) {
        ocolor = 1;
    }

    var quantity = $("#product-quantity").val();

    // Here We Write a Calucation for Price Tooltip
    if (typeof window.prices_json[osize + "_" + ocolor] !== "undefined") {
        var priceObj = window.prices_json[osize + "_" + ocolor];

        var product_cost = parseFloat(priceObj.base_price) * quantity;
        var gst_cost = (priceObj.base_price / 100) * priceObj.tax_rate_product;
        gst_cost = gst_cost * quantity;
        var handling_cost = 20; // By Default All Pproducts Handling Charge is  20 /-

        handling_cost = parseFloat(handling_cost) * quantity;
        var handling_cost_gst = (handling_cost / 100) * 18;

        var total_plain_gst = parseFloat(gst_cost) + handling_cost_gst;

        var final_plain_amount =
                parseFloat(total_plain_gst) +
                parseFloat(handling_cost) +
                parseFloat(product_cost);

        updatePlainProductCost(
                product_cost,
                handling_cost,
                total_plain_gst,
                final_plain_amount
                );
    }
}

// Here We set the Printing Cost to the Tooltip

// function getValueAsPerPrintTypeGrouping(print_type_id) {
//   if (window.print_cost_json) {

//     // want to write a loop for it to
//     // get all the design uploaded datas to process it
//     // like the saveMockupDesignOnServer function in custom.js file

//     print_cost_json.forEach((currentElement, index, array) => {

//       var temp = window.print_cost_json[index];
//       const currentElement = temp[currentElement];

//       var pricePerInch = currentElement.price_per_inch;
//       var minPrice = currentElement.min_price;

//       var updatedWidth = $("#width").val();
//       var updatedHeight = $("#height").val();
//       printing_cost = updatedWidth * updatedHeight * pricePerInch;

//       if (minPrice > printing_cost) {
//         printing_cost = minPrice;
//         printing_cost = printing_cost * $("#product-quantity").val();
//       }
//     })
//   }
//   updateProductPrintingCost(printing_cost.toFixed(2));
// }
