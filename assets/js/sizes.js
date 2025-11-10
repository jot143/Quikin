// Updated loadSizes function returning a Promise
function loadSizes(id) {
    return new Promise((resolve, reject) => { 

        const sizesPath = `${base_url}assetsroot/admin/mockups/${id}/sizes.json?v=4`;
        const pricesPath = `${base_url}assetsroot/admin/mockups/${id}/prices.json`;

        $.when(
            $.ajax({
                url: sizesPath,
                type: 'GET',
                dataType: 'json',
            }),
            $.ajax({
                url: pricesPath,
                type: 'GET',
                dataType: 'json',
            })
        )
            .done(function (sizesResponse, pricesResponse) {
                //   window.prices_json=pricesResponse;
                const sizeDetails = sizesResponse[0];
                const priceDetails = pricesResponse[0];

                // const selectedColorId = $('.colors .selected').first().attr('bg-color-id') || '1';
                const selectedColorId =
                    $('.colors button').first().attr('bg-color-id') || '1';

                let html = '';
                const uniqueSizes = {};
                let colorisSize = false;
                $.each(sizeDetails, function (index, sizeDetail) {
                    if (sizeDetail.size_color_code &&sizeDetail.size_color_code !== '') {
                        colorisSize = true;
                    } else {
                        colorisSize = false;
                    }

                    const sizeId = sizeDetail.size_id;
                    let sColorCode = sizeDetail.size_color_code;
                    if (!uniqueSizes[sizeId]) {
                        uniqueSizes[sizeId] = true;

                        const priceKey = `${sizeId}_${selectedColorId}`;
                        const basePrice = priceDetails[priceKey]
                            ? priceDetails[priceKey].base_price
                            : 'N/A';
                        const qtax_rate_product = priceDetails[priceKey]
                            ? priceDetails[priceKey].tax_rate_product
                            : '5';

                        // test
                        // const shippingPrice = priceDetails[priceKey] ? priceDetails[priceKey].shipping_price : 'N/A';
                        const shippingPrice = 63.75;
                        // test end

                        html += `
                    <div class="mb-3 each-button dynamic-button">
                    <button class="size-button" type="button"
                            style="min-width: 50px;"
                            id="${sizeId}"
                            bg-size-color="${sColorCode}"
              
                            bg-size-id="${sizeId}"
                            data-input-id="${sizeId}_input_price" 
                            data-bs-toggle="tooltip" 
                            data-bs-placement="bottom" 
                            data-bs-original-title="">
                        ${sizeDetail.size_name}
                        <p class="pb-1 basePricePerSize"
                           data-price="${basePrice}" 
                           data-shipping-price="${shippingPrice}" 
                           data-producttax="${qtax_rate_product}" 
                           data-handling="0"
                           data-updated-price="${0}"
                           >₹ ${basePrice}</p>
                    </button>
                    <input type="text" 
                           style="font-size:12px; text-align:center; min-width:50px !important;"
                           name="${sizeId}_input_price"
                           id="${sizeId}_input_price"
                           class="input-price-per-size mt-1" 
                           placeholder="₹">

                           

                    <input type="hidden" 
                           style="font-size:12px; text-align:center"
                           name="${sizeId}_input_price_base_price"
                           id="${sizeId}_input_price_base_price"
                           class="input-price-per-size mt-1" 
                           placeholder="₹" value="${basePrice}">

                </div>
                    `;
                    }
                }); 

                
                if (colorisSize) {
                    $('.choose_color_menu').addClass('d-none');
                    $('.choose_color_menu').addClass('colorissize');
                } else {
                    if ($('.choose_color_menu').hasClass('d-none')) {
                        $('.choose_color_menu').removeClass('d-none');
                    }
                    if ($('.choose_color_menu').hasClass('colorissize')) {
                        $('.choose_color_menu').removeClass('colorissize');
                    }
                }
                // Update DOM and resolve only after it's done
                $('.size-buttons .dynamic-button').remove();
                $('.size-buttons').append(html);


                document.querySelectorAll('.each-button').forEach(el => {

                    const button = el.querySelector('.size-button');
                    const input = el.querySelector('.input-price-per-size');
                    if (button && input) {
                        const buttonWidth = button.offsetWidth;
                        input.style.width = `${buttonWidth}px`;
                    }
                });



                resolve(); // Resolve the Promise after DOM update
            })
            .fail(function (xhr, status, error) {
                console.error('Error loading sizes or prices:', error);
                reject(error); // Reject on failure
            });
    });
} 



$(document).on('mouseleave', '.size-button', function () {
    let tooltip = bootstrap.Tooltip.getInstance(this);
    if (tooltip) {
        tooltip.hide();
    }
    
});


