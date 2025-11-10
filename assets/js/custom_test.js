/**
 * This is Qikink's custom js file. createn on 17-June-2023 by v
 *
 */
// assets/js/custom.js
// THis config is coming from admin/layouts/admin.php file last line took from .env file which is in root folder.

$(document).
        ready(function () {
             window.is_mockup_download=false;
            $("#download_mockupss").on("click", function (e) {
                e.preventDefault();
                $(".available_sizes_menu").find("input").val("1");
                window.is_mockup_download=true;
                $("#place_order").trigger('click', {isMockup: true});
            });


            /*
             * On change select size dropdown, trigger size change.
             */
            $( '.size-buttons-select select').
                    on(
                            'change',
                            function () {
                                // trigger click.
                                val = $(
                                        this).
                                        val();
                                $(
                                        'button[bg-size-id="' + val + '"]').
                                        click();
                            });

            if ($(
                    '#place_order').length) {
              
                isMockupDownld=0;
                document
                        .getElementById(
                                'place_order')
                        .
                        addEventListener(
                                'click',
                                function (scustomData) {
                                      ldContent='Creating your product. Please wait a moment...';
                                
                                  if(window.is_mockup_download){
                                       ldContent='Generating Mockups Please wait.';
                                      window.is_mockup_download=false;
                                      isMockupDownld=1;
                                  }
                                    showLoader(
                                            ldContent);

                                    var common_values = {
                                        color: $(
                                                '#ord_color').
                                                val(),
                                        size: $(
                                                '#ord_size').
                                                val(),
                                        quantity: $(
                                                '#product-quantity').
                                                val(),
                                        is_plain: $(
                                                '#is_plain').
                                                val(),
                                    };

                                    // For Create Order
                                    async function saveMockupDesignOnServer() {
                                        const designJson = window.design_json;
                                        const keys = Object.keys(
                                                designJson);
                                        const placements_counts = keys.length;
                                        let designDataURLs = [];

                                        for (let index = 0; index < placements_counts; index++) {
                                            var dataURL;

                                            var width = $(
                                                    '#' + index + '_width').
                                                    val();
                                            var height = $(
                                                    '#' + index + '_height').
                                                    val();
                                            var designId = $(
                                                    '#' + index + '_designid').
                                                    val();
                                            var placement = $(
                                                    '#' + index + '_placement').
                                                    val();
                                            var isPlain = $(
                                                    '#plain_order_check').
                                                    prop(
                                                            'checked');

                                            if (width == '' && height == '' && isPlain !== true) {
                                                designId = '';
                                            }
                                            if (designId) {
                                                dataURL = await new Promise(
                                                        (
                                                                resolve) => {
                                                    opx = {};
                                                    window.yourDesigner.getProductDataURL(
                                                            function (
                                                                    dataURL) {
                                                                resolve(
                                                                        dataURL);
                                                            },
                                                            '#000',
                                                            opx,
                                                            [index, index + 1]
                                                            );
                                                });

                                                designDataURLs.push(
                                                        {
                                                            designId: designId,
                                                            dataURL: dataURL,
                                                            placement: placement,
                                                            index: index,
                                                        });
                                            } else if ($(
                                                    '#plain_order_check').
                                                    is(
                                                            ':checked')) {
                                                dataURL = await new Promise(
                                                        (
                                                                resolve) => {
                                                    opx = {};
                                                    window.yourDesigner.getProductDataURL(
                                                            function (
                                                                    dataURL) {
                                                                resolve(
                                                                        dataURL);
                                                            },
                                                            '#000',
                                                            opx,
                                                            [index, index + 1]
                                                            );
                                                });

                                                designDataURLs.push(
                                                        {
                                                            designId: designId,
                                                            dataURL: dataURL,
                                                            placement: placement,
                                                            index: index,
                                                        });
                                                break;
                                            }
                                        }
                                        // $("button.place_order").addClass("d-none");
                                        const formData = new FormData();
                                        formData.append(
                                                'design_data',
                                                JSON.stringify(
                                                        designDataURLs)
                                                );

                                        return new Promise(
                                                (
                                                        resolve,
                                                        reject) => {
                                            $.ajax(
                                                    {
                                                        url: baseUrl + '/save_mockup_design_image',
                                                        type: 'POST',
                                                        data: formData,
                                                        processData: false,
                                                        contentType: false,
                                                        success: function (
                                                                response) {
                                                            if (response['status'] == true) {
                                                                //   showToast("File saved successfully on server.", 'success', 4000);

                                                                dataArray = response['mockup_values'];
                                                                dataArray.forEach(
                                                                        (
                                                                                item) => {



                                                                    $(
                                                                            '#' + item.index + '_mockup_url').
                                                                            val(
                                                                                    item.mockup_url
                                                                                    );
                                                                });

                                                                resolve();
                                                            } else {
                                                                showToast(
                                                                        response['message'],
                                                                        'info',
                                                                        4000
                                                                        );
                                                                reject(
                                                                        response['message']);
                                                                $(
                                                                        'button.place_order').
                                                                        removeClass(
                                                                                'd-none'
                                                                                );

                                                                hideLoader();
                                                            }
                                                        },
                                                        error: function (
                                                                xhr,
                                                                status,
                                                                error) {
                                                            // console.log(
                                                            //     response);
                                                            showToast(
                                                                    'File Failed to Save on the Server',
                                                                    'error',
                                                                    4000
                                                                    );
                                                            hideLoader();
                                                        },
                                                    });
                                        });
                                    }

                                    // For Validate the Input Price Feilf For Select Sizes are Filled
                                    function validateSelectedSizes() {
                                        let isValid = true;

                                        if ($(
                                                '#multiSelectedSizes').
                                                val() == '') {
                                            showToast(
                                                    'Please Select Your Sizes',
                                                    'danger',
                                                    3500
                                                    );

                                            hideLoader();
                                            return false;
                                        }

                                        $(
                                                '.size-button.selected').
                                                each(
                                                        function () {
                                                            const sizeId = $(
                                                                    this).
                                                                    attr(
                                                                            'id');
                                                            const inputField = $(
                                                                    '#' + sizeId + '_input_price');

                                                            if (!inputField.val().
                                                                    trim()) {
                                                                isValid = false;
                                                                inputField.css(
                                                                        'border-color',
                                                                        'red');
                                                                inputField.attr(
                                                                        'placeholder',
                                                                        'Fill');
                                                            } else {
                                                                inputField.css(
                                                                        'border-color',
                                                                        '');
                                                            }
                                                        });

                                        if (!isValid) {
                                            showToast(
                                                    'Please Fill Required Price Fields For Selected Sizes',
                                                    'danger',
                                                    3500
                                                    );

                                            hideLoader();
                                            return false;
                                        }

                                        return true;
                                    }

                                    // For Create Order
                                    function submitPlaceOrderForm() {
                                        /*
                                         * Add vinyl print value
                                         */
                                        $(
                                                '#vinylPrintTypeId').
                                                val($(
                                                        '#print_type_dropdown').
                                                        val
                                                        ());
                                        var formArray = $(
                                                'form[id^="inputForm"]').
                                                serializeArray();

                                        const groupedData = {};
                                        formArray.forEach(
                                                (
                                                        item) => {
                                            const {name, value} = item;
                                            const keyPrefix = name.split(
                                                    '_')[0];
                                            if (!isNaN(
                                                    keyPrefix)) {
                                                if (!groupedData[keyPrefix]) {
                                                    groupedData[keyPrefix] = {};
                                                }
                                                groupedData[keyPrefix][name] = value;
                                            } else {
                                                groupedData[name] = value;
                                            }
                                        });

                                        let jsonData = JSON.stringify(
                                                groupedData);

                                        // showToast("We are saving your product", 'info', 3000);
                                        // $("button.place_order").addClass("d-none");
                                        $.ajax(
                                                {
                                                    url: baseUrl + '/save_mockup_design_values',
                                                    type: 'POST',
                                                    data: {
                                                        formData: jsonData,
                                                    },
                                                    success: function (
                                                            response) {
                                                        if (response.status == true) {
                                                            // console.log(
                                                            //     'response sent to dashboard.qikink.com'
                                                            // );
                                                        }

                                                        showToast(
                                                                'Product Created Successfully.',
                                                                'success',
                                                                3000
                                                                );
                                                    },
                                                    error: function (
                                                            xhr,
                                                            status,
                                                            error) {
                                                        $(
                                                                'button.place_order').
                                                                removeClass(
                                                                        'd-none');
                                                        console.error(
                                                                'Error saving data:',
                                                                error);
                                                        alert(
                                                                'Something Wrong While Saving Data..!',
                                                                'danger',
                                                                3000
                                                                );
                                                    },
                                                });
                                    }
                                    // For Create Product
                                    async function saveImageToServerForCreateProduct() {
                                        var mockup_name =
                                                window.mockupJsonData[0][0]['mockup_name'];

                                        return new Promise(async (resolve, reject) => {
                                            try {
                                                let indx = window.yourDesigner.currentViewIndex;
                                                const placements = window.yourDesigner.currentViews;
                                                const colorButtons = document.querySelectorAll('.color-button');
                                                const zip = new JSZip();

                                                let allSelectedColors = $('#multiSelectedColors').val().split(',');
                                                if (window.mockup_id == 16) { // for color coffee mug
                                                    colorButtons = document.querySelectorAll('.size-button');
                                                    allSelectedColors = $('#multiSelectedSizes').val();
                                                }

                                                const designJson = window.design_json;
                                                const keys = Object.keys(designJson);
                                                const placements_counts = keys.length;

                                                console.log("keys", keys);
                                                let defaultBlob = null; // Store the Front or Back or AOP image for later use
                                                let defaultImageAdded = false; // Track if default.jpg is added

                                                // test start
                                                let frontHasDesign = false;
                                                let backHasDesign = false;
                                                let otherPlacementsHasDesign = false;

                                                for (let i = 0; i <= placements_counts; i++) {
                                                    tempDesignId = $('#' + i + '_designid').val();
                                                    if (tempDesignId) {

                                                        if (keys[i] == "Front") {
                                                            frontHasDesign = true;
                                                            window.isFrontHasDesign = true;
                                                        }
                                                        if (keys[i] == "Back") {
                                                            backHasDesign = true;
                                                        }
                                                        if (keys[i] != "Front" && keys[i] != "Back") {
                                                            otherPlacementsHasDesign = true;
                                                            window.isOtherPlacementsHasDesign = true;
                                                        }
                                                    }
                                                }

                                                let placementsarray = []; // Initialize the array


                                                for (let placement_index = 0; placement_index < placements_counts; placement_index++) {
                                                    const designId = $('#' + placement_index + '_designid').val();
                                                    if (designId) {
                                                        placementsarray.push(placement_index);
                                                    }
                                                }
                                                for (let placement_index = 0; placement_index < placements_counts; placement_index++) {
                                                    const designId = $('#' + placement_index + '_designid').val();
                                                    if (!designId) {

                                                        if ((keys[placement_index] == "Front" || placement_index == 0) && (common_values.is_plain == 1 || (otherPlacementsHasDesign == false && backHasDesign == true))) {

                                                            placementsarray.push(placement_index);
                                                            if (!backHasDesign) {
                                                                window.isBackHasDesign = false;
                                                            } else {
                                                                window.isBackHasDesign = true;
                                                            }

                                                            console.log("Front added but no design for it")
                                                        }
                                                        if (keys[placement_index] == "Back") {
                                                            placementsarray.push(placement_index);
                                                            window.isBackHasDesign = false;
                                                            console.log("Back added but no design for it")
                                                        }
                                                    }
                                                }

                                                console.log(placementsarray);
                                                // test end 


                                                for (const placement_index of placementsarray) {


                                                    if (placement_index !== indx) {
                                                        window.yourDesigner.selectView(placement_index);
                                                        await new Promise((resolve) => setTimeout(resolve, 2500));
                                                    }

                                                    for (const [colorIndex, button] of colorButtons.entries()) {
                                                        const colorId = button.getAttribute('bg-color-id');
                                                        if (allSelectedColors.includes(colorId)) {
                                                            const colorCode = button.getAttribute('bg-color');

                                                            changeTshirtColor(colorCode, colorId);
                                                            await new Promise((resolve) => setTimeout(resolve, 1500));

                                                            let opx = {};
                                                            let dataURL;

                                                            try {
                                                                /*
                                                                 dataURL = await new Promise((resolve) => {
                                                                 window.yourDesigner.getProductDataURL(
                                                                 function (dataURL) {
                                                                 resolve(dataURL);
                                                                 },
                                                                 '#000',
                                                                 opx,
                                                                 [placement_index, parseInt(placement_index) + 1]
                                                                 );
                                                                 });
                                                                 */
                                                                dataURL = await new Promise((resolve) => {
                                                                    window.yourDesigner.getProductDataURL(
                                                                            function (dataURL) {
                                                                                resolve(dataURL);
                                                                            },
                                                                            '#ffffff', // background color
                                                                            {
                                                                                onlyExportable: false,
                                                                                enableRetinaScaling: true,
                                                                                multiplier: 1.1
                                                                            },
                                                                            [placement_index, parseInt(placement_index) + 1]
                                                                            );
                                                                });
                                                            } catch (error) {
                                                                console.error('Error in getProductDataURL:', error);
                                                                continue;
                                                            }

                                                            const image = new Image();
                                                            image.src = dataURL;

                                                            await new Promise((resolve, reject) => {
                                                                image.onload = function () {
                                                                    const canvas = document.createElement('canvas');
                                                                    const ctx = canvas.getContext('2d');
                                                                    const maxWidth = 800;

                                                                    //  const scaleFactor = maxWidth / image.width;
                                                                    //  canvas.width = maxWidth;
                                                                    //  canvas.height = image.height * scaleFactor;
                                                                    //  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


                                                                    // ctx.imageSmoothingEnabled = true;
                                                                    // ctx.imageSmoothingQuality = "high";

                                                                    const scale = 1;
                                                                    canvas.width = image.width * scale;
                                                                    canvas.height = image.height * scale;
                                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


                                                                    canvas.toBlob(
                                                                            (blob) => {
                                                                        if (blob) {
                                                                            let tempName = placements[placement_index].title || 'image';
                                                                            tempName = tempName.replace(/ /g, '_');

                                                                            const fileName = `${tempName}_${placement_index + 1}_c_${colorId}.jpg`;
                                                                            zip.file(fileName, blob);

                                                                            if (!defaultImageAdded) {
                                                                                isAopProduct = false;

                                                                                if (
                                                                                        window.mockupJsonData[0][0] &&
                                                                                        typeof window.mockupJsonData[0][0]['isAopProduct'] !== 'undefined'
                                                                                        ) {
                                                                                    isAopProduct = window.mockupJsonData[0][0]['isAopProduct'];
                                                                                }

                                                                                if ($('#defaultProductColor').val() == colorId) {
                                                                                    const title = placements[placement_index].title;

                                                                                    const mockupId = String(window.mockup_id);
                                                                                    const isAop = mockup_name.toLowerCase().includes('aop') || isAopProduct || ['18', '119', '95', '76', '32', '45'].includes(mockupId);

                                                                                    if (
                                                                                            (isAop && title === 'Left Pocket') || (isAop && title === 'Right Pocket') || (!isAop && ['Front', 'Back', 'Left Pocket', 'Right Pocket'].includes(title))
                                                                                            ) {
                                                                                        defaultBlob = blob;
                                                                                        defaultImageAdded = true;
                                                                                    }
                                                                                }
                                                                            }

                                                                            resolve();
                                                                        } else {
                                                                            reject('Blob creation failed');
                                                                        }
                                                                    },
                                                                            'image/jpeg',
                                                                            1
                                                                            );
                                                                };

                                                                image.onerror = function () {
                                                                    reject('Error loading image');
                                                                };
                                                            });

                                                            await new Promise((resolve) => setTimeout(resolve, 1000));
                                                        }
                                                    }
                                                }



                                                // Add the default.jpg to ZIP
                                                if (defaultBlob) {
                                                    zip.file('default.jpg', defaultBlob);
                                                }

                                                if (isMockupDownld===1) {
                                                    zip.generateAsync({type: 'blob'}).then(content => {
                                                        // Create a URL for the Blob
                                                        const url = window.URL.createObjectURL(content);

                                                        // Create a temporary anchor element to trigger the download
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = 'MockupImages.zip'; // Set the download file name
                                                        document.body.appendChild(link); // Append to DOM (required for some browsers)
                                                        link.click(); // Trigger the download
                                                        document.body.removeChild(link); // Clean up
                                                        window.URL.revokeObjectURL(url); // Free up memory

                                                        // Reload the page
                                                        showToast("Mockups Generated Successfully","success",2000);
                                                        setTimeout(function(){
                                                             window.location.reload();
                                                        },2000);
                                                       
                                                    });
                                                } else {
                                                    zip.generateAsync(
                                                            {type: 'blob'})
                                                            .
                                                            then(
                                                                    (
                                                                            content) => {
                                                                let formData = new FormData();
                                                                formData.append(
                                                                        'file',
                                                                        content,
                                                                        'MockupImages.zip'
                                                                        );

                                                                $.ajax(
                                                                        {
                                                                            url:
                                                                                    baseUrl +
                                                                                    '/save_mockup_product_image',
                                                                            type: 'POST',
                                                                            data: formData,
                                                                            processData: false,
                                                                            contentType: false,
                                                                            success: function (
                                                                                    response) {
                                                                                $('#saved_zip_file_name').val(response.file_name);
                                                                                resolve();
                                                                            },
                                                                            error: function (
                                                                                    xhr,
                                                                                    status,
                                                                                    error) {
                                                                                console.error(
                                                                                        'Error saving file to server:',
                                                                                        error
                                                                                        );
                                                                                reject(
                                                                                        error);
                                                                            },
                                                                        });
                                                            })
                                                            .
                                                            catch(
                                                                    reject);
                                                }

                                            } catch (error) {
                                                console.error(
                                                        'Error in saveImageToServerForCreateProduct:',
                                                        error
                                                        );
                                                reject(
                                                        error);
                                            }
                                        });
                                    }





                                    async function saveImageToServerForCreateProductAcc() {
                                        var mockup_name =
                                                window.mockupJsonData[0][0]['mockup_name'];

                                        return new Promise(
                                                async (
                                                        resolve,
                                                        reject) => {
                                            try {
                                                let indx = window.yourDesigner.currentViewIndex;
                                                const placements = window.yourDesigner.currentViews;
                                                const colorButtons = document.querySelectorAll(
                                                        '.color-button');
                                                const zip = new JSZip();
                                                const allSelectedSizes = $(
                                                        '#multiSelectedSizes').
                                                        val();


                                                const designJson = window.design_json;
                                                const keys = Object.keys(
                                                        designJson);
                                                const placements_counts = keys.length;

                                                let defaultBlob = null; // Store the Front or Back or AOP image for later use
                                                let defaultImageAdded = false; // Track if default.jpg is added

                                                for (
                                                        let placement_index = 0;
                                                        placement_index < placements_counts;
                                                        placement_index++
                                                        ) {
                                                    const designId = $('#' + placement_index + '_designid').val();

                                                    // console.log(
                                                    //     'Design Id : ' + designId);

                                                    if (placement_index >= 1 && !designId) {
                                                        // console.log(`Design ID not found for placement ${placement_index + 1}`);
                                                        continue;
                                                    }
                                                    const sizeIdArray = allSelectedSizes.split(',').map((id) => id.trim());

                                                    for (let i = 0; i < sizeIdArray.length; i++) {
                                                        const sId = sizeIdArray[i];
                                                        if (1 == 1) {
                                                            let shirt_obj =
                                                                    window.yourDesigner.getElementByTitle(
                                                                            'Shirt'
                                                                            );

                                                            // window.yourDesigner.setElementParameters(
                                                            //     tParam,
                                                            //     shirt_obj
                                                            // );

                                                            changeSizeImages(sId);

                                                            // changeTshirtColorAcc(sId);
                                                            // changeTshirtShadow(sId, "size");

                                                            await new Promise(
                                                                    (
                                                                            resolve) =>
                                                                setTimeout(
                                                                        resolve,
                                                                        500)
                                                            );

                                                            let opx = {};
                                                            let dataURL;
                                                            try {
                                                                /*
                                                                 dataURL = await new Promise(
                                                                 (
                                                                 resolve) => {
                                                                 window.yourDesigner.getProductDataURL(
                                                                 function (
                                                                 dataURL) {
                                                                 resolve(
                                                                 dataURL);
                                                                 },
                                                                 '#000',
                                                                 opx,
                                                                 [
                                                                 placement_index,
                                                                 parseInt(
                                                                 placement_index
                                                                 ) + 1,
                                                                 ]
                                                                 );
                                                                 }
                                                                 );
                                                                 */
                                                                dataURL = await new Promise((resolve) => {
                                                                    window.yourDesigner.getProductDataURL(
                                                                            function (dataURL) {
                                                                                resolve(dataURL);
                                                                            },
                                                                            '#ffffff', // background color
                                                                            {
                                                                                onlyExportable: false,
                                                                                enableRetinaScaling: true,
                                                                                multiplier: 1.1
                                                                            },
                                                                            [placement_index, parseInt(placement_index) + 1]
                                                                            );
                                                                });
                                                            } catch (error) {
                                                                console.error(
                                                                        'Error in getProductDataURL:',
                                                                        error
                                                                        );
                                                                continue;
                                                            }

                                                            const image = new Image();
                                                            image.src = dataURL;

                                                            await new Promise(
                                                                    (
                                                                            resolve,
                                                                            reject) => {
                                                                image.onload = function () {
                                                                    const canvas =
                                                                            document.createElement(
                                                                                    'canvas'
                                                                                    );
                                                                    const ctx =
                                                                            canvas.getContext(
                                                                                    '2d');
                                                                    const maxWidth = 800;
                                                                    //     const scaleFactor =
                                                                    //         maxWidth / image.width;
                                                                    //     canvas.width = maxWidth;
                                                                    //     canvas.height =
                                                                    //          image.height * scaleFactor;

                                                                    //       ctx.drawImage(
                                                                    //           image,
                                                                    //          0,
                                                                    //          0,
                                                                    //          canvas.width,
                                                                    //          canvas.height
                                                                    //      );



                                                                    const scale = 1;
                                                                    // ctx.imageSmoothingEnabled = true;
                                                                    // ctx.imageSmoothingQuality = "high";
                                                                    canvas.width = image.width * scale;
                                                                    canvas.height = image.height * scale;
                                                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                                                                    canvas.toBlob(
                                                                            (
                                                                                    blob) => {
                                                                        if (blob) {
                                                                            let tempName =
                                                                                    placements[
                                                                                            placement_index
                                                                                    ].title;
                                                                            if (tempName) {
                                                                                tempName =
                                                                                        tempName.replace(
                                                                                                / /g,
                                                                                                '_'
                                                                                                );
                                                                            } else {
                                                                                tempName =
                                                                                        placements[
                                                                                                placement_index
                                                                                        ].title;
                                                                            }

                                                                            const fileName = `${tempName}_${placement_index +
                                                                                    1
                                                                                    }_c_${sId}.jpg`;
                                                                            zip.file(
                                                                                    fileName,
                                                                                    blob
                                                                                    );


                                                                            isAopProduct = false;
                                                                            if (
                                                                                    window.mockupJsonData[0][0] &&
                                                                                    typeof window.mockupJsonData[0][0]['isAopProduct'] !== 'undefined' &&
                                                                                    window.mockupJsonData[0][0]['isAopProduct'] == true
                                                                                    ) {
                                                                                isAopProduct = window.mockupJsonData[0][0]['isAopProduct'];
                                                                            }



                                                                            // If Its AOP Product , Get Left Packet As default.jpg
                                                                            if (
                                                                                    mockup_name.toLowerCase().includes('aop') ||
                                                                                    isAopProduct ||
                                                                                    ['18', '119', '95', '76', '32', '45'].includes(String(window.mockup_id))
                                                                                    ) {
                                                                                if (placements[placement_index].title === 'Left Pocket') {
                                                                                    defaultBlob = blob;
                                                                                    defaultImageAdded = true;
                                                                                } else if (placements[placement_index].title === 'Front') {
                                                                                    // For AOP Products Default.jpg added here
                                                                                    defaultBlob = blob;
                                                                                    defaultImageAdded = true;
                                                                                    console.log("Placement is Front - is AOP")

                                                                                }
                                                                            } else {
                                                                                if (placements[placement_index].title === 'Front') {
                                                                                    defaultBlob = blob;
                                                                                    defaultImageAdded = true;
                                                                                    // console.log("Placement is Front")
                                                                                }
                                                                            }

                                                                            // // If placement is "Front", store as default
                                                                            // if (placements[placement_index].title === 'Front') { // Here Continue
                                                                            //     defaultBlob = blob;
                                                                            //     defaultImageAdded = true;
                                                                            // }

                                                                            resolve();
                                                                        } else {
                                                                            reject(
                                                                                    'Blob creation failed'
                                                                                    );
                                                                        }
                                                                    },
                                                                            'image/jpeg',
                                                                            1.0
                                                                            );
                                                                };

                                                                image.onerror = function () {
                                                                    reject(
                                                                            'Error loading image');
                                                                };
                                                            });

                                                            await new Promise(
                                                                    (
                                                                            resolve) =>
                                                                setTimeout(
                                                                        resolve,
                                                                        1000)
                                                            );
                                                        }
                                                    }
                                                }

                                                // If no Front image was added, look for Back
                                                if (!defaultImageAdded) {
                                                    let opx = {};
                                                    for (let i = 0; i < placements.length; i++) {
                                                        if (placements[i].title === 'Back') {
                                                            const backIndex = i;
                                                            const backImageURL = await new Promise(
                                                                    (
                                                                            resolve) => {
                                                                window.yourDesigner.getProductDataURL(
                                                                        function (
                                                                                dataURL) {
                                                                            resolve(
                                                                                    dataURL);
                                                                        },
                                                                        '#000',
                                                                        opx,
                                                                        [backIndex, backIndex + 1]
                                                                        );
                                                            }
                                                            );

                                                            const backImage = new Image();
                                                            backImage.src = backImageURL;

                                                            await new Promise(
                                                                    (
                                                                            resolve,
                                                                            reject) => {
                                                                backImage.onload = function () {
                                                                    const canvas =
                                                                            document.createElement(
                                                                                    'canvas'
                                                                                    );
                                                                    const ctx =
                                                                            canvas.getContext(
                                                                                    '2d');
                                                                    const maxWidth = 800;
                                                                    const scaleFactor =
                                                                            maxWidth / backImage.width;
                                                                    canvas.width = maxWidth;
                                                                    canvas.height =
                                                                            backImage.height *
                                                                            scaleFactor;

                                                                    ctx.drawImage(
                                                                            backImage,
                                                                            0,
                                                                            0,
                                                                            canvas.width,
                                                                            canvas.height
                                                                            );

                                                                    canvas.toBlob(
                                                                            (
                                                                                    blob) => {
                                                                        if (blob) {
                                                                            defaultBlob = blob;
                                                                            resolve();
                                                                        } else {
                                                                            reject(
                                                                                    'Blob creation failed'
                                                                                    );
                                                                        }
                                                                    },
                                                                            'image/jpeg',
                                                                            1.0
                                                                            );
                                                                };

                                                                backImage.onerror = function () {
                                                                    reject(
                                                                            'Error loading back image'
                                                                            );
                                                                };
                                                            });

                                                            break; // Stop after finding the first "Back" image
                                                        }
                                                    }
                                                }

                                                // Add the default.jpg to ZIP
                                                if (defaultBlob) {
                                                    zip.file(
                                                            'default.jpg',
                                                            defaultBlob);
                                                }

                                                if (isMockupDownld) {
                                                    // generated code
                                                    zip.generateAsync({type: 'blob'}).then(content => {
                                                        // Create a URL for the Blob
                                                        const url = window.URL.createObjectURL(content);

                                                        // Create a temporary anchor element to trigger the download
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.download = 'MockupImages.zip'; // Set the download file name
                                                        document.body.appendChild(link); // Append to DOM (required for some browsers)
                                                        link.click(); // Trigger the download
                                                        document.body.removeChild(link); // Clean up
                                                        window.URL.revokeObjectURL(url); // Free up memory

                                                        // Reload the page
                                                        showToast("Mockups Generated","success",2000);
                                                        
                                                        setTimeout(function(){
                                                              window.location.reload();
                                                        },2000);
                                                      
                                                    });

                                                    //end generated code


                                                } else {

                                                }
                                                zip.generateAsync(
                                                        {type: 'blob'})
                                                        .
                                                        then(
                                                                (
                                                                        content) => {
                                                            let formData = new FormData();
                                                            formData.append(
                                                                    'file',
                                                                    content,
                                                                    'MockupImages.zip'
                                                                    );

                                                            $.ajax(
                                                                    {
                                                                        url:
                                                                                baseUrl +
                                                                                '/save_mockup_product_image',
                                                                        type: 'POST',
                                                                        data: formData,
                                                                        processData: false,
                                                                        contentType: false,
                                                                        success: function (
                                                                                response) {
                                                                            $('#saved_zip_file_name').val(response.file_name);
                                                                            resolve();
                                                                        },
                                                                        error: function (
                                                                                xhr,
                                                                                status,
                                                                                error) {
                                                                            console.error(
                                                                                    'Error saving file to server:',
                                                                                    error
                                                                                    );
                                                                            reject(
                                                                                    error);
                                                                        },
                                                                    });
                                                        })
                                                        .
                                                        catch(
                                                                reject);
                                            } catch (error) {
                                                console.error(
                                                        'Error in saveImageToServerForCreateProduct:',
                                                        error
                                                        );
                                                reject(
                                                        error);
                                            }
                                        });
                                    }
                                    // For Create Product
                                    function submitPlaceOrderFormForCreateProduct() {
                                        return new Promise(
                                                (
                                                        resolve,
                                                        reject) => {
                                            const inputModalForm = $('form[id^="inputForm"]').serializeArray();
                                            const CreateProductForm = $('form[id^="design_values"]').serializeArray();
                                            const mockup_generator_id = $('#mockup_generator_id').val();
                                            const mockup_product_name = $('#mockup_product_name').val();
                                            const is_size_chart = $('#enable-size-chart').is(':checked');
                                            const productContents = $('.ql-editor').html();
                                            const isFrontHasDesign = window.isFrontHasDesign;
                                            const isBackHasDesign = window.isBackHasDesign;
                                            const isOtherPlacementsHasDesign = window.isOtherPlacementsHasDesign;

                                            let selectedSizeIds = [];
                                            const updatedPrices = [];

                                            const selectedField = inputModalForm.find((field) => field.name === 'multiSelectedSizes');

                                            if (selectedField) {
                                                selectedSizeIds = selectedField.value.split(','); // ["9", "2", "7", "568"]
                                            }

                                            $('.basePricePerSize').each(
                                                    function () {
                                                        const sizeId = $(
                                                                this)
                                                                .
                                                                closest(
                                                                        '.each-button')
                                                                .
                                                                find(
                                                                        '.size-button')
                                                                .
                                                                attr(
                                                                        'id');

                                                        if (selectedSizeIds.includes(
                                                                sizeId)) {
                                                            const updatedPrice =
                                                                    $(
                                                                            this).
                                                                    data(
                                                                            'updated-price') ?? 0;

                                                            updatedPrices.push(
                                                                    {
                                                                        sizeId: sizeId,
                                                                        updatedPrice: updatedPrice,
                                                                    });

                                                            // console.log(`Included - sizeId: ${sizeId}, updatedPrice: ${updatedPrice}`);
                                                        }
                                                    });


                                            const combinedData = {
                                                mockup_generator_id: mockup_generator_id,
                                                productContents: productContents,
                                                inputModalForm: inputModalForm,
                                                CreateProductForm: CreateProductForm,
                                                productTitle: mockup_product_name,
                                                is_size_chart: is_size_chart,
                                                updatedPrices: updatedPrices,
                                                isBackHasDesign: isBackHasDesign,
                                                isFrontHasDesign: isFrontHasDesign,
                                                isOtherPlacementsHasDesign: isOtherPlacementsHasDesign
                                            };

                                            const jsonData = JSON.stringify(combinedData);

                                            $.ajax(
                                                    {
                                                        url: baseUrl + '/save_product_values',
                                                        type: 'POST',
                                                        data: {formData: jsonData},
                                                        success: function (
                                                                response) {
                                                            if (response.status || response.success) {
                                                                // console.log(
                                                                //     'Response sent to dashboard.qikink.com'
                                                                // );
                                                                resolve();
                                                            } else {

                                                                reject(
                                                                        {msg: response.msg || 'Failed to save data'});
                                                            }

                                                        },
                                                        error: function (
                                                                xhr,
                                                                status,
                                                                error) {
                                                            console.error(
                                                                    'Error saving data:',
                                                                    error);
                                                            reject(
                                                                    error);
                                                        },
                                                    });
                                        });
                                    }

                                    function processOrder() {

                                        showLoader(
                                                'Creating your product. Please wait a moment...'
                                                );

                                        // Design placement validations
                                        res = designValidation(
                                                common_values);
                                        if (!res) {
                                            hideLoader();
                                            return false;
                                        }

                                        if (window.isCreateProduct == 3) {
                                            vres = validateSelectedSizes();
                                            if (!vres) {
                                                return;
                                            }
                                            if (($(
                                                    '.rightsidecontainer').
                                                    hasClass(
                                                            'mockup2')) || window.mockup_id == '16') {

                                                // console.log(
                                                //     "Acc function")
                                                saveImageToServerForCreateProductAcc()
                                                        .
                                                        then(
                                                                () =>
                                                            submitPlaceOrderFormForCreateProduct()
                                                        )
                                                        .
                                                        then(
                                                                () => {

                                                            setTimeout(() => {
                                                                $('.loader-div').addClass('d-none');
                                                                hideLoader();
                                                            }, 2000);

                                                            showToast(
                                                                    'Your Product Has Been Created.',
                                                                    'success',
                                                                    3000
                                                                    );

                                                            // setTimeout(() => {
                                                            //     window.location.href = window.location.pathname + '?category_id=' + window.category_id;
                                                            // }, 2000);


                                                            setTimeout(() => {
                                                                location.reload(); // or use window.location.reload();
                                                            }, 3000);


                                                        })
                                                        .
                                                        catch(
                                                                (
                                                                        error) => {
                                                            console.error(
                                                                    'Error occurred:',
                                                                    error);
                                                            console.log(
                                                                    error)

                                                            $(
                                                                    '.loader-div').
                                                                    addClass(
                                                                            'd-none');
                                                            if (error && typeof error === 'object' && error.msg) {
                                                                showToast(
                                                                        error.msg,
                                                                        'danger',
                                                                        4000);
                                                            } else {
                                                                showToast(
                                                                        'An error occurred. Please try again.',
                                                                        'error',
                                                                        3000);
                                                            }
                                                            hideLoader();
                                                        });
                                            } else {
                                                saveImageToServerForCreateProduct()
                                                        .
                                                        then(
                                                                () =>
                                                            submitPlaceOrderFormForCreateProduct()
                                                        )
                                                        .
                                                        then(
                                                                () => {
                                                            setTimeout(() => {
                                                                $('.loader-div').addClass('d-none');
                                                                hideLoader();
                                                            }, 2000);
                                                            showToast(
                                                                    'Your Product Has Been Created.',
                                                                    'success',
                                                                    3000
                                                                    );

                                                            // setTimeout(() => {
                                                            //     window.location.href = window.location.pathname + '?category_id=' + window.category_id;
                                                            // }, 2000);


                                                            setTimeout(() => {
                                                                location.reload(); // or use window.location.reload();
                                                            }, 3000);
                                                        })
                                                        .
                                                        catch(
                                                                (
                                                                        error) => {
                                                            console.error(
                                                                    'Error occurred:',
                                                                    error);
                                                            console.log(
                                                                    error)
                                                            $(
                                                                    '.loader-div').
                                                                    addClass(
                                                                            'd-none');
                                                            if (error && typeof error === 'object' && error.msg) {
                                                                showToast(
                                                                        error.msg,
                                                                        'danger',
                                                                        4000);
                                                            } else {
                                                                showToast(
                                                                        'An error occurred. Please try again.',
                                                                        'error',
                                                                        3000);
                                                            }
                                                            hideLoader();
                                                        });
                                            }
                                        } else {
                                            if (common_values.is_plain == 1) {
                                                saveMockupDesignOnServer()
                                                        .
                                                        then(
                                                                () => {
                                                            submitPlaceOrderForm();
                                                        })
                                                        .
                                                        catch(
                                                                (
                                                                        error) => {
                                                            console.error(
                                                                    'Error occurred:',
                                                                    error);

                                                        });
                                                hideLoader();
                                            } else if (common_values.is_plain == 0) {
                                                saveMockupDesignOnServer()
                                                        .
                                                        then(
                                                                () => {
                                                            submitPlaceOrderForm();
                                                        })
                                                        .
                                                        catch(
                                                                (
                                                                        error) => {
                                                            console.error(
                                                                    'Error occurred:',
                                                                    error);
                                                        });
                                                hideLoader();
                                            } else {
                                                console.error(
                                                        'Invalid value for common_values.is_plain'
                                                        );
                                                hideLoader();
                                            }
                                        }
                                    }

                                    processOrder();
                                });
            }

            function isAopProductCheck(
                    mockupId) {
                const isIdPresent = $(
                        '.rightsidecontainer').
                        hasClass(
                                'mockup2');

                if (isIdPresent) {
                    showToast(
                            'Please upload a design image!',
                            'danger',
                            4000
                            );
                } else {
                    showToast(
                            'Please upload a design or Enable plain product!',
                            'danger',
                            4000
                            );
                }
            }


            // For Validate the Mockup Design Placement Values before Save
            function designValidation(
                    common_values) {
                if (
                        typeof window.prices_json[
                                common_values.size + '_' + common_values.color
                        ] == 'undefined'
                        ) {
                    showToast(
                            'This Size & Color Combination Currently Not Available',
                            'danger',
                            4000
                            );
                    hideLoader();
                    return false;
                }
                if (!common_values.size) {
                    showToast(
                            'Please Select Your Required Size..!',
                            'danger',
                            4000);
                    hideLoader();
                    return false;
                }
                if (!common_values.color) {
                    showToast(
                            'Please Select Your Color..!',
                            'danger',
                            4000);
                    hideLoader();
                    return false;
                }
                if (window.isCreateProduct !== 3) {
                    if (!common_values.quantity) {
                        showToast(
                                'Please Select Valid Product Quantity..!',
                                'danger',
                                5000
                                );
                        hideLoader();
                        return false;
                    }
                }

                if (
                        typeof window.isCreateProduct !== 'undefined' &&
                        window.isCreateProduct == 3 &&
                        $('#defaultProductColor').length &&
                        $('#defaultProductColor').
                        val() == ''
                        ) {
                    showToast(
                            'Please Select Default Color of the Product, to be highlighted in your shop product list.',
                            'info',
                            4000
                            );
                    $(
                            '#defaultColorDropdown').
                            focus();
                    hideLoader();
                    return false;
                }

                let radioChecked = $(
                        "input[name='printingOption']:checked").
                        val();
                let vinylDropdown = document.getElementById(
                        'print_type_dropdown');

                if (
                        (!radioChecked && !common_values.is_plain) ||
                        (radioChecked === 'vinyl_printing' &&
                                (!vinylDropdown.value || vinylDropdown.value == ''))
                        ) {
                    showToast(
                            'Please select your Printing Option..!',
                            'danger',
                            4000);
                    hideLoader();
                    return false;
                }

                // if (radioChecked.value === 'vinyl_printing' && !vinylDropdown.value) {
                //     showToast("Please Select Any Vinyl Printing Option..!", 'danger', 5000);
                // }

                /*
                 * Check if design is requied
                 *
                 */
                var designJson = window.design_json;
                var keys = Object.keys(
                        designJson);
                var placements_counts = keys.length;

                if (common_values.is_plain == 0) {
                    let hasDesign = false;

                    for (let index = 0; index < placements_counts; index++) {
                        var designId = $(
                                '#' + index + '_designid').
                                val();
                        if (designId && designId.trim() !== '') {
                            hasDesign = true;
                            break; // no need to check further
                        }
                    }
                    if (!hasDesign) {
                        isAopProductCheck(
                                window.mockup_id);
                        hideLoader();
                        return false;
                    }

                }

                returnval = true;
                for (let index = 0; index < placements_counts; index++) {
                    var designId = $(
                            '#' + index + '_designid').
                            val();
                    placement = $(
                            '#' + index + '_placement').
                            val();

                    if (
                            typeof designJson[placement] !== 'undefined' &&
                            typeof designJson[placement].isRequired !== 'undefined' &&
                            designJson[placement].isRequired == '1'
                            ) {
                        if (!designId || designId == 1 || designId == '') {
                            placement = placement.replace(
                                    'Shoulder',
                                    'Sleeve');
                            showToast(
                                    'Design is needed for all placement',
                                    'warning',
                                    '3000'
                                    );
                            hideLoader();
                            returnval = false;
                        } else {

                        }
                    } else {

                    }
                }

                /*
                 * ENd
                 */

                return returnval;
            }

            // For Single mockup download With its Placements
            if ($(
                    '#image-button-single').length) {
                document
                        .getElementById(
                                'image-button-single')
                        .
                        addEventListener(
                                'click',
                                function () {
                                    // let indx = window.yourDesigner.currentViewIndex;

                                    async function applyColorSelection() {
                                        const zip = new JSZip(); // Create a new ZIP instance

                                        const designJson = window.design_json;
                                        const keys = Object.keys(
                                                designJson);
                                        const placements_counts = keys.length;

                                        for (let index = 0; index < placements_counts; index++) {
                                            // Wait for the product data URL to be available
                                            const dataURL = await new Promise(
                                                    (
                                                            resolve) => {
                                                opx = {};
                                                window.yourDesigner.getProductDataURL(
                                                        function (
                                                                dataURL) {
                                                            resolve(
                                                                    dataURL);
                                                        },
                                                        '#000',
                                                        opx,
                                                        [index, parseInt(
                                                                    index) + parseInt(
                                                                    1)]
                                                        );
                                            });

                                            var img = new Image();
                                            img.src = dataURL;
                                            img.crossOrigin = 'Anonymous';

                                            await new Promise(
                                                    (
                                                            resolve) => {
                                                img.onload = function () {
                                                    // Convert image to data URL
                                                    const canvas = document.createElement(
                                                            'canvas');
                                                    const ctx = canvas.getContext(
                                                            '2d');
                                                    canvas.width = img.width;
                                                    canvas.height = img.height;
                                                    ctx.drawImage(
                                                            img,
                                                            0,
                                                            0);

                                                    // Add image to ZIP file
                                                    canvas.toBlob(
                                                            (
                                                                    blob) => {
                                                        zip.file(`
                                                                
                                                                        image${index + 1}.png`,
                                                                blob);
                                                        resolve();
                                                    },
                                                            'image/png');
                                                };
                                            });
                                        }

                                        // Generate the ZIP file and trigger download
                                        zip.generateAsync(
                                                {type: 'blob'}).
                                                then(
                                                        function (
                                                                content
                                                                ) {
                                                            var link = document.createElement(
                                                                    'a');
                                                            const date = new Date();
                                                            const pad = (
                                                                    number) =>
                                                                number.toString().
                                                                        padStart(
                                                                                2,
                                                                                '0');
                                                            const day = pad(
                                                                    date.getDate());
                                                            const month = pad(
                                                                    date.getMonth() + 1);
                                                            const year = date.getFullYear();
                                                            const hours = pad(
                                                                    date.getHours());
                                                            const minutes = pad(
                                                                    date.getMinutes());
                                                            const seconds = pad(
                                                                    date.getSeconds());
                                                            const formattedDate = `${month}${day}${year}_${hours}:${minutes}:${seconds}`;

                                                            link.href = URL.createObjectURL(
                                                                    content);
                                                            link.download =
                                                                    'SingleProductMockup_' + formattedDate + '.zip';
                                                            link.click();
                                                        });
                                    }

                                    applyColorSelection();
                                });
            }

            /*
             * Zip download code
             */
            if ($(
                    '#image-button').length) {
                document
                        .getElementById(
                                'image-button')
                        .
                        addEventListener(
                                'click',
                                function () {
                                    let indx = window.yourDesigner.currentViewIndex;
                                    async function applyColorSelection() {
                                        const colorButtons =
                                                document.querySelectorAll(
                                                        '.color-button');
                                        const zip = new JSZip(); // Create a new ZIP instance

                                        for (const [index, button] of colorButtons.entries()) {
                                            const colorCode = button.getAttribute(
                                                    'bg-color');
                                            let shirt_obj =
                                                    window.yourDesigner.getElementByTitle(
                                                            'Shirt');
                                            let tParam = {fill: colorCode};
                                            window.yourDesigner.setElementParameters(
                                                    tParam,
                                                    shirt_obj
                                                    );

                                            // Wait for the product data URL to be available
                                            const dataURL = await new Promise(
                                                    (
                                                            resolve) => {
                                                opx = {};
                                                window.yourDesigner.getProductDataURL(
                                                        function (
                                                                dataURL) {
                                                            resolve(
                                                                    dataURL);
                                                        },
                                                        '#000',
                                                        opx,
                                                        [indx, parseInt(
                                                                    indx) + parseInt(
                                                                    1)]
                                                        );
                                            });

                                            var img = new Image();
                                            img.src = dataURL;
                                            img.crossOrigin = 'Anonymous';

                                            await new Promise(
                                                    (
                                                            resolve) => {
                                                img.onload = function () {
                                                    // Convert image to data URL
                                                    const canvas = document.createElement(
                                                            'canvas');
                                                    const ctx = canvas.getContext(
                                                            '2d');
                                                    canvas.width = img.width;
                                                    canvas.height = img.height;
                                                    ctx.drawImage(
                                                            img,
                                                            0,
                                                            0);

                                                    // Add image to ZIP file
                                                    canvas.toBlob(
                                                            (
                                                                    blob) => {
                                                        zip.file(`image${index + 1}.png`,
                                                                blob);
                                                        resolve();
                                                    },
                                                            'image/png');
                                                };
                                            });

                                            await new Promise(
                                                    (
                                                            resolve) =>
                                                setTimeout(
                                                        resolve,
                                                        100)
                                            ); // Delay in milliseconds 
                                        }

                                        // Generate the ZIP file and trigger download
                                        zip.generateAsync(
                                                {type: 'blob'}).
                                                then(
                                                        function (
                                                                content
                                                                ) {
                                                            var link = document.createElement(
                                                                    'a');
                                                            const date = new Date();
                                                            const pad = (
                                                                    number) =>
                                                                number.toString().
                                                                        padStart(
                                                                                2,
                                                                                '0');
                                                            const day = pad(
                                                                    date.getDate());
                                                            const month = pad(
                                                                    date.getMonth() + 1);
                                                            const year = date.getFullYear();
                                                            const hours = pad(
                                                                    date.getHours());
                                                            const minutes = pad(
                                                                    date.getMinutes());
                                                            const seconds = pad(
                                                                    date.getSeconds());
                                                            const formattedDate = `${month}${day}${year}_${hours}:${minutes}:${seconds}`;

                                                            link.href = URL.createObjectURL(
                                                                    content);
                                                            link.download =
                                                                    'MockupImages_' + formattedDate + '.zip';
                                                            link.click();
                                                        });
                                    }

                                    applyColorSelection();
                                });
            }
            /*
             * Zip download end
             */

            qikink_upload_id_field = $(
                    '.btn-fileupload').
                    attr(
                            'data-filefield');

            $(
                    '.btn-fileupload').
                    on(
                            'click',
                            function (
                                    e) {
                                e.preventDefault();
                                upload_form_data = {};
                                upload_form_data.field_name = $(
                                        this).
                                        attr(
                                                'data-filefield');
                                upload_form_data.allowed_format = $(
                                        this).
                                        attr(
                                                'data-allowed');
                                upload_form_data.save_path = $(
                                        this).
                                        attr(
                                                'data-savepath');
                                upload_form_data.send_path = $(
                                        this).
                                        attr(
                                                'data-sendpath');
                                upload_form_data.callback = mockupImageUploaded;

                                if ($(
                                        this).
                                        attr(
                                                'data-callbackstr')) {
                                    upload_form_data.callback = $(
                                            this).
                                            attr(
                                                    'data-callbackstr');
                                }

                                $(
                                        '.btn-fileupload').
                                        on(
                                                'change');
                                qikink_fileupload_ajax_call(
                                        'post',
                                        upload_form_data,
                                        upload_form_data.callback
                                        );
                            });
            $(
                    '#fileDesign').
                    on(
                            'change',
                            function (
                                    e) {
                                files = e.target.files;
                                // e.preventDefault();
                                upload_form_data = {};
                                upload_form_data.field_name = $(
                                        this).
                                        attr(
                                                'data-filefield');
                                upload_form_data.allowed_format = $(
                                        this).
                                        attr(
                                                'data-allowed');
                                upload_form_data.save_path = $(
                                        this).
                                        attr(
                                                'data-savepath');
                                upload_form_data.send_path = $(
                                        this).
                                        attr(
                                                'data-sendpath');
                                upload_form_data.callback = mockupImageUploaded;

                                if ($(
                                        this).
                                        attr(
                                                'data-callbackstr')) {
                                    upload_form_data.callback = $(
                                            this).
                                            attr(
                                                    'data-callbackstr');
                                }

                                $(
                                        '.btn-fileupload').
                                        on(
                                                'change');
                                qikink_fileupload_ajax_call(
                                        'post',
                                        upload_form_data,
                                        upload_form_data.callback
                                        );
                            });

            //$.fn.modal.Constructor.prototype._enforceFocus = function () {};
            $.ajaxSetup(
                    {
                        headers: {
                            'X-CSRF-TOKEN': $(
                                    'meta[name="X-CSRF-TOKEN"]').
                                    attr(
                                            'content'),
                        },
                    });
            if (typeof $.fn.select2 == 'function') {
                clientSearchUrl = baseUrl + '/admin/client/search';
                $(
                        '.ajax-client-select').
                        select2(
                                {
                                    ajax: {
                                        url: clientSearchUrl, // Replace with your data source URL
                                        type: 'POST',
                                        dataType: 'json', // Data type you expect to receive (json, xml, etc.)
                                        delay: 250, // Delay in milliseconds before making the request
                                        data: function (
                                                params) {
                                            return {
                                                term: params.term, // Pass the user's input as 'term'
                                            };
                                        },
                                        processResults: function (
                                                data) {
                                            return {
                                                results: data,
                                            };
                                        },
                                    },
                                    minimumInputLength: 3, // Minimum number of characters required
                                    cache: true, // Optional: Cache the AJAX responses for faster loading
                                });
            }
        });

function showToast(
        text,
        className,
        Time = 0) {
    var tduration = (Time = 0 ? 8000 : Time);

    toastData = {};
    Toastify(
            {
                newWindow: true,
                text: text,
                gravity: 'top',
                position: 'right',
                className: 'bg-' + className,
                stopOnFocus: true,
                offset: {
                    x: toastData.offset ? 50 : 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
                    y: toastData.offset ? 10 : 0, // vertical axis - can be a number or a string indicating unity. eg: '2em'
                },
                duration: tduration,
                close: toastData.close === 'close' ? true : false,
                style:
                        toastData.style === 'style'
                        ? {
                            background: 'linear-gradient(to right, #0AB39C, #405189)',
                        }
                : '',
            }).
            showToast();
}
function initJQTable(
        gridOptions,
        moduleName,
        actions,
        defaultActions = 1,
        grid_name = '#jqGrid'
        ) {
    grid_name_pager = grid_name + 'Pager';
    if (defaultActions == 1) {
        var jqActions = {
            edit: true,
            add: true,
            del: true,
            search: true,
            view: true,
            ...actions,
        };
    } else {
        var jqActions = {
            edit: false,
            add: false,
            search: false,
            view: false,
            ...actions,
        };
    }

    $.jgrid.defaults.width = 780;
    $(
            grid_name).
            jqGrid(
                    {
                        datatype: 'json',
                        recreateFilter: true,
                        mtype: 'GET',
                        loadOnce: false,
                        multiselect: false,
                        rowNum: 500,
                        rowList: [500, 1000, 1500],
                        pager: '#jqGridPager',
                        gridview: true,
                        rownumbers: true,
                        toppager: true,
                        viewrecords: true,
                        footerrow: false,
                        autowidth: true,
                        height: 'auto',
                        width: '100%',
                        rowheight: 300,
                        sortorder: 'desc',
                        ...gridOptions,
                    });

    $(
            grid_name).
            jqGrid(
                    'navGrid',
                    grid_name_pager,
                    {...jqActions, refresh: true, position: 'left', cloneToTop: true},
                    {
                        height: 'auto',
                        width: 'min-content',
                        editCaption: `Edit ${moduleName}`,
                        recreateForm: true,
                        checkOnUpdate: true,
                        checkOnSubmit: true,
                        closeAfterEdit: true,
                        onclickSubmit: function (
                                params,
                                posdata) { },
                        beforeShowForm: function (
                                frm,
                                data) { },
                        afterSubmit: function (
                                response,
                                postdata) {
                            if (response.status == 200) {
                                if (response.responseJSON.status === true) {
                                    showToast(
                                            response.responseJSON.message,
                                            'success');
                                    return [true, response.responseJSON.message];
                                } else {
                                    showToast(
                                            response.responseJSON.message,
                                            'error');
                                    return [false, response.responseJSON.message];
                                }
                            }
                        },
                    },
                    {
                        height: 'auto',
                        width: 'min-content',
                        closeAfterAdd: true,
                        recreateForm: true,
                        addCaption: `Add ${moduleName}`,
                        onclickSubmit: function (
                                params,
                                posdata) { },
                        beforeShowForm: function (
                                frm) {
                            userId = null;
                        },
                        afterSubmit: function (
                                response,
                                postdata) {
                            if (response.status == 200) {
                                if (response.responseJSON.status === true) {
                                    showToast(
                                            response.responseJSON.message,
                                            'success');
                                    return [true, response.responseJSON.message];
                                } else {
                                    showToast(
                                            response.responseJSON.message,
                                            'error');
                                    return [false, response.responseJSON.message];
                                }
                            }
                        },
                        errorTextFormat: function (
                                data) {
                            if (data.status !== 200) {
                                showToast(
                                        data.statusText,
                                        'error');
                            }
                        },
                    },
                    {
                        height: 'auto',
                        width: 600,
                        deleteCaption: `Delete ${moduleName}`,
                        afterSubmit: function (
                                response,
                                postdata) {
                            if (response.status == 200) {
                                if (response.responseJSON.status === true) {
                                    showToast(
                                            response.responseJSON.message,
                                            'success');
                                    return [true, response.responseJSON.message];
                                } else {
                                    showToast(
                                            response.responseJSON.message,
                                            'error');
                                    return [false, response.responseJSON.message];
                                }
                            }
                        },
                        errorTextFormat: function (
                                data) {
                            if (data.status !== 200) {
                                showToast(
                                        data.statusText,
                                        'error');
                            }
                        },
                    },
                    {
                        height: 'auto',
                        width: 600,
                    }
            );
    $(
            grid_name).
            jqGrid(
                    'filterToolbar',
                    {
                        stringResult: true,
                        searchOnEnter: true,
                    });
}
function passwordCheck(
        value,
        colname) {
    if (value === '') {
        return [true, ''];
    }
    if (value === $(
            '#conf_password').
            val()) {
        return [true, ''];
    }
    return [false, 'Passwords Does not match'];
}

function qikink_fileupload_ajax_call(
        posttype,
        upload_form_data,
        callback) {
    event.stopPropagation(); // Stop stuff happening
    event.preventDefault(); // Totally stop stuff happening


    // START A LOADING SPINNER HERE

    // Create a formdata object and add the files
    var data = new FormData();
    if (files) {
        $.each(
                files,
                function (
                        key,
                        value) {
                    data.append(
                            upload_form_data.field_name,
                            value);
                });
        data.append(
                'save_path',
                upload_form_data.save_path);
        data.append(
                'field_name',
                upload_form_data.field_name);
    }

    $.ajax(
            {
                url: upload_form_data.send_path,
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (
                        data,
                        textStatus,
                        jqXHR) {
                    if (data.image_upload == true) {
                        $(
                                '#jqGridImages').
                                trigger(
                                        'reloadGrid');
                    }
                    if (typeof callback == 'object') {
                        callback(
                                data);
                    } else {
                        if (typeof window[callback] !== 'undefined') {
                            window[callback](
                                    data);
                        } else {
                            callback(
                                    data);
                        }
                    }
                },
                error: function (
                        jqXHR,
                        textStatus,
                        errorThrown) {
                    window[callback](
                            data);
                },
            });
}
function prepareUpload(
        event) {
    files = event.target.files;
}

function mobilenoCheck(
        value,
        colname) {
    if (value.length == 10) {
        return [true, ''];
    }
    return [false, 'Invalid Mobile No'];
}

function qikink_basic_ajax_call(
        method = 'post',
        url,
        data,
        sdataType,
        callback,
        param1 = 0
        ) {
    $.ajax(
            {
                type: method,
                url: url,
                data: data,
                dataType: sdataType,
                success: function (
                        response) {
                    if (param1) {
                        callback(
                                response,
                                param1);
                    } else {
                        callback(
                                response);
                    }
                },
            });
}

function mockupImageUploaded(
        resp = 0) {
    if (!resp) {
        if (this && typeof this.status !== 'undefined') {
            resp = this;
        }
    }
    if (resp && resp.status) {
        showToast(
                'Image Uplaod Sucesfully..!',
                'success');
    } else {
        msg = 'Error';
        if (resp) {
            msg = resp.message;
        }
        showToast(
                'Image Uplaod Failed..!',
                'danger');
}
}

document.querySelectorAll(
        '.swiper-content').
        forEach(
                function (
                        image) {
                    image.addEventListener(
                            'click',
                            function () {
                                handleSwiperImageClick(
                                        window.yourDesigner.currentViewIndex);
                            });
                });

function handleSwiperImageClick(
        idx) {
    var designid = document.getElementById(
            'width');
    designid.value = '';

    var placement = document.getElementById(
            'height');
    placement.value = '';
}
