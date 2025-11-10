// Updated populatePrintingOptions function returning a Promise
function populatePrintingOptions(mockupId) {
    return new Promise((resolve, reject) => {
        const jsonPath = baseUrl+`/assetsroot/admin/mockups/${mockupId}/print-types.json`;

        $.ajax({
            url: jsonPath,
            method: 'GET',
            dataType: 'json',
            success: function(printTypeDetails) {
                const $container = $('.printing_options_menu');
                $container.empty();

                let processedIds = [];
                let isVinylPrinting = false;
                let generalOptionsHtml = '';
                let vinylOptionsHtml = '';

                printTypeDetails.forEach(function(printDetail, index) {
                    if(printDetail.print_type_id !=="4" && printDetail.print_type_id !=="8")
                    {
                    if (!processedIds.includes(printDetail.print_type_id)) {
                        processedIds.push(printDetail.print_type_id);

                        if (printDetail.group !== 'vinyl') {
                            let displayName = printDetail.print_type;
                            if (printDetail.print_type_id === '1') {
                                displayName = 'DTG Printing';
                            } else if (printDetail.print_type_id === '17') {
                                displayName = 'DTF Printing';
                            }

                            const isChecked = index === 0 ? 'checked' : '';
                            generalOptionsHtml += `
                                <div class="col-12 col-sm-6 col-md-12 col-lg-12 col-xl-12 d-flex">
                                    <div class="form-check">
                                        <input type="radio" 
                                               class="form-check-input printingOption" 
                                               id="printingOption_${index}" 
                                               name="printingOption" 
                                               value="${printDetail.print_type_id}" 
                                               onchange="getPrintTypeVal(window.yourDesigner.currentViewIndex, ${printDetail.print_type_id})"
                                               ${isChecked}>
                                        <label class="form-check-label" 
                                               for="printingOption_${index}">${displayName}</label>
                                    </div>
                                </div>
                            `;
                        } else {
                            isVinylPrinting = true;
                            vinylOptionsHtml += `
                                <option class="printingOption" value="${printDetail.print_type_id}">
                                    ${printDetail.print_type}
                                </option>
                            `;
                        }
                    }
            }
                });

                let vinylRadioHtml = '';
                if (isVinylPrinting) {
                    vinylRadioHtml = `
                        <div class="col-12 col-sm-6 col-md-12 col-lg-12 col-xl-12 d-flex">
                            <div class="form-check">
                                <input type="radio" 
                                       class="form-check-input printingOption" 
                                       id="printingOption_vinyl" 
                                       name="printingOption" 
                                       value="vinyl_printing">
                                <label class="form-check-label" 
                                       for="printingOption_vinyl">Vinyl Printing</label>
                            </div>
                        </div>
                    `;
                }

                let html = `
                    <div class="row design-row printing_options_menu design-related mt-2 mb-2">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 mt-2 ms-3">
                            <label class="form-label">Printing Options</label>
                        </div>
                        <div class="col-12 col-lg-12 col-md-12 col-sm-12 col-xl-12 radioDiv d-flex">
                            <div class="row">
                                ${generalOptionsHtml}
                                ${vinylRadioHtml}
                            </div>
                        </div>
                `;

                if (isVinylPrinting) {
                    html += `
                        <div class="col-12 col-lg-12 col-md-12 mb-2" id="vinyl_printing_options" style="display: none;">
                            <div class="row">
                                <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6 d-none d-sm-block d-md-none d-lg-block d-xl-none d-xxl-none">
                                    <label class="form-label ms-3 mt-2" for="print_type_dropdown">Vinyl Printing Options</label>
                                </div>
                                <div class="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-12 col-xxl-12">
                                    <select class="form-select custom-select ms-3" 
                                            name="print_type_dropdown" 
                                            id="print_type_dropdown" 
                                            onchange="getPrintTypeVal(window.yourDesigner.currentViewIndex, this.value)">
                                        <option value="">Select Vinyl</option>
                                        ${vinylOptionsHtml}
                                    </select>
                                </div>
                            </div>
                        </div>
                    `;
                }

                html += `</div>`;
                $container.html(html);

                // Add event listener after DOM update
                $('input[name="printingOption"]').on('change', function() {
                    if ($(this).val() === 'vinyl_printing') {
                        $('#vinyl_printing_options').show();
                    } else {
                        $('#vinyl_printing_options').hide();
                    }
                });

                // Resolve the Promise after DOM update and event binding
                resolve();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching print-types.json:', error);
                const $container = $('.printing_options_menu');
                $container.html('<p>Error loading printing options.</p>');
                reject(error); // Reject on failure
            }
        });
    });
}