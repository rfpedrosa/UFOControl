function hitRectangle(x, y, rectangle) {
    if( (rectangle.x <= x) && (x <= (rectangle.x + rectangle.width)) &&
        (rectangle.y <= y) && (y <= (rectangle.y + rectangle.height)) ) {

        //alert(x + "," + y + " is Inside Rectangle:" + rectangle.x + "," + rectangle.y + "," + (rectangle.x + rectangle.width) + "," + (rectangle.y + rectangle.height));
        return true;
    }

    //alert(x + "," + y + " is NOT Inside Rectangle:" + rectangle.x + "," + rectangle.y + "," + (rectangle.x + rectangle.width) + "," + (rectangle.y + rectangle.height));
    return false;
    
}

function hitRadius(pointX, pointY, hit, tX, tY, tHit) {
    if(tX - tHit > pointX + hit) {
        return false;
    }
    if(tX + tHit < pointX - hit) {
        return false;
    }
    if(tY - tHit > pointY + hit) {
        return false;
    }
    if(tY + tHit < pointY - hit) {
        return false;
    }

    //alert((this.hit + tHit) + " > " + (Math.sqrt(Math.pow(Math.abs(this.bitmap.x - tX),2) + Math.pow(Math.abs(this.bitmap.y - tY),2))));
    //now do the circle distance test
    return hit + tHit > Math.sqrt(Math.pow(Math.abs(pointX - tX),2) + Math.pow(Math.abs(pointY - tY),2));
}

function drawArrowsAroundRectangle(graphics, rectangle, ignoreRight) {
    // left arrow
    graphics.moveTo(rectangle.x - 30,rectangle.y + rectangle.height / 2);
    graphics.lineTo(rectangle.x - 10,rectangle.y + rectangle.height / 2);
    graphics.lineTo(rectangle.x - 20,rectangle.y + rectangle.height / 2 + 5);
    graphics.moveTo(rectangle.x - 10,rectangle.y + rectangle.height / 2);
    graphics.lineTo(rectangle.x - 20,rectangle.y + rectangle.height / 2 - 5);
    /*graphics.lineTo(rectangle.x - 20,rectangle.y + 5);
    graphics.moveTo(rectangle.x - 10,rectangle.y + rectangle.height / 2);
    graphics.lineTo(rectangle.x - 20,rectangle.y + rectangle.height - 5);*/
    // right arrow
    if(! ignoreRight) {
        graphics.moveTo(rectangle.x + rectangle.width + 30,rectangle.y + rectangle.height / 2);
        graphics.lineTo(rectangle.x + rectangle.width + 10,rectangle.y + rectangle.height / 2);
        graphics.lineTo(rectangle.x + rectangle.width + 20,rectangle.y + rectangle.height / 2 + 5);
        graphics.moveTo(rectangle.x + rectangle.width + 10,rectangle.y + rectangle.height / 2);
        graphics.lineTo(rectangle.x + rectangle.width + 20,rectangle.y + rectangle.height / 2 - 5);
    }
    // up arrow
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y - 30);
    graphics.lineTo(rectangle.x + rectangle.width / 2,rectangle.y - 10);
    graphics.lineTo(rectangle.x + rectangle.width / 2 + 5,rectangle.y - 20);
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y - 10);
    graphics.lineTo(rectangle.x + rectangle.width / 2 - 5,rectangle.y - 20);
    // down arrow
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y + rectangle.height + 30);
    graphics.lineTo(rectangle.x + rectangle.width / 2,rectangle.y + rectangle.height + 10);
    graphics.lineTo(rectangle.x + rectangle.width / 2 + 5,rectangle.y + rectangle.height + 20);
    graphics.moveTo(rectangle.x + rectangle.width / 2,rectangle.y + rectangle.height + 10);
    graphics.lineTo(rectangle.x + rectangle.width / 2 - 5,rectangle.y + rectangle.height + 20);
    
}
