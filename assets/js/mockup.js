$(document).ready(function () {
    const qPrintPricePath = baseUrl + `/assetsroot/admin/mockups/print_cost.json`;
    async function getPrintCost() {
        try {
            const response = await fetch(qPrintPricePath);
            window.print_cost_json = await response.json();
        } catch (error) {
            console.error('Error fetching print cost:', error);
        }
    }
    // Call the function
    getPrintCost();
});

function checkVariantLimit(from, toastAlreadyShown = false) {

    var sizes = $('#multiSelectedSizes').val().split(',').map(Number);
    var colors = $('#multiSelectedColors').val().split(',').map(Number);

    if (from == 'sizes' || from == 'colors') {
        const variantCount = sizes.length * colors.length;
        var store_type = $('#store_type').val();
        if (store_type != 'woocommerce') {
            maxVariantLimit = 100
        } else {
            maxVariantLimit = 50
        }
        if (variantCount > maxVariantLimit) {
            if (!toastAlreadyShown) {
                showToast(
                        `Max ${from} limit Reached. (${maxVariantLimit} Variants)`,
                        'warning',
                        10000
                        );
            }
            return false;
        } else {
            console.log(`Max ${from} limit Still There. (${maxVariantLimit} Variants)`);
            return true;
        }
}

}

async function editProductNew(mockupId) {

    // const mockupId = $(element).data('mockup-id');

    // if (!mockupId) {
    //     // user may click on continue button
    //     mockupId = $('.card.selected').find('button').attr('data-mockup-id');
    // }
    const success = await initMockup(mockupId);

    /*
     * Add Consants
     */

    window.mockup_id = mockupId;

    /*
     * Reset tagd
     */

    $('#productTagsContainer').html('');

    /*
     * End reset
     */
    /*
     * End Constants
     */

    if (success) {

        //   await qresetDesigner();
        await initFpdQikink();
        initializeSwiper();
        initSwiperSlider();
        initQuill();
        initPickr();
        initDropZone();

        updateRightSideContainerClass('mockup2'); // For Hide Some Options in AOP Products
        loadProductContents(mockupId);
        loadDesginGuidlines();

        loadSelectedOptions();

        await initMockupScripts(mockupId);

        if (
                window.mockupJsonData[0][0] &&
                typeof window.mockupJsonData[0][0]['size_chart'] !== 'undefined'
                ) {
            $('.sizechartrow').removeClass('d-none');
            $('#size_chart_image').attr(
                    'src',
                    window.mockupJsonData[0][0]['size_chart']
                    );
        } else {
            $('.sizechartrow').addClass('d-none');
            $('#size_chart_image').attr('src', '');
        }

        $('#Continue').text('Save Product');
        $('#Continue').attr('data-current-page', 'mockup-create');

        $('#mockup_design_tab').tab('show');

        let mockup_full_name = window.mockupJsonData[0][0]['mockup_name'];
        let newName = mockup_full_name.split('|')[0].trim();

        $('#mockup_product_name').val(newName);

        if (window.mockup_id == 16 || mockupId == '16') { //For Color Coffee Mug - We will hide the default color selection select2
            $('.default_color_div').attr('style', 'display: none !important');
        } else {
            $('.default_color_div').attr('style', 'display: flex !important');
        }


    } else {
        console.error('Failed to initialize mockup data');
        document.getElementById('swiperWrapper').innerHTML =
                '<p>Error loading mockup</p>';
    }
}

function updateRightSideContainerClass(className) {
    $.ajax({
        // url: baseUrl + 'aoplist.txt',
        url: baseUrl + `assetsroot/admin/mockups/aop_products_list.txt`,
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            // Split the comma-separated IDs and trim whitespace
            const mockupIds = data.split(',').map((id) => id.trim());

            // Check if window.mockup_id exists in the list
            const isIdPresent = mockupIds.includes(window.mockup_id);

            // Add or remove the class based on presence
            if (isIdPresent) {
                $('.rightsidecontainer').addClass(className);
                $('.aop_products_hide').addClass('hidden-div');
            } else {
                $('.rightsidecontainer').removeClass(className);
                $('.aop_products_hide').removeClass('hidden-div');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Failed to load aoplist.txt:', textStatus);
            // Optionally remove the class on error
            $('.rightsidecontainer').removeClass(className);
            $('.aop_products_hide').removeClass('hidden-div');
        },
    });
}

// function updateRightSideContainerClass(className) {
//     $.ajax({
//         // url: baseUrl + 'aoplist.txt',
//         url: baseUrl + `/public/assets/admin/mockups/aop_products_list.txt`,
//         type: 'GET',
//         dataType: 'text',
//         success: function (data) {
//             console.log('Succes getting AOP_Products_List');
//             // Split the comma-separated IDs and trim whitespace
//             const mockupIds = data.split(',').map((id) => id.trim());

//             // Check if window.mockup_id exists in the list
//             const isIdPresent = mockupIds.includes(window.mockup_id);

//             // Add or remove the class based on presence
//             if (isIdPresent) {
//                 $('.rightsidecontainer').addClass(className);

//                 $('.aop_products_hide').addClass('d-none');

//             } else {
//                 $('.rightsidecontainer').removeClass(className);
//                 $('.aop_products_hide').removeClass('d-none');
//             }
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error('Failed to load aoplist.txt:', textStatus);
//             // Optionally remove the class on error
//             $('.rightsidecontainer').removeClass(className);
//             $('.aop_products_hide').removeClass('d-none');
//         },
//     });
// }

function loadDesginGuidlines() {
    const guideline = window.mockupJsonData[0][0].design_guideline;

    if (!guideline) {
        $('.design_guidelines').addClass('d-none'); // hides the div
    } else {
        $('.design_guidelines').removeClass('d-none'); // shows the div
    }
}

function loadSelectedOptions() {
    window.allTags = []; // Erase previously added tags
    $('#defaultColorDropdown option').remove(); // Remove all previously selected colors in default dropdown

    $('#user_design_tab').addClass('active');
    $('#user_design_content').addClass('show active');

    // Deactivate the other tab
    $('#user_product_details_tab').removeClass('active');
    $('#user_products_content').removeClass('show active');

    // Disable plain product option
    $('#plain_order_check').prop('checked', false);

    // Disable size chart option
    $('#enable-size-chart').prop('checked', false);

    // Set Default Mockup Product Name
    let mockup_full_name = window.mockupJsonData[0][0]['mockup_name'];
    let newName = mockup_full_name.split('|')[0].trim();
    $('#mockup_product_name').val(newName);

    // For Set Background Color None
    $('#bcolor').val('');
}

// window.loadSelectedOptions = function () {
//     window.allTags = []; // Erase previously added tags
//     $('#defaultColorDropdown option').remove(); // Remove all previously selected colors in default dropdown

//     $('#user_design_tab').addClass('active');
//     $('#user_design_content').addClass('show active');

//     // Deactivate the other tab
//     $('#user_product_details_tab').removeClass('active');
//     $('#user_products_content').removeClass('show active');

//     // Disable plain product option
//     $('#plain_order_check').prop('checked', false);

//     // Disable size chart option
//     $('#enable-size-chart').prop('checked', false);

//     // Set Default Mockup Product Name
//     let mockup_full_name = window.mockupJsonData[0][0]['mockup_name'];
//     let newName = mockup_full_name.split('|')[0].trim();
//     $('#mockup_product_name').val(newName);

// };

async function initMockup(mockupId) {
    if (!mockupId) {
        console.error('No mockupId provided');
        return false;
    }

    const timestamp = Date.now();
    // Construct the JSON file path
    const jsonFilePath =
            baseUrl + `/assetsroot/admin/mockups/${mockupId}/${mockupId}.json?v=${timestamp}`;
    const jsonDesignPath =
            baseUrl + `/assetsroot/admin/mockups/${mockupId}/${mockupId}_design.json?v=${timestamp}`;
    const qPricePath =
            baseUrl + `/assetsroot/admin/mockups/${mockupId}/prices.json`;

    try {
        // Fetch the JSON file
        const response = await fetch(jsonFilePath);
        const responseDesign = await fetch(jsonDesignPath);
        const qPricesJson = await fetch(qPricePath);

        if (!response.ok) {
            throw new Error(`Failed to load JSON file: ${response.status}`);
        }
        const jsonData = await response.json();
        const jsonDesignData = await responseDesign.json();
        const jsonPriceData = await qPricesJson.json();
        // Store the data in a global window variable
        window.mockupJsonData = jsonData;
        window.prices_json = jsonPriceData;
        /*
         * get Shirt and shadow elements
         */

        eQikinkElementData = processJsonData(jsonData, [
            'Shirt',
            'ShadowFront',
        ]);
        window.ShirtElementSources = JSON.stringify(
                eQikinkElementData['Shirt']
                );
        window.shadowElementSources = JSON.stringify(
                eQikinkElementData['ShadowFront']
                );

        /*
         * ENd
         */
        window.design_json_static = jsonDesignData;
        window.design_json = window.design_json_static;
        window.constant_design_json = jsonDesignData;
        window.disableModifyValidation = false;
        if (
                typeof window.mockupJsonData[0][0]['disableModifyValidation'] !==
                'undefined' &&
                window.mockupJsonData[0][0]['disableModifyValidation']
                ) {
            window.disableModifyValidation = true;
        }
        /*
         * Hide plain if necessart
         */
        if (window.disableModifyValidation) {
            if (!$('.plain-option-row').hasClass('d-none')) {
                $('.plain-option-row').addClass('d-none');
                $('.aop_products_hide').addClass('d-none');
            }
        } else {
            if ($('.plain-option-row').hasClass('d-none')) {
                $('.plain-option-row').removeClass('d-none');
                $('.aop_products_hide').removeClass('d-none');
            }
        }
        return true;
    } catch (error) {
        console.error('Error in initMockup:', error);
        return false;
    }
}

function processJsonData(jsonData, elementTitles) {
    // Initialize result arrays
    const resultArrays = {};

    // Default titles if none provided
    const titlesToCheck = elementTitles || ['Shirt', 'ShadowFront'];

    // Initialize objects for each title
    titlesToCheck.forEach((title) => {
        resultArrays[title] = {};
    });

    // Process the data
    jsonData.forEach((placement, k) => {
        placement.forEach((elements, j) => {
            elements.elements.forEach((element, v) => {
                if (titlesToCheck.includes(element.title)) {
                    resultArrays[element.title][j] = element;
                }
            });
        });
    });

    return resultArrays;
}

// public/js/mockup.js
function initializeSwiper() {
    // Get the swiper-wrapper element
    const swiperWrapper = document.getElementById('swiperWrapper');

    // Check if window.mockupJsonData exists and has valid data
    if (!window.mockupJsonData || !window.mockupJsonData[0]) {
        swiperWrapper.innerHTML = '<p>No mockup data available</p>';
        return;
    }


    // Generate the HTML for swiper slides
    let htmlContent = '';
    Object.keys(window.mockupJsonData[0]).forEach((key) => {
        // Create a shallow copy of the section to avoid changing the original
        let originalSection = window.mockupJsonData[0][key];
        let section = {...originalSection};

        // Replace "Shoulder" with "Sleeve" in the copied title
        if (section.title.includes('Shoulder')) {
            section.title = section.title.replace('Shoulder', 'Sleeve');
        }






        // If Its AOP Product , Change the Left Packet Placement Name into Mockup for Show
        isAopProduct = false;
        if (
                window.mockupJsonData[0][0] &&
                typeof window.mockupJsonData[0][0]['isAopProduct'] !== 'undefined' &&
                window.mockupJsonData[0][0]['isAopProduct'] == true
                ) {
            isAopProduct = window.mockupJsonData[0][0]['isAopProduct'];
        }

        var mockup_name = window.mockupJsonData[0][0]['mockup_name'];
        if (mockup_name.toLowerCase().includes('aop') || isAopProduct) {
            if (section.title.includes('Left Pocket')) {
                section.title = section.title.replace('Left Pocket', 'Mockup');
            }
        }

        // Build the swiper-slide HTML
        htmlContent += `
            <div class="swiper-slide viewItemSelect" data-viewindex="${key}">
                <div class="swiper-content" style="margin-bottom:10px;">
                    <img src="${section.thumbnail}" class="img-responsive" height="81" width="81" />
                    <div class="center-al-carousel text-pos">${section.title}</div>
                </div>
            </div>
        `;
    });

    // Insert the generated HTML into the swiper-wrapper
    swiperWrapper.innerHTML = htmlContent;

    $('.viewItemSelect:first-of-type').addClass('viewSelected');
}




function initDropZone() {
    var dropzoneElement = document.querySelector('.dropzone');
    var dropzonePreviewNode = document.querySelector('#dropzone-preview-list');

    // Check if Dropzone is already attached to the element
    if (
            dropzoneElement &&
            Dropzone.instances.some(
                    (instance) => instance.element === dropzoneElement
            )
            ) {
        console.log(
                'Dropzone already attached to element, skipping initialization.'
                );
        return;
    }

    if (dropzonePreviewNode) {
        var previewTemplate = dropzonePreviewNode.parentNode.innerHTML;
        dropzonePreviewNode.parentNode.removeChild(dropzonePreviewNode);

        // Initialize Dropzone
        var dropzone = new Dropzone('.dropzone', {
            url: baseUrl + '/mockup-save-image',
            method: 'post',
            previewsContainer: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="X-CSRF-TOKEN"]').attr('content'),
            },
            accept: function (file, done) {
                const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                const extension = file.name.split('.').pop().toLowerCase();
                const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

                if (nameWithoutExtension.length > 15) {
                    done("Image name must be below 15 characters.");
                    return;
                }

                if (!validTypes.includes(file.type)) {
                    done("Only PNG, JPG, and JPEG files are allowed.");
                    return;
                }

                done();
            },
            init: function () {
                this.on('sending', function (file, xhr, formData) {
                    formData.append('field_name', 'file');
                    formData.append('save_path', 'designs');
                    var printtype = $(
                            'input[name="printingOption"]:checked'
                            ).val();
                    formData.append('printType', printtype);
                });

                this.on('addedfile', function (file) {
                    // console.log('File added:', file);
                    document.getElementById('loader').style.display = 'flex';
                });

                this.on('success', function (file, response) {
                    // console.log('File uploaded successfully:', file, response);
                    getImageData(1);
                });

                // this.on('error', function(file, response) {
                //     console.error('Error uploading file:', file, response);
                //     let errorMessage = typeof response === 'string' ? response : (response.message || 'Something Went Wrong.');
                //     console.error('Upload error:', errorMessage);
                //     showToast('Something Went Wrong.', 'danger', 3000);
                // });
                this.on('error', function (file, response) {
                    console.error('Error uploading file:', file, response);
                    let errorMessage = typeof response === 'string' ? response : (response.message || 'Something Went Wrong.');
                    console.error('Upload error:', errorMessage);
                    console.log(errorMessage);
                    if (errorMessage == 'Image name must be below 15 characters.') {
                        showToast(errorMessage, 'danger', 3000);
                    } else {
                        showToast('Something Went Wrong.', 'danger', 3000);
                    }

                });

                this.on('complete', function (file) {
                    console.log('File upload complete:', file);
                });
            },
        });
    }
}

async function initMockupScripts(mockupId) {
    // Validate inputs
    if (!mockupId) {
        console.error('Invalid or missing mockupId');
        return;
    }

    // Ensure baseUrl is defined
    const baseUrl = window.baseUrl || 'https://qikink.com'; // Fallback URL
    const productsListUrl = `${baseUrl}/assetsroot/admin/mockups/aop_products_list.txt`;

    try {
        // Fetch the AOP products list
        const response = await fetch(productsListUrl);
        if (!response.ok) {
            throw new Error(
                    `Failed to fetch AOP products list: ${response.status}`
                    );
        }

        const data = await response.text();
        const aopProducts = data.split(',').map((id) => id.trim());

        // Select the mcontainer element
        const mcontainer = document.querySelector('.rightsidecontainer');
        if (!mcontainer) {
            throw new Error('mcontainer element not found');
        }

        // Determine the base URL extension
        const baseUrlExtension = baseUrl.includes('https://qikink.com') ?
                'public' :
                '';

        // Toggle classes based on whether mockupId is in aopProducts
        const isAopProduct = aopProducts.includes(mockupId);
        mcontainer.classList.remove('mockup1', 'mockup2');
        mcontainer.classList.add(isAopProduct ? 'mockup2' : 'mockup1');

        // Load the mockup script
        const scriptUrl = `${baseUrl}${baseUrlExtension}/assets/createProduct/js/productMockup.js?v=125`;
        loadMockupScript(scriptUrl); // Assumes loadMockupScript returns a Promise
    } catch (error) {
        console.error('Error in initMockupScripts:', error);
        // Optional: Provide fallback or user feedback
        // e.g., display an error message to the user
    }
}

async function initMockupScriptsOld(mockupId) {
    // Load mockup js based on mockpId
    fetch(baseUrl + '/assetsroot/admin/mockups/aop_products_list.txt')
            .then((response) => response.text())
            .then((data) => {
                const aopProducts = data.split(',').map((id) => id.trim());

                // Select the mcontainer element and add the appropriate class
                const $mcontainer = $('.mcontainer');
                let baseUrlExtension = baseUrl.includes('https://qikink.com') ?
                        'public' :
                        '';
                if (aopProducts.includes(mockupId)) {
                    $mcontainer.removeClass('mockup1').addClass('mockup2');

                    loadMockupScript(
                            baseUrl +
                            baseUrlExtension +
                            '/assets/createProduct/js/productMockup.js?v=124'
                            );
                } else {
                    $mcontainer.removeClass('mockup2').addClass('mockup1');
                    loadMockupScript(
                            baseUrl +
                            baseUrlExtension +
                            '/assets/createProduct/js/productMockup.js?v=124'
                            );
                }
            })
            .catch((error) => {
                console.error('Error loading AOP products:', error);
            });
}

function initSwiperSlider() {
    const swiperElement = document.querySelector('.mySwiper');
    if (!swiperElement.swiper) {
        // Check if Swiper instance doesn't exist

        swidth = window.innerWidth;
        if (swidth > 767) {
            swiDir = 'vertical';
        } else {
            swiDir = 'horizontal';
        }

        var swiper = new Swiper('.mySwiper', {
            direction: swiDir,
            slidesPerView: 'auto',
            spaceBetween: 6,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            scrollbar: {
                el: '.swiper-scrollbar',
                hide: true,
            },
        });

        // For Pagination of the design list
        document
                .querySelector('.prev-button')
                .addEventListener('click', function () {
                    swiper.slidePrev();
                });

        // For next button for the Pagination of the design list
        document
                .querySelector('.next-button')
                .addEventListener('click', function () {
                    swiper.slideNext();
                });

        swiper.on('slideChange', function () {
            const prevButton = document.querySelector('.prev-button');
            const nextButton = document.querySelector('.next-button');
            if (swiper.isBeginning) {
                prevButton.classList.add('disabled');
            } else {
                prevButton.classList.remove('disabled');
            }

            if (swiper.isEnd) {
                nextButton.classList.add('disabled');
            } else {
                nextButton.classList.remove('disabled');
            }
        });
    }
}





function initQuill() {
    if (window.quill && document.querySelector('#editor .ql-editor')) {
        return; // Already initialized
    }

    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Enter description here...',
        modules: {
            toolbar: {
                container: [
                    [
                        {header: [1, 2, false]},
                        'bold',
                        'italic',
                        {align: ''},
                        {align: 'center'},
                        {align: 'right'},
                        {align: 'justify'},
                        {list: 'ordered'},
                        {list: 'bullet'},
                    ],
                ],
                handlers: {},
            },
        },
    });

    window.quill = quill;

    //  Only add the label if it doesn’t exist for this toolbar
    const toolbarContainer = document.querySelector('.ql-toolbar');
    if (
            toolbarContainer &&
            !toolbarContainer.querySelector('.pickr-description')
            ) {
        const title = document.createElement('p');
        title.className = 'pickr-description';
        title.innerText = 'Description';
        title.style.fontFamily = 'amazon ember display rg, sans-serif';
        title.style.marginRight = '1px';
        title.style.fontSize = '13px';
        title.style.alignSelf = 'left';
        title.style.paddingLeft = '5px';
        title.style.paddingRight = '50px';
        title.style.color = '#777877';
        toolbarContainer.prepend(title);
    }

    //  Hook into content changes
    quill.on('text-change', saveEditedContent);
}

async function qresetDesigner() {
    var $yourDesigner = $('#clothing-designer');

    if ($('.tooltipstered').length) {
        $('.tooltipstered').each(function () {
            const $this = $(this);
            if ($this.data('tooltipster')) {
                try {
                    $this.tooltipster('destroy'); // Clean up Tooltipster
                } catch (e) {
                    console.warn('Error destroying Tooltipster instance:', e);
                }
            }
        });
    }
    if (window.yourDesigner) {
        // Remove event listeners and clean up
        //   window.yourDesigner.off();

        // Remove the designer container content
        $yourDesigner.empty();

        // Delete the global reference
        delete window.yourDesigner;
    }
}

// function checkVariantLimit(sizes, colors, from) {

//     if(from == 'sizes' || from == 'colors'){

//         console.log("-----------------------------")

//         console.log("sizes.length :" + sizes.length)
//         console.log("sizes.length :" + colors.length)

//         const variantCount = sizes.length * colors.length;

//         if (variantCount > 100) {
//             showToast(`Max ${from} limit Reached. (100 Variants)` , 4000);
//             console.log("Varints 100 reached");
//             return false;
//         } else {
//               // showToast(`Max ${from} limit Still There. (100 Variants)` , 4000);
//               console.log(`Max ${from} limit Still There. (100 Variants)`);
//               return true;
//         }

//         console.log("-----------------------------")
//     }
// }

async function initFpdQikink() {
    var $yourDesigner = $('#clothing-designer');

    if (window.yourDesigner && window.yourDesigner !== 'undefined') {
        window.yourDesigner.loadProduct(window.mockupJsonData[0]);

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    } else {
        (pluginOpts = {
            productsJSON: window.mockupJsonData, //see JSON folder for products sorted in categories
            langJSON: '../assets/fancyproductdesigner/lang/default.json?v6',
            //   designsJSON: 'json/designs.json', //see JSON folder for designs sorted in categories
            stageWidth: 620,

            stageHeight: 796,

            editorMode: false,
            smartGuides: true,
            templatesDirectory: '../assets/fancyproductdesigner/html/',
            //uiTheme: 'doyle',

            customTextParameters: {
                colors: false,
                removable: true,
                resizable: true,
                draggable: true,
                rotatable: true,
                autoCenter: true,
                boundingBox: 'Base',
                curvable: true,
            },
            customImageParameters: {
                "minW": 40,
                "minH": 40
            },
            //   customImageParameters: window.mockupDesignData,
            actions: {
                top: ['download', 'preview-lightbox'],
                //'right': ['magnify-glass', 'zoom', 'reset-product', 'qr-code', 'ruler'],
                bottom: ['undo', 'redo'],
                smart: ['position'],
                // 'left': ['manage-layers','info','save','load']
            },
            //   cornerControlsStyle: "basic", // This allows rotation and scaling
            boundingBoxColor: '#FF0000', // Set bounding box color to red
            boundingBoxProps: {
                strokeWidth: 1.5, // Set stroke width if needed
            },
        }),
                (window.yourDesigner = new FancyProductDesigner(
                        $yourDesigner,
                        pluginOpts
                        ));

        window.$yourDesigner = $yourDesigner;

        $yourDesigner.on('productCreate', function (evt) {
            const mockupId = window.mockup_id;

            // Array of Promises for async operations
            const asyncTasks = [
                populatePrintingOptions(mockupId),
                loadColors(mockupId),
                loadSizes(mockupId),
            ];

            // Wait for all async tasks to complete
            Promise.all(asyncTasks)
                    .then(() => {
                        initializeSwiper();
                        initSwiperSlider();

                        $('.size-buttons').find('button:eq(1)').trigger('click');

                        $('#colors-container')
                                .find('button:first-of-type')
                                .trigger('click');
                    })
                    .catch((error) => {
                        console.error('One or more async tasks failed:', error);
                    });
        });

        $yourDesigner.on('elementAdd', function (event, element) {
            if (element.type === 'image' && element.title === 'Design') {
                // Here We Call the function for Get Image Dimentions
                designElementAddCustom(element);

                // Here We Call the function for Change the Toottip Amount for every Changes of the degisn
                pricesValidation('test', 'elementModify');
            }
        });

        $yourDesigner.on('elementRemove', function (event, element) {
            if (element.title === 'Design' && element.type === 'image') {
                vIndex = window.yourDesigner.currentViewIndex;
                resetDesForm();
                resetHiddenDesForm(vIndex);
                pricesValidation('test', 'elementRemove');

                pcst = calculateTotalPrintCost();
                setBasePriceToSizes(pcst);

                // $('.resettable_fields').empty();
                // console.log(element);
            } else {
                // console.log('NOTcOMING');
                // console.log(element.title);
            }
        });

        let isAdjustingElement = false;
        let isResizing = false;

        $yourDesigner.on('elementModify', function (event, element, position) {
            if (element.type === 'image' && element.title === 'Design') {
                isUndoReset = false;
                //  <?php if (!$disableModifyValidation): ?>
                // Here We vaidate the Drag , resize , angle values
                if (!window.disableModifyValidation && $('.rightsidecontainer').hasClass('mockup1')) {
                    onElementModify(event, element, position);
                } else {
                    onElementModifyAngle(element);
                }
                //<?php endif; ?>
                // Here We Call the function for Image Dimentions Calculation
                designElementModify(element);
                // Here We Call the function for Change the Toottip Amount for every Changes of the degisn
                pricesValidation('test', 'elementModify');

                pcst = calculateTotalPrintCost();
                setBasePriceToSizes(pcst);
            }
        });




        $('#width, #height').on('change', function () {
            pcst = calculateTotalPrintCost();
            setBasePriceToSizes(pcst);
        });





        // For Select the sizes in the mockup page
        let toastAlreadyShown = false;
        $('.size-buttons').on('click', '.size-button', function () {
            const button_id = $(this).attr('id');

            if (button_id !== 'setPriceToAll') {
                sizeIsColor = $(this).attr('bg-size-color');
                if (sizeIsColor && sizeIsColor !== '') {
                    changeTshirtColor(sizeIsColor, 1);
                }
                const inputId = $(this).data('input-id');
                $('#' + inputId).focus();

                var choosedSize = $(this).toggleClass('selected');

                const selectedSizes = [];
                const inputPriceForSize = [];

                $('.size-button.selected').each(function () {
                    const sizeId = $(this).attr('id');

                    selectedSizes.push(sizeId);

                    $('#multiSelectedSizes').val(selectedSizes);

                    var isVariantAvailable = checkVariantLimit(
                            'sizes',
                            toastAlreadyShown
                            );

                    if (!isVariantAvailable) {
                        $(this).removeClass('selected');
                        selectedSizes.pop();
                        if (!toastAlreadyShown) {
                            toastAlreadyShown = true;

                            // Reset the toast flag after 3 seconds
                            setTimeout(() => {
                                toastAlreadyShown = false;
                            }, 3000);
                        }

                        return; // Stop loop
                    }

                    var tempPrice = $('#' + sizeId + '_input_price').val();
                    inputPriceForSize.push(tempPrice);
                });
                $('#multiSelectedSizes').val(selectedSizes);

                $('#temp_size').val(selectedSizes.join(','));
                $('#temp_size_price').val(inputPriceForSize.join(','));

                const sizeId = $(this).attr('id');
                const sizeName = $(this).text();

                $('#multiSelectedSizePrices').val(
                        inputPriceForSize.map((size) => size.sizeId).join(',')
                        );

                getimgSize(sizeId);

                if ($('#plain_order_check').is(':checked')) {
                    setPriceForPlainProduct();
                } else {
                    pricesValidation('1', 'colors');
                }
            }
        });
// Here we select all available sizes and also check the size and color combination check
        $('.selectAllSizes').on('click', function () {
            const $label = $(this);
            const $buttons = $('.size-buttons .size-button');
            let stopAll = false; 

            if ($label.text() === 'Select all') {
                $buttons.not('.selected').each(function () {
                    if (stopAll) return false;

                    let sizeId = $(this).attr('id');
                    const values = $('#multiSelectedColors').val();
                    const colorIds = values.split(',');


                    for (let colorId of colorIds) {
                    if (!checkSizeColorAvailable(sizeId, colorId)) {
                            showToast(
                                "This Size & Color Combination Currently Not Available",
                                "danger",
                                4000
                            );
                         

                            stopAll = true;
                            return false;
                        }
                    }

                    if (!stopAll) {
                        $(this).trigger('click');
                    }
                });

                if (!stopAll) {
                    $label.text('Clear all');
                }

            } else {
                $buttons.filter('.selected').each(function () {
                    $(this).trigger('click');
                });
                $label.text('Select all');
            }
        });

        const allPrices = window.prices_json;
        function checkSizeColorAvailable(size, color) {
            return typeof allPrices[size + "_" + color] !== "undefined";
        }
        $('#getPriceToAll').on('change', function () {
            // Parse the input value as a float and format it to two decimal places
            var price_for_all = parseFloat($('#getPriceToAll').val());

            $('.input-price-per-size').each(function () {
                $(this).val(price_for_all); // Set formatted value for each input
            });

            // Update the first button in size-buttons container
            $('.size-buttons button:first')
                    .css({
                        'background-color': '#f2782c',
                        color: 'white',
                    })
                    .attr('isPriceSet', true)
                    .addClass('isPriceSet');
        });

        $('#setPriceToAll').on('click', function () {
            $('#getPriceToAll').focus();
            if (
                    $('.size-buttons button:first').css('background-color') ===
                    'rgb(242, 120, 44)'
                    ) {
                $('.size-buttons button:first').css({
                    'background-color': '',
                    color: '',
                });
                removeValueForAllSizes();
            } else {
                var res = setValueForAllSizes();
                if (res != false) {
                    $('.size-buttons button:first').css({
                        'background-color': '#f2782c',
                        color: 'white',
                    });
                }
            }
        });

        // function setValueForAllSizes() {
        //     var price_for_all = $('#getPriceToAll').val();
        //     if (!price_for_all) {
        //         showToast("Please Enter the Price for All Sizes..!", "danger", 3000);
        //         return false;
        //     } else {
        //         $('.input-price-per-size').each(function () {
        //             $(this).val(price_for_all);
        //         });
        //         $('.size-buttons button:first').css({
        //             'background-color': '#f2782c',
        //             'color': 'white'
        //         });
        //     }
        // }

        // function removeValueForAllSizes() {
        //     $('#getPriceToAll').val('');
        //     $('.input-price-per-size').each(function () {
        //         $(this).val('');
        //     });
        // }

        function resetFancyProductDesigner() {
            if (!yourDesigner || !yourDesigner.viewInstances) {
                console.error(
                        'Fancy Product Designer instance or views not found.'
                        );
                return;
            }

            // Loop through all views
            yourDesigner.viewInstances.forEach((viewInstance, index) => {
                // Find the element with the title 'Design' in the current view
                const fabricElement = viewInstance.getElementByTitle('Design');
                if (fabricElement) {
                    // Remove the element if it exists
                    viewInstance.removeElement(fabricElement);
                }

                resetHiddenDesForm(index);
            });
        }

        function resetDesForm() {
            $('#width').val('');
            $('#height').val('');
            $('#dpi').val('');
            $('#print_quality').val('');
            //design_angle
            $('#design_angle').val('');
        }

        function resetHiddenDesForm(vindex) {
            $('#' + vindex + '_width').val('');
            $('#' + vindex + '_dpi').val('');
            $('#' + vindex + '_height').val('');
            $('#' + vindex + '_designid').val('');
            //$('#' + vindex + '_printtype').val("");
            $('#' + vindex + '_placement').val('');
            $('#' + vindex + '_mockup_url').val('');
        }

        $('.mcontainer').on(
                'change',
                'input[name="printingOption"]',
                function () {
                    resetFancyProductDesigner();
                    resetDesForm();

                    val = validateMultiplePT($(this).val());

                    if (!val.success) {
                        // Uncomment if you want this behavior:
                        // $("input[name=printingOption][value='" + val.pt + "']").prop("checked", true);
                        // showToast("1 Product cannot have multiple Print types", "warning", 3000);
                        // return;
                    }

                    vIndex = window.yourDesigner.currentViewIndex;
                    $('#' + vIndex + '_printtype').val($(this).val());

                    if ($(this).val() == 'vinyl_printing') {
                        $('#vinyl_printing_options').css({
                            display: 'flex',
                        });
                    } else {
                        $('#vinyl_printing_options').css({
                            display: 'none',
                        });
                    }
                }
        );

        // For Enable the Plain Order CheckBox Hide the printing types & add design button and design areas
        $('.mcontainer').on('change', '#plain_order_check', function () {
            if (this.checked) {
                reset_design_fields();
                // $('.resettable_fields').empty();

                $('.mobile-add-design .form-group').addClass('d-none');
                $('.add_design_menu').addClass('d-none');
                $('.printing_options_menu').addClass('d-none');
                $('.image_dimentions_menu').addClass('d-none');
                $('.center-div').addClass('d-none');
                $('.printing_cost_div').addClass('d-none');
                $('.handling_cost').removeClass('d-none');
                getPlainOrderCheck(1);
                resetFancyProductdesigner();
                resetDesignValues();
                setPriceForPlainProduct();
                const plain_handling = '23.6';
                if ($('.basePricePerSize').length) {
                    $('p.basePricePerSize').attr(
                            'data-handling',
                            plain_handling
                            );
                    //     printCostTotal=calculateTotalPrintCost();
                    setBasePriceToSizes(0);
                }
                // $('#design_values,#inputForm')[0].reset();
            } else {
                $('p.basePricePerSize').attr('data-handling', 0);
                setBasePriceToSizes(0);
                $('.printing_cost_div').removeClass('d-none');
                $('.image_dimentions_menu').addClass('d-none');
                $('.mobile-add-design .form-group').removeClass('d-none');
                $('.design-related').removeClass('d-none');
                $('.add_design_menu').removeClass('d-none');
                $('.printing_options_menu').removeClass('d-none');
                $('.center-div').removeClass('d-none');
                $('.handling_cost').addClass('d-none');
                getPlainOrderCheck(0);
                // window.location.reload();
                pricesValidation(1, 'desable_plain_order');
            }
        });

        const $productTagInputs = $('#productTagInputs');
        const $productTagsContainer = $('#productTagsContainer');
        window.allTags = [];

        $productTagInputs.on('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const tagText = $productTagInputs.val().trim();
                if (tagText && !window.allTags.includes(tagText)) {
                    addTag(tagText);
                    window.allTags.push(tagText);
                    $('#productTags').val(window.allTags); // here we set the values to the hidden input-modal
                } else {
                    showToast(
                            'This Tag has already been added to the list.',
                            'danger',
                            3000
                            );
                }
                $productTagInputs.val('');
            }
        });

        window.changeColor = function (element) {
            // console.log('Selected Default Color ID: ' + $(element).val());

            $('#defaultProductColor').val($(element).val());
        };

        $('.select-color').on('change', function (e) {
            const selectedValue = $(this).val(); // This is your colorId
            // console.log('Selected Default Color ID: ' + selectedValue);

            $('#defaultProductColor').val(selectedValue);

            // Now get the colorCode
            const colorButton = $(
                    `.color-button[bg-color-id="${selectedValue}"]`
                    );
            const colorCode = colorButton.attr('bg-color');
            const colorId = selectedValue; // Same as selectedValue

            // console.log('Color Code: ' + colorCode);
            // console.log('Color ID: ' + colorId);

            if (colorCode && colorId) {
                changeTshirtColor(colorCode, colorId);
            } else {
                console.warn('Color details not found!');
            }
        });

        $('.select-color').on('select2:select', function (e) {
            $(this).find('option[value=""]').remove();
        });

        $('.select-color').select2({
            width: '200px',
            dropdownAutoWidth: true,
            placeholder: 'Default Color',
            templateResult: formatColorOption,
            templateSelection: formatColorOption,
        });

        function formatColorOption(option) {
            if (!option.id) {
                return option.text;
            }

            var colorCode = $(`.color-button[bg-color-id="${option.id}"]`).attr(
                    'bg-color'
                    );

            var $option = $(
                    `<span style="display: flex; align-items: center; gap: 8px;">
                 <div style="width: 22px; height: 22px; border-radius: 3px; background-color: ${colorCode};"></div>
                 <span style="white-space: nowrap;">${option.text}</span>
                 </span>`
                    );

            return $option;
        }

        function resetFancyProductdesigner() {
            var fabricElement =
                    yourDesigner.currentViewInstance.getElementByTitle('Design');

            if (fabricElement) {
                yourDesigner.currentViewInstance.removeElement(fabricElement);
            }
        }

        function resetDesignValues() {
            if (!yourDesigner || !yourDesigner.viewInstances) {
                console.error(
                        'Fancy Product Designer instance or views not found.'
                        );
                return;
            }

            // Loop through all views
            yourDesigner.viewInstances.forEach((viewInstance, index) => {
                // Find the element with the title 'Design' in the current view
                const fabricElement = viewInstance.getElementByTitle('Design');
                if (fabricElement) {
                    // Remove the element if it exists
                    viewInstance.removeElement(fabricElement);
                }
            });
        }

        function onElementModifyAngle(element) {
            var rotationAngle = element.angle;
            if (rotationAngle > 180) {
                rotationAngle -= 360;
            }
            $('#design_angle').val(rotationAngle.toFixed(1) + '°');
        }

        function onElementModify(event, element, position) {

            var rotationAngle = element.angle;
            if (rotationAngle > 180) {
                rotationAngle -= 360;
            }
            $('#design_angle').val(rotationAngle.toFixed(1) + '°');

            if (isAdjustingElement)
                return;
            isAdjustingElement = true;
            let currentScaleX = element.scaleX;
            let currentScaleY = element.scaleY;
            let boundingBox = {
                x: element.boundingBox.x,
                y: element.boundingBox.y,
                width: element.boundingBox.width,
                height: element.boundingBox.height,
            };
            let elementBoundingBox = {
                left: element.left - (element.scaleX * element.width) / 2,
                top: element.top - (element.scaleY * element.height) / 2,
                right: element.left + (element.scaleX * element.width) / 2,
                bottom: element.top + (element.scaleY * element.height) / 2,
            };
            let isOutOfBounds = {
                left: elementBoundingBox.left < boundingBox.x,
                top: elementBoundingBox.top < boundingBox.y,
                right: elementBoundingBox.right >
                        boundingBox.x + boundingBox.width,
                bottom: elementBoundingBox.bottom >
                        boundingBox.y + boundingBox.height,
            };
            if (
                    isOutOfBounds.left ||
                    isOutOfBounds.top ||
                    isOutOfBounds.right ||
                    isOutOfBounds.bottom
                    ) {
                if (isOutOfBounds.left) {
                    element.left =
                            boundingBox.x + (element.scaleX * element.width) / 2;
                }
                if (isOutOfBounds.top) {
                    element.top =
                            boundingBox.y + (element.scaleY * element.height) / 2;
                }
                if (isOutOfBounds.right) {
                    element.left =
                            boundingBox.x +
                            boundingBox.width -
                            (element.scaleX * element.width) / 2;
                }
                if (isOutOfBounds.bottom) {
                    element.top =
                            boundingBox.y +
                            boundingBox.height -
                            (element.scaleY * element.height) / 2;
                }

                yourDesigner.setElementParameters({
                    left: element.left,
                    top: element.top,
                },
                        element
                        );
            }

            if (
                    element.getScaledWidth() > element.boundingBox.width + 5 ||
                    element.getScaledHeight() > element.boundingBox.height + 5
                    ) {
                yourDesigner.setElementParameters({
                    scaleX: window.current_design_object.scale,
                    scaleY: window.current_design_object.scale,
                },
                        element
                        );
                $('#center-align-icon').trigger('click');
            }
            isAdjustingElement = false;
            // alert($yourDesigner.currentViewInsatance.getScalingByDimesions())
        }

        window.onElementModify = onElementModify;
        let isAligning = false;
    }

    /*
     * Load input-form here
     */

    populateResettableFields(window.mockupJsonData);
    $('#mockup_generator_id').val(window.mockup_id);

    $('.mockup_name_h3').html(window.mockupJsonData[0][0]['mockup_name']);
    /*
     * End
     */
}

function addTag(tagText) {
    const $productTagsContainer = $('#productTagsContainer');
    const $tag = $('<span class="tag"></span>').text(tagText);
    const $removeBtn = $('<span class="remove">×</span>').on(
            'click',
            function () {
                $(this).parent().remove();
                window.allTags = window.allTags.filter((tag) => tag !== tagText);
                $('#productTags').val(window.allTags); // here we set the values to the hidden input-modal
            }
    );

    $tag.append($removeBtn);

    $productTagsContainer.append($tag);
}

function removeMockupScript() {
    const scripts = document.querySelectorAll('script[data-mockup-script]');
    scripts.forEach((script) => script.remove());
}

// Function to load script
function loadMockupScript(scriptSrc) {
    removeMockupScript();

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.setAttribute('data-mockup-script', 'true');
    document.body.appendChild(script);
}

function changeTshirtShadow(id, prefix = '') {

    shadow_obj =
            yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
    let elementSources = window.ShirtElementSources;
    let elementSourcesJSON = JSON.parse(elementSources);

    let elementSourcesJSONShadow = JSON.parse(window.shadowElementSources);
    let vindex = yourDesigner.currentViewIndex;

    // elementSourcesJSON[vindex].parameters.fill = hex;

    sourceToCheck = 'source' + prefix + id;

    if (
            typeof elementSourcesJSONShadow[vindex][sourceToCheck] !== 'undefined'
            ) {
        shirt_obj =
                yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }

        newSource = elementSourcesJSONShadow[vindex][sourceToCheck];

        elementSourcesJSONShadow[vindex].parameters.replace = true;
        yourDesigner.addElement(
                'image',
                newSource,
                'ShadowFront',
                elementSourcesJSONShadow[vindex].parameters
                );

        setTimeout(function () {
            bgColorId = $('#ord_color').val();
            $('button[bg-color-id="' + bgColorId + '"]').trigger('click');
        }, 10);
    } else {
        shirt_obj =
                yourDesigner.currentViewInstance.getElementByTitle('ShadowFront');

        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        elementSourcesJSON[vindex].parameters.topped = 1;
        //       elementSourcesJSON[vindex].parameters.fill = false;
        newSource = elementSourcesJSON[vindex].source;

        //   elementSourcesJSON[vindex].parameters.z=parseInt(-88);
        //newShirt = yourDesigner.currentViewInstance.addElement("image", newSource, "Shirt", elementSourcesJSON[vindex]);
        //   elementSourcesJSON[vindex].parameters.topped = 0;

        // elementSourcesJSON[vindex].parameters.fill = hex;
        yourDesigner.addElement(
                'image',
                newSource,
                'ShadowFront',
                elementSourcesJSON[vindex].parameters
                );
}
}

function changeTshirtColorAcc(hex, id, prefix = '') {
    shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
    if (hex) {
        $('.swiper-slide img').css('background-color', hex);
    }
    let elementSources = window.ShirtElementSources;
    let elementSourcesJSON = JSON.parse(elementSources);
    let vindex = yourDesigner.currentViewIndex;
    bgColorId = $('#ord_color').val();
    $('button[bg-color-id="' + bgColorId + '"]').attr('bg-color');
    // elementSourcesJSON[vindex].parameters.fill = hex;

    sourceToCheck = 'source' + prefix + id;

    if (typeof elementSourcesJSON[vindex][sourceToCheck] !== 'undefined') {
        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        newSource = elementSourcesJSON[vindex][sourceToCheck];
             if (window.mockup_id == "148" || elementSourcesJSON[vindex]?.designAtTop === 1) {
            elementSourcesJSON[vindex].parameters.topped = 0;
        }
        else{
               elementSourcesJSON[vindex].parameters.topped = 1;
        }


        elementSourcesJSON[vindex].parameters.replace = true;
        if (bgColorId !== 'undefined' && bgColorId !== '') {
            elementSourcesJSON[vindex].parameters.fill = $(
                    'button[bg-color-id="' + bgColorId + '"]'
                    ).attr('bg-color');
        } else {
            elementSourcesJSON[vindex].parameters.fill = false;
        }
        //     elementSourcesJSON[vindex].parameters.top=750;

        yourDesigner.addElement(
                'image',
                newSource,
                'Shirt',
                elementSourcesJSON[vindex].parameters
                );
        //  changeTshirtColor($('button[bg-color-id="' + bgColorId + '"]').attr('bg-color'),bgColorId);
    } else {
        shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');

        if (shirt_obj) {
            yourDesigner.currentViewInstance.removeElement(shirt_obj);
        }
        newSource = elementSourcesJSON[vindex].source;

        //   elementSourcesJSON[vindex].parameters.z=parseInt(-88);
        //newShirt = yourDesigner.currentViewInstance.addElement("image", newSource, "Shirt", elementSourcesJSON[vindex]);

        elementSourcesJSON[vindex].parameters.topped = 0;
        //  elementSourcesJSON[vindex].parameters.fill = $(
        //    'button[bg-color-id="' + bgColorId + '"]'
        //  ).attr('bg-color');

        elementSourcesJSON[vindex].parameters.fill = hex;
        yourDesigner.addElement(
                'image',
                newSource,
                'Shirt',
                elementSourcesJSON[vindex].parameters
                );
}
}

function saveEditedContent() {
    // const editedHTML = quill.root.innerHTML;
    const editedHTML = window.quill.root;
    const outputDiv = document.getElementsByClassName('ql-editor');
    outputDiv.innerHTML = editedHTML;
}

// function loadProductContents(mockupId) {
//     const filePath =
//         baseUrl + `public/assets/admin/mockups/${mockupId}/productContent.html`;

//     // Fetch the file content
//     fetch(filePath)
//         .then((response) => {
//             if (!response.ok) {
//                 window.quill.setContents(
//                     'No Sample content available',
//                     'silent'
//                 );
//             }
//             return response.text(); // Get the content as plain text
//         })
//         .then((productContents) => {
//             // Convert the HTML string to Quill Delta and set it in the editor
//             const delta = window.quill.clipboard.convert(productContents);
//             window.quill.setContents(delta, 'silent'); // 'silent' prevents triggering change events
//             alert()
//         })
//         .catch((error) => {
//             window.quill.setContents('No Sample content available', 'silent');
//         });
// }

function loadProductContents(mockupId) {
    const filePath =
            baseUrl + `assetsroot/admin/mockups/${mockupId}/productContent.html?v=1`;

    fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('File not found or unable to fetch content');
                }
                return response.text();
            })
            .then((productContents) => {
                if (!window.quill) {
                    console.error('Quill editor not initialized.');
                    return;
                }

                // Use direct HTML paste instead of Delta conversion
                window.quill.clipboard.dangerouslyPasteHTML(productContents);
            })
            .catch((error) => {
                console.error('Error loading product content:', error);
                const fallback = '<p>No Sample content available</p>';
                window.quill.clipboard.dangerouslyPasteHTML(fallback);
            });
}