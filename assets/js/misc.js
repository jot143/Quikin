$(document).ready(function () {

    $('.mcontainer ').on('change', '#bcolor', function () {

         const inputColor = $(this).val().toUpperCase();

         setMockUpBackGround(inputColor);

         const button = document.querySelector('.pcr-button');
         if (button) {
             // Set --pcr-color and background-color with !important
             button.style.setProperty('--pcr-color', inputColor, 'important');
             button.style.setProperty('background-color', inputColor, 'important');
         }
        

    });


    // For Get the HTML content in the Quill editor from JSON File
    //  htmlContent = `<?php echo $product_contents ?>`;

    //  quill.clipboard.dangerouslyPasteHTML(htmlContent);

    // For Save The Edited Content To Div


});

function addSelectedColorsToDefaultColor(colorId, colorName) {

    const $dropdown = $('#defaultColorDropdown'); // Default Color Dropdown

    if ($dropdown.find(`option[value="${colorId}"]`).length) {
        $dropdown.find(`option[value="${colorId}"]`).remove();
    } else {
        $dropdown.append(`<option value="${colorId}">${colorName}</option>`);
    }
} 




function initPickr() {
    const $el = $('.color-picker');

    // Check if the element exists and hasn't been initialized
    if ($el.length && !$el.data('pickr-initialized')) {
        // Mark the element as initialized
        $el.data('pickr-initialized', true);

        // Initialize Pickr
        const pickr = new Pickr({
            el: '.color-picker',
            container: 'body',
            theme: 'classic',
            closeOnScroll: false,
            lockOpacity: true,
            outputPrecision: 0,
            comparison: true,
            default: '#FAF7F3',
            swatches: null,
            defaultRepresentation: 'HEX',
            showAlways: false,
            closeWithKey: 'Escape',
            position: 'bottom-middle',
            adjustableNumbers: true,
            components: {
                palette: true,
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    cancel: false,
                    clear: false,
                    save: false
                }
            }
        });

        // Store the Pickr instance for potential cleanup
        $el.data('pickr-instance', pickr);

        // Handle color change event
        // pickr.on('change', (color, source, instance) => {
        //     const colorHex = color.toHEXA().toString();
        //     $("#bcolor").val(colorHex);

        //     console.log("Color is : " + colorHex);

        //     setMockUpBackGround(colorHex);
      
        // });
        pickr.on('change', (color, source, instance) => {
            const colorHex = color.toHEXA().toString();
        
            // Update your mockup or whatever needs it
            setMockUpBackGround(colorHex);
            $("#bcolor").val(colorHex);
        
            // Find the Pickr button
            const button = document.querySelector('.pcr-button');
            if (button) {
                // Set --pcr-color and background-color with !important
                button.style.setProperty('--pcr-color', colorHex, 'important');
                button.style.setProperty('background-color', colorHex, 'important');
            }
        
      
        });
        
    }
}


//  function  setMockUpBackGround(colorHex) {
//      let background_obj = yourDesigner.getElementByTitle('QikinkBackground');
//      let tParam = {fill: colorHex};
//      console.log("Background Object is : " + background_obj );
//      if (!background_obj) {
//         console.error('Shirt element not found in the design.');
//          return;
//     }
//      yourDesigner.setElementParameters(tParam,background_obj);
//  }


function setMockUpBackGround(colorHex) {
    const allElements = yourDesigner.getElements(); 


    allElements.forEach((el, index) => {
        if (el.title === 'QikinkBackground') {
            yourDesigner.setElementParameters({ fill: colorHex }, el);
        }
    });
} 






function updateRightSideContainerClass(className) { 

    $.ajax({
        // url: baseUrl + 'aoplist.txt',
        url : baseUrl + `/assetsroot/admin/mockups/aop_products_list.txt`,
        type: 'GET',
        dataType: 'text',
        success: function(data) {
            // Split the comma-separated IDs and trim whitespace
            const mockupIds = data.split(',').map(id => id.trim());
            
            // Check if window.mockup_id exists in the list
            const isIdPresent = mockupIds.includes(window.mockup_id);
            
            // Add or remove the class based on presence
          // Add or remove the class based on presence
          if (isIdPresent) {
            $('.rightsidecontainer').addClass(className);
            $('.aop_products_hide').addClass('hidden-div');
        } else {
            $('.rightsidecontainer').removeClass(className);
            $('.aop_products_hide').removeClass('hidden-div');
        }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to load aoplist.txt:', textStatus);
            // Optionally remove the class on error
            $('.rightsidecontainer').removeClass(className);
            $('.aop_products_hide').removeClass('hidden-div');
        }
    });
}
