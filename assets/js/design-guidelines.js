$(document).ready(function () {


    $("#design_guidelines").on("click", function () {

        $(".design-guideline").html("No Data Found");
        // Access the first object in the first array
        const qfirstObject = window.mockupJsonData[0][0];
        const keyToFind = 'design_guideline';

        // Check if the key exists in the object
        if (keyToFind in qfirstObject) {
            const designGuideline = qfirstObject[keyToFind];
            // Call the function with the design_guideline object
            $(".design-guideline").html(formatDesignGuideline(designGuideline));
        } else {
            console.log('design_guideline key not found');
        }
        
        // Add title
         if ("mockup_name" in qfirstObject) {
            $("#mockup_product_name").html(qfirstObject["mockup_name"]);
        } 
        // End
    });


});


function formatDesignGuideline(designGuideline) {
    let html = '';

    // Iterate over the object keys
    for (const key in designGuideline) {
        if (designGuideline.hasOwnProperty(key)) {
            const value = designGuideline[key];

            if (key === 'link') {
                // Check if the value is a valid URL
                if (isValidUrl(value)) {
                    html += `<h6 class="p-1"><a href="${escapeHtml(value)}" target="_blank">Click to know more</a></h6>`;
                }
            } else {
                // Format other key-value pairs
                html += `<h6 class="p-1">${escapeHtml(key + " . " + value)}</h6>`;
            }
        }
    }

    return html;
}

// Helper function to validate URL (similar to FILTER_VALIDATE_URL)
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Helper function to escape HTML (similar to htmlspecialchars)
function escapeHtml(str) {
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, match => htmlEntities[match]);
}