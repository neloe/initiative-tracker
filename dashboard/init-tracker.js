// NODECG STUFF

const initlistReplicant = nodecg.Replicant('initiative_list')

// Query the list element
const list = document.getElementById('list');

let draggingEle;
let placeholder;
let isDraggingStarted = false;

// The current position of mouse relative to the dragging element
let x = 0;
let y = 0;

function update_replicant()
{
    const initiative = []
    for (x of list.children)
    {
        if (x.children[0].value != '')
            initiative.push(x.children[0].value)
    }
    if (initiative.toString() != initlistReplicant.value.toString())
    {
        console.log(initiative)
        initlistReplicant.value = initiative
    }
}


// Swap two nodes
const swap = function (nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
};

// Check if `nodeA` is above `nodeB`
const isAbove = function (nodeA, nodeB) {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
};

const mouseDownHandler = function (e) {
    draggingEle = e.target;

    // Calculate the mouse position
    const rect = draggingEle.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    const draggingRect = draggingEle.getBoundingClientRect();

    if (!isDraggingStarted) {
        isDraggingStarted = true;

        // Let the placeholder take the height of dragging element
        // So the next element won't move up
        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
        placeholder.style.height = `${draggingRect.height}px`;
    }

    // Set position for dragging element
    draggingEle.style.position = 'absolute';
    draggingEle.style.top = `${e.pageY - y}px`;
    draggingEle.style.left = `${e.pageX - x}px`;

    // The current order
    // prevEle
    // draggingEle
    // placeholder
    // nextEle
    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;

    // The dragging element is above the previous element
    // User moves the dragging element to the top
    if (prevEle && isAbove(draggingEle, prevEle)) {
        // The current order    -> The new order
        // prevEle              -> placeholder
        // draggingEle          -> draggingEle
        // placeholder          -> prevEle
        swap(placeholder, draggingEle);
        swap(placeholder, prevEle);
        return;
    }

    // The dragging element is below the next element
    // User moves the dragging element to the bottom
    if (nextEle && isAbove(nextEle, draggingEle)) {
        // The current order    -> The new order
        // draggingEle          -> nextEle
        // placeholder          -> placeholder
        // nextEle              -> draggingEle
        swap(nextEle, placeholder);
        swap(nextEle, draggingEle);
    }
};

const mouseUpHandler = function () {
    // Remove the placeholder
    placeholder && placeholder.parentNode.removeChild(placeholder);

    draggingEle.style.removeProperty('top');
    draggingEle.style.removeProperty('left');
    draggingEle.style.removeProperty('position');

    x = null;
    y = null;
    draggingEle = null;
    isDraggingStarted = false;

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    update_replicant()
};

// Query all items
/*[].slice.call(list.querySelectorAll('.draggable')).forEach(function (item) {
    item.addEventListener('mousedown', mouseDownHandler);
});*/

const remove_elt = function(elt_id)
{
    torm = document.getElementById(et_id)
    torm.remove_elt
    update_replicant()
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function add_elt(text='')
{
    const new_id = generateUUID()
    const new_elt = document.createElement('div')
    new_elt.setAttribute('id',new_id)
    new_elt.setAttribute('class', 'draggable')
    const text_input = document.createElement('input')
    text_input.setAttribute('type','text')
    text_input.setAttribute('oninput','update_replicant()')
    text_input.setAttribute('value', text)
    new_elt.appendChild(text_input)
    const rmbutton = document.createElement('button')
    rmbutton.setAttribute('onclick','document.getElementById("'+new_id+'").remove()')
    rmbutton.setAttribute('class','button')
    const icon = document.createElement('i')
    icon.setAttribute('class',"fa fa-trash")
    new_elt.addEventListener('mousedown', mouseDownHandler)
    text_input.removeEventListener('mousedown', mouseDownHandler)
    rmbutton.removeEventListener('mousedown', mouseDownHandler)
    rmbutton.appendChild(icon)
    new_elt.appendChild(rmbutton)
    
    document.getElementById('list').appendChild(new_elt)
}

// initialize init list
nodecg.readReplicant('initiative_list', 'initiative-tracker', value=>{
    console.log(value)
    for (x of value)
        add_elt(x)
})