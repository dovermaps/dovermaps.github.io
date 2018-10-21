const color = "#000000";

const relationship = {
    'Arts': 'Art Block',
    'Computer Science': 'Middle School Block',
    'Design & Technology': 'Science Block',
    'Economics': 'Art Block',
    'English': 'High School Block',
    'Film': 'Middle School Block',
    'History': 'Art Block',
    'Languages': 'Middle School Block',
    'Mathematics': 'Mathematics Block',
    'Philosophy': 'Art Block',
    'Science': 'Science Block',
    'Theatre': 'High School Block',
    'TOK': 'Art Block'
};

function checkOptions() {
    if (subjectAtLocation()) {
        document.getElementById('warning').style.display = 'block';
    } else {
        document.getElementById('warning').style.display = 'none';
    }
}

function subjectAtLocation() {
    const chosenLocation = document.getElementById('location').value;
    const chosenSubject = document.getElementById('subject').value;
    if (relationship[chosenSubject] == chosenLocation) {
        return true;
    } else {
        return false;
    }
}

function submit() {
    const chosenLocation = document.getElementById('location').value;
    const chosenSubject = document.getElementById('subject').value;
    if (!subjectAtLocation() && chosenLocation != 'Select a location' && chosenSubject != 'Select a subject') {
        document.getElementById('subject-location-form').submit();
    }
}

function drawRoute() {
    let urlParams = new URLSearchParams(window.location.search);
    let location1 = urlParams.get('location');
    // location1 represents current location
    let subject = urlParams.get('subject');
    if (subject == null || location1 == null) {
        window.location.href = './index.html';
    }
    let location2 = relationship[subject];
    // location2 represents the location revoled around the subject
    let path = direction[location1 + ' to ' + location2];
    let order = "no change"; 
    // order is used to signify the ending point of the path
    if (!path) {
        path = direction[location2 + ' to ' + location1];
        order = "reversed";
    }
    // this if statement is used to reverse the path if you want to go from location2 to location1
    let c = document.getElementById('map');
    let ctx = c.getContext('2d');
    // ctx - context represents what is written in the canvas

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    drawPath(ctx, path, order);

    ctx.stroke();
    // context stroke used to construct a path from the two waypoints programmed in the map
}

function drawArrow(ctx, orientation, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (orientation == "up") {
        ctx.lineTo(x - 6, y + 6);
        ctx.lineTo(x + 6, y + 6);
        ctx.lineTo(x, y);
    } else if (orientation == "down") {
        ctx.lineTo(x - 6, y - 6);
        ctx.lineTo(x + 6, y - 6);
        ctx.lineTo(x, y);
    } else if (orientation == "left") {
        ctx.lineTo(x + 6, y - 6);
        ctx.lineTo(x + 6, y + 6);
        ctx.lineTo(x, y);
    } else if (orientation == "right") {
        ctx.lineTo(x - 6, y - 6);
        ctx.lineTo(x - 6, y + 6);
        ctx.lineTo(x, y);
    }
    // lineTo draws a line compared to moveTo which doesn't
    ctx.stroke();
    ctx.fill();
    // This function used to draw the arrowhead^^
}

// Draw the line first then the arrowhead because the fill function will fill up the whole line if you start with arrowhead
function drawPath(ctx, path, order) {
    let lastX = 0;
    let lastY = 0;
    let orientation = "up";
    if (order == "reversed") {
        let i = path.length - 1;
        while (i >= 0) {
            ctx.beginPath();
            ctx.moveTo(path[i].x, path[i].y);
            lastX = path[i].x;
            lastY = path[i].y;
            i--;
            while (i >= 0 && !path[i].type) {  
                // path type represents whether its move type or undefined
                ctx.lineTo(path[i].x, path[i].y);
                if (i > 0) {
                    orientation = getOrientation(lastX, path[i].x, lastY, path[i].y);
                }
                lastX = path[i].x;
                lastY = path[i].y;
                i--;
            }
            ctx.lineTo(path[i].x, path[i].y);
            orientation = getOrientation(lastX, path[i].x, lastY, path[i].y);
            lastX = path[i].x;
            lastY = path[i].y;
            i--;
            ctx.stroke();
            drawArrow(ctx, orientation, lastX, lastY);
        }
    } else { // original order
        let i = 0;
        while (i < path.length) {
            ctx.beginPath();
            ctx.moveTo(path[i].x, path[i].y);
            lastX = path[i].x;
            lastY = path[i].y;
            i++;
            while (i < path.length && !path[i].type) {
                ctx.lineTo(path[i].x, path[i].y);
                if (i > 0) {
                    orientation = getOrientation(lastX, path[i].x, lastY, path[i].y);
                }
                lastX = path[i].x;
                lastY = path[i].y;
                i++;
            }
            ctx.stroke();
            drawArrow(ctx, orientation, lastX, lastY);
        }
    }
}

function getOrientation(lastX, currentX, lastY, currentY) {
    let orientation = "Up";
    if (lastX == currentX) {
        if (lastY > currentY) {
            orientation = "up";
        } else {
            orientation = "down";
        }
    } else if (lastY == currentY) {
        if (lastX > currentX) {
            orientation = "left";
        } else {
            orientation = "right";
        }
    }
    return orientation;
}
// getOrientation function to see which way the path changes (either x or y-axis)