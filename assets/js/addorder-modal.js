
function getSelDesignsModal(idx = null, objData = "") {


    if (idx != null) {
        if (objData != "" && objData != null) {
            jsonData=window.mockupJsonData[0];
            var designid = document.getElementById(idx + "_designid");
            designid.value = objData.design_id;
            $("#"+ idx + "_designid").val(objData.design_id);
            var placement = document.getElementById(idx + "_placement");
            placement.value = jsonData[idx].title;
            $("#"+ idx + "_placement").val(jsonData[idx].title);

        } else {
            var designid = document.getElementById(idx + "_designid");
            designid.value = "";
              $("#"+ idx + "_designid").val("");
            var placement = document.getElementById(idx + "_placement");
            placement.value = "";
             $("#"+ idx + "_placement").val("");
        }
    }
};


function getSelDesignsModalAfter(idx = null, objData = "") {

    var width = objData.width;
    var ord_width = document.getElementById(idx + "_width");
    ord_width.value = width;

    var height = objData.height;
    var ord_height = document.getElementById(idx + "_height");
    ord_height.value = height;

    var img_dpi = document.getElementById("dpi").value;
    var ord_dpi = document.getElementById(idx + "_dpi");
    ord_dpi.value = img_dpi;

};




function getimgSize(val) {
    var ord_size = document.getElementById("ord_size");
    
    if(ord_size){
    ord_size.value = val;
    }
};



function getimgColor(val,color_id) {

    var ord_color = document.getElementById("ord_color");
    ord_color.value = val;

    var ord_color = document.getElementById("ord_color");
    ord_color.value = color_id;
};



function getProductQuantity(val) {
    var quantity = document.getElementById("quantity");
    if(quantity){
    quantity.value = val;
    }
}



function getPlainOrderCheck(val){
    var is_plain = document.getElementById("is_plain");
    if(is_plain){
    is_plain.value = val;
    }
}



function getPrintTypeVal(idx, val) {
     // handle vinyl printing
    if(val=="vinyl_printing"){
        val=$("#print_type_dropdown").val();
    }
    design_element = yourDesigner.getElementByTitle("Design");
    if (design_element) {
        yourDesigner.currentViewInstance.removeElement(design_element);
    }

    var printtype = document.getElementById(idx + "_printtype");
    var cur_placement = document.getElementById(idx + "_placement");
    printtype.value = val;
    setTimeout(function(){
        $("#"+idx + "_printtype").val(val);
    },0);
   
    getValueAsPerPrintType(val);
    /*
     // below lines are optional and may work without the below lines.
     var designObject = typeof window.design_json === 'string' ? JSON.parse(window.design_json) : window.design_json;
     
     if (designObject[cur_placement].hasOwnProperty("boundingBox" + idx)) {
     boundingparams = designObject[cur_placement]["boundingBox" + idx];
     } else {
     boundingparams = designObject[cur_placement]["boundingBox"];
     }
     
     
     let design_obj = yourDesigner.currentViewInstance.getElementByTitle('Design');
     if (design_obj) {
     tParam = {"boundingBox": boundingparams};
     yourDesigner.setElementParameters(tParam, shirt_obj);
     }
     */
}



function changeBoundingBoxElementsForDTF(designObject, oldBoundingBoxValues, id) {




    var keys = Object.keys(designObject);

    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var placements = designObject[key];
        var placement = designObject[key];

        if (!oldBoundingBoxValues.hasOwnProperty(key)) {
            oldBoundingBoxValues[key] = placements.boundingBox;
        }

        if (id == 17) {
            const design_element = yourDesigner.getElementByTitle("Design");
            if (design_element) {
                yourDesigner.currentViewInstance.removeElement(design_element);
            }

            // Update boundingBox to boundingBox_17
            if (placement.hasOwnProperty('boundingBox_17')) {
                placements.boundingBox = placement.boundingBox_17;
            }

            // Update shirt object with the new bounding box
            let shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
            if (yourDesigner && typeof yourDesigner.setElementParameters === 'function') {
                let tParam = { "boundingBox": placements.boundingBox };
                yourDesigner.setElementParameters(tParam, shirt_obj);
            }
            console.log(`${key} Bounding Box 17:`, placements.boundingBox);

        } else {
            // Revert to the old boundingBox value if id is not 17
            if (oldBoundingBoxValues.hasOwnProperty(key)) {
                placements.boundingBox = oldBoundingBoxValues[key];
            }

            // Update shirt object with the reverted bounding box
            let shirt_obj = yourDesigner.currentViewInstance.getElementByTitle('Shirt');
            if (yourDesigner && typeof yourDesigner.setElementParameters === 'function') {
                let tParam = { "boundingBox": placements.boundingBox };
                console.log("Restoring boundingBox:", tParam);
                yourDesigner.setElementParameters(tParam, shirt_obj);
            }
            console.log(`${key} Bounding Box all:`, placements.boundingBox);
        }
    }
}


// For Default Set Quantity for 1
jQuery(document).ready(function () {
    getProductQuantity(1);
    getPlainOrderCheck(0);
});
