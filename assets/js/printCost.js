function calculateTotalPrintCost() {
    let totalCost = 0.0;
    const maxDesigns = 10; // Maximum number of designs based on your HTML

    // Loop through all possible design indices (0 to 5)
    for (let i = 0; i < maxDesigns; i++) {
        // Get design ID
        const designId = $(`#${i}_designid`).val();

        // Check if there's a design (not empty and not "0")
        if (designId && designId !== "0") {
            // Get the required values
            const width = parseFloat($(`#${i}_width`).val()) || 0;
            const height = parseFloat($(`#${i}_height`).val()) || 0;
            const printType = $(`#${i}_printtype`).val() || "0"; // Default to "0" if empty
            const placement = $(`#${i}_placement`).val();

            // Calculate cost for this design
            const cost = calculatePrintCost(printType, placement, height, width);
            totalCost += cost;
        }
    }

    return totalCost;
}

// Include the previous calculatePrintCost function
function calculatePrintCost(printTypeId, placement, height, width) { 
    /*
     * Get color based price
     */
    var multiSelectedColors = $("#multiSelectedColors").val();

    // Split the string into an array and get the last element
    var valuesArray = multiSelectedColors.split(",");
    var qcolorid = valuesArray[valuesArray.length - 1];

    if (height < 0.2 || width < 0.2) {
        return 0.0;
    }

    if (typeof window.print_cost_json === 'undefined' || window.print_cost_json === null) {
        return 0.0;
    }

    const printCosts = window.print_cost_json;

    if (!printCosts.hasOwnProperty(printTypeId)) {
        return 0.0;
    }

    
    // Here some placement will comes like "Left Pocket" so we remove the space bedween that
    placement = placement.replace(/\s+/g, ''); 
    
    if (!printCosts[printTypeId].hasOwnProperty(placement + qcolorid)) {
        if (!printCosts[printTypeId].hasOwnProperty(placement)) {
            return 0.0;
        }
    } else {
        placement = placement + qcolorid;
    }

    const costData = printCosts[printTypeId][placement];
    let pricePerInch = costData.price_per_inch;
    let minPrice = costData.min_price;

    if(printTypeId == '1' && qcolorid == '1'){
        pricePerInch = 0.50;
        minPrice = 50;
        if(placement != "Front" && placement != "Back" ){
            minPrice = 40;
        }
    }

    const area = height * width;
    const calculatedCost = area * pricePerInch;

    qprintCost=Math.max(calculatedCost, minPrice);
    $("#printing_cost_total").val(qprintCost);
  
    return qprintCost;
} 


// Example usage with jQuery
$(document).ready(function () { 
    // Calculate on button click


    // Or calculate whenever a value changes
    $('#inputForm').on('change', ".resettable_fields input", function () {

        calculateTotalPrintCost();

    });
});