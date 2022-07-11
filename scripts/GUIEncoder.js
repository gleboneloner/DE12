function GUIEncoder ( identifier, min, max, value ) {

    var svg = document.getElementById( identifier );

    svg.setAttribute( "width", "60" );
    svg.setAttribute( "height", "60" );

    ////////////////////////

    var disk = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
    disk.setAttribute( "fill", "none" );
    disk.setAttribute( "stroke", "#2D3749" );
    disk.setAttribute( "stroke-width", "1.6" );
    disk.setAttribute( "cx", "30" );
    disk.setAttribute( "cy", "30" );
    disk.setAttribute( "r", "16" );

    svg.appendChild( disk );

    ////////////////////////

    var track = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
    track.setAttribute( "fill", "none" );
    track.setAttribute( "stroke", "#179C97" );
    track.setAttribute( "stroke-width", "1.6" );
    track.setAttribute( "cx", "30" );
    track.setAttribute( "cy", "30" );
    track.setAttribute( "r", "16" );
    track.setAttribute( "stroke-dasharray", "0 1 4 1" );
    track.setAttribute( "pathLength", "6" );

    svg.appendChild( track );

    ////////////////////////

    var handle = document.createElementNS( "http://www.w3.org/2000/svg", "g" );

    ////////////////////////

    var handleOne = document.createElementNS( "http://www.w3.org/2000/svg", "line" );

    handleOne.setAttribute( "x1", "45" );
    handleOne.setAttribute( "y1", "30" );
    handleOne.setAttribute( "x2", "47" );
    handleOne.setAttribute( "y2", "30" );

    handleOne.setAttribute( "stroke", "black" );
    handleOne.setAttribute( "stroke-width", "4" );
    handleOne.setAttribute( "stroke-linecap", "butt" );

    handle.appendChild( handleOne );

    ////////////////////////

    var handleTwo = document.createElementNS( "http://www.w3.org/2000/svg", "line" );

    handleTwo.setAttribute( "x1", "43.5" );
    handleTwo.setAttribute( "y1", "30" );
    handleTwo.setAttribute( "x2", "48.5" );
    handleTwo.setAttribute( "y2", "30" );

    handleTwo.setAttribute( "stroke", "white" );
    handleTwo.setAttribute( "stroke-width", "2" );
    handleTwo.setAttribute( "stroke-linecap", "round" );

    handle.appendChild( handleTwo );

    svg.appendChild( handle );

    ////////////////////////

    var pressed = false, minAngle = 60, maxAngle = 300;

    var currentAngle = minAngle+(maxAngle-minAngle)*(value-min)/(max-min);

    handle.setAttribute( "transform", "rotate( " + currentAngle + " 30 30 )" );

    ////////////////////////

    function update ( clientX, clientY ) {

        var boundingRect = svg.getBoundingClientRect();

        var centerX = boundingRect.x + 30, centerY = boundingRect.y + 30;

        currentAngle = Math.atan2( centerY - clientY, centerX - clientX ) * 180/Math.PI + 180;

        currentAngle = Math.min( Math.max( currentAngle, minAngle ), maxAngle );

        handle.setAttribute( "transform", "rotate( " + currentAngle + " 30 30 )" );

    }

    ////////////////////////

    svg.addEventListener( "mousedown", event => { pressed = true; update( event.clientX, event.clientY ); } );

    window.addEventListener( "mouseup", event => { pressed = false; } );

    window.addEventListener( "mousemove", event => { if ( pressed ) update( event.clientX, event.clientY ); } );

    ////////////////////////

    this.getValue = function () {

        return min+(max-min)*(currentAngle-minAngle)/(maxAngle-minAngle);

    }

}
