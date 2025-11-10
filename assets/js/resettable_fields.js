function populateResettableFields(jsonData) {
    // Clear existing contents of resettable_fields
    $('.resettable_fields').empty();
    
    // Check if jsonData is valid
    if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
        console.error('Invalid jsonData parameter');
        return;
    }
    let $container = $(`.resettable_fields`);
        if ($container.length === 0) {
            $container = $('<div>').addClass('resettable_fields');
            $('#inputForm').append($container); // You can change 'body' to a specific selector
        }
    // Loop through the first element of jsonData
    Object.entries(jsonData[0]).forEach(([key, section], index) => {
        // Find or create the container div
    
        
        // Create all input fields
        const fields = [
            { name: 'designid', value: '' || '', placeholder: `${key}_designid` },
            { name: 'width', value: '', placeholder: `${key}_width` },
            { name: 'height', value: '', placeholder: `${key}_height` },
            { name: 'dpi', value: '', placeholder: `${key}_dpi` },
            { name: 'printtype', value: '', placeholder: `${key}_print type` },
            { name: 'placement', value: section.title || '', placeholder: `${key}_placement` },
            { name: 'mockup_url', value: '', placeholder: `${key}_mockup_url` },
            { name: 'zoom_percentage', value: '', placeholder: `${key}_zoom_percentage` },
            { name: 'design_angle', value: '', placeholder: `${key}_design_angle` }
        ];

        fields.forEach(field => {
            const $input = $('<input>')
                .attr({
                    type: 'hidden',
                    name: `${key}_${field.name}`,
                    id: `${key}_${field.name}`,
                    placeholder: field.placeholder,
                    value: field.value
                });
            $container.append($input);
        });
    });
}

// Example usage:
/*
let sampleJsonData = [{
    "front": { "title": "Front Section" },
    "back": { "title": "Back Section" }
}];

let defaultDesignId = "12345";
populateResettableFields(sampleJsonData, defaultDesignId);
*/