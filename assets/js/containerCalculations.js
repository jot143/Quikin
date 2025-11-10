document.addEventListener('DOMContentLoaded', function () {
    var infoIcon = document.querySelector('.info-icon');
    var popover = new bootstrap.Popover(infoIcon, {
        trigger: 'manual',
        html: true,
        content: function () {
            return document.getElementById('product_cost_container').innerHTML;
        }
    });

    // Show popover on mouse enter
    infoIcon.addEventListener('mouseenter', function () {
        popover.show();
        $('.popover-body').html(document.getElementById('product_cost_container').innerHTML);

    });

    // Hide popover on mouse leave
    infoIcon.addEventListener('mouseleave', function () {
        popover.hide();
    });



    // Update the Quantity
    window.updateQuantity = function (quantity) {
        $('#tooltip_quantity').html(quantity);
        updateTotalAmountInTooltip();
    }

    // Update the Product cost
    window.updateProductCost = function (from, product_cost, gst_cost) {
        product_cost = product_cost * $('#tooltip_quantity').html();
        gst_cost = gst_cost * $('#tooltip_quantity').html();
        $("#product_cost").html(product_cost.toFixed(2));
        $("#price").html(product_cost.toFixed(2)); // Out Of Tooltip
        $("#gst_cost").html(gst_cost.toFixed(2));
        updateTotalAmountInTooltip();
    };


    // Update the Printing Cost
    window.updateProductPrintingCost = function (printing_cost, gst_cost) {

        $("#printing_cost").html(printing_cost);
        $("#gst_cost").html(gst_cost);
        updateTotalAmountInTooltip();

    };


    // When Plain Order Enables Calucalte the values for it
    window.updatePlainProductCost = function (product_cost, handling_cost, plain_prod_gst,
            final_plain_amount) {
        $("#product_cost").html(product_cost.toFixed(2));
        $("#handling_cost").html(handling_cost.toFixed(2));
        $("#gst_cost").html(plain_prod_gst.toFixed(2));
        $("#total_amt").html(final_plain_amount.toFixed(2));
        $("#price").val(final_plain_amount.toFixed(2));
    }

    // Update the Total Amount
    window.updateTotalAmountInTooltip = function () {
        var product_quantity = parseFloat($("#product-quantity").html()) || 0;
        var product_cost = parseFloat($("#product_cost").html());
        var printing_cost = parseFloat($("#printing_cost").html()) || 0;
        var gst_cost = parseFloat($("#gst_cost").html()) || 0;

        var total = product_cost + printing_cost + gst_cost;
        if (!total) {
            total = product_cost;
        }
        $("#price").val(total.toFixed(2));
        $("#total_amt").html(total.toFixed(2));
    };


    updateTotalAmountInTooltip();



});