// Mockup Design Alignments JS Codes


// For Align the Design Image to Center of the Bounding Box
$("#center-align-icon").on("click", function () {
    const currentViewInstance = yourDesigner.currentViewInstance;
    if (currentViewInstance) {
        const design_obj = currentViewInstance.getElementByTitle("Design");
        if (design_obj) {
            const qikParam = {
                autoCenter: true,
            };
            yourDesigner.setElementParameters(qikParam, design_obj);
        } 
    }
});



// For Flip the Design Image to left
$(".fpd-icon-flip-horizontal").on("click", function () {
  const currentViewInstance = yourDesigner.currentViewInstance;
  // console.log(currentViewInstance)
  if (currentViewInstance) {
    const design_obj = currentViewInstance.getElementByTitle("Design");

    if (design_obj) {
      const currentFlipX = design_obj.flipX || 0;
      const newFlipX = currentFlipX === 1 ? 0 : 1;

      const qikParam = {
        flipX: newFlipX,
      }; 

      yourDesigner.setElementParameters(qikParam, design_obj);
    } else {
      console.warn(
        `No design found in the current placement: ${currentViewInstance.title}`
      );
    }
  }
});




// For Flip the Design Image to Right
$(".fpd-icon-flip-vertical").on("click", function () {
    const currentViewInstance = yourDesigner.currentViewInstance;
    if (currentViewInstance) {
      const design_obj = currentViewInstance.getElementByTitle("Design");
  
      if (design_obj) {
        const currentFlipX = design_obj.flipY || 0;
        const newFlipX = currentFlipX === 1 ? 0 : 1;
        const qikParam = {
          flipY: newFlipX,
        };
        yourDesigner.setElementParameters(qikParam, design_obj);

      } else {
        console.warn(
          `No design found in the current placement: ${currentViewInstance.title}`
        );
      }
    }
});




// For Align the design into Horizontally Center
$(".ri-align-item-horizontal-center-line").on("click", function () {
    const currentViewInstance = yourDesigner.currentViewInstance;
    if (currentViewInstance) {
        const design_obj = currentViewInstance.getElementByTitle("Design");
        if (design_obj) {
            currentViewInstance.centerElement(1, 0, design_obj);
        } else {
            console.warn("No design found with the title 'Design' in the current view");
        }
    }
});




// For Align the design into Vertical Center
$(".ri-align-item-vertical-center-line").on("click", function () {
    const currentViewInstance = yourDesigner.currentViewInstance;
    if (currentViewInstance) {
        const design_obj = currentViewInstance.getElementByTitle("Design");
        if (design_obj) {
            currentViewInstance.centerElement(0, 1, design_obj);
        } else {
            console.warn("No design found with the title 'Design' in the current view");
        }
    }
});



// For Undo The Last Changes Only in Fancy product Designer
let isUndoReset = false;
$('#undo_zoom_percentage').on('click', function() {

    var currentViewInstance = yourDesigner.currentViewInstance;

    if (currentViewInstance) {
        if (!isUndoReset) {
            currentViewInstance.undo();
            // console.log('Undo last change triggered.');
            isUndoReset = true;
        } else {
            console.log('No changes to undo at this moment.');
        }
    }
});




// For Align the design into left when Its Outside of the BoundryBox
$("#align-left").on("click", function () {
  const design_obj = yourDesigner.getElementByTitle("Design");
  yourDesigner.currentViewInstance.alignElement("left", design_obj);
});



// For Align the design into Right when Its Outside of the BoundryBox
$("#align-right").on("click", function () {
  const design_obj = yourDesigner.getElementByTitle("Design");
  yourDesigner.currentViewInstance.alignElement("right", design_obj);
});



// For Align the design into Top when Its Outside of the BoundryBox
$("#align-top").on("click", function () {
  const design_obj = yourDesigner.getElementByTitle("Design");
  yourDesigner.currentViewInstance.alignElement("top", design_obj);
});



// For Align the design into Bottom when Its Outside of the BoundryBox
$("#align-bottom").on("click", function () {
  const design_obj = yourDesigner.getElementByTitle("Design");
  yourDesigner.currentViewInstance.alignElement("bottom", design_obj);
});



