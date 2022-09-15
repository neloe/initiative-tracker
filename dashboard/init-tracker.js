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

function remove_elt(elt_id)
{
    torm = document.getElementById(elt_id)
    torm.remove()
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

function move_up(elt_id)
{

}
function move_down(elt_id)
{
    
}

function add_elt(text='')
{
    const new_id = generateUUID()
    const new_elt = document.createElement('div')
    new_elt.setAttribute('id',new_id)
    new_elt.setAttribute('class','draggable')
    const text_input = document.createElement('input')
    text_input.setAttribute('type','text')
    text_input.setAttribute('oninput','update_replicant()')
    text_input.setAttribute('value', text)
    new_elt.appendChild(text_input)
    const rmbutton = document.createElement('button')
    rmbutton.setAttribute('onclick',`remove_elt("${new_id}")`)
    rmbutton.setAttribute('class','button')
    const icon = document.createElement('i')
    icon.setAttribute('class',"fa fa-trash")
    rmbutton.appendChild(icon)

    const upbutton = document.createElement('button')
    upbutton.setAttribute('onclick',`move_up("${new_id}")`)
    upbutton.setAttribute('class','button')
    const upicon = document.createElement('i')
    upicon.setAttribute('class',"fa fa-angle-up")
    upbutton.appendChild(upicon)

    const downbutton = document.createElement('button')
    downbutton.setAttribute('onclick',`move_down("${new_id}")`)
    downbutton.setAttribute('class','button')
    const downicon = document.createElement('i')
    downicon.setAttribute('class',"fa fa-angle-down")
    downbutton.setAttribute('disabled','true')
    downbutton.appendChild(downicon)


    new_elt.appendChild(rmbutton)
    new_elt.appendChild(upbutton)
    new_elt.appendChild(downbutton)
    list.appendChild(new_elt)
    console.log(new_elt.previousSibling, new_elt.previousElementSibling, new_elt.nextSibling)
    if(!new_elt.previousElementSibling)
        upbutton.setAttribute('disabled','true')
    else
    {
        console.log(new_elt.previousElementSibling.childNodes)
        new_elt.previousElementSibling.childNodes[3].disabled=false
    }
}

// initialize init list
nodecg.readReplicant('initiative_list', 'initiative-tracker', value=>{
    console.log(value)
    if (value)
        for (x of value)
            add_elt(x)
})