// Updated loadColors function returning a Promise
function loadColors(mockupId) {
    return new Promise((resolve, reject) => {
        const colorsPath = `${base_url}assetsroot/admin/mockups/${mockupId}/colors.json?=2`;

        $.ajax({
            url: colorsPath,
            type: 'GET',
            dataType: 'json',
            success: function(colorDetails) {
                let html = '<div class="col colors">';

                $.each(colorDetails, function(index, colorDetail) {
                    const additionalClass = (colorDetail.color_id === '1') ? 'color-button-white' : '';
                    html += `
                        <button type="button"
                                bg-color="${colorDetail.color_code}"
                                bg-color-id="${colorDetail.color_id}"
                                bg-color-name="${colorDetail.color_name}"
                                style="background-color: ${colorDetail.color_code};"
                                class="color-button ${additionalClass}"
                                data-bs-toggle="tooltip" 
                                data-bs-placement="bottom"
                                title="${colorDetail.color_name}">
                        </button>
                    `;
                });

                html += '</div>';
                
                // Update DOM and resolve after
                $('#colors-container').html(html);
                 $("#ord_color").val(colorDetails[0].color_id);
                $('[data-bs-toggle="tooltip"]').tooltip();
                resolve(); // Resolve after DOM update and tooltip initialization
            },
            error: function(xhr, status, error) {
                console.error('Error loading colors:', error);
                reject(error); // Reject on failure
            }
        });
    });
}