function FPSMeter () {

    const elemFR = document.getElementById( "stats-fr" );
    const elemDT = document.getElementById( "stats-dt" );

    var count = 0, time = null;

    this.update = function () {

        if ( time == null ) {

            time = new Date().getTime();

            setInterval( function () {

                var delta = new Date().getTime() - time;

                var FR = count/(delta/1000);
                var DT = delta/count;

                elemFR.textContent = "FR:" + FR.toFixed(2);
                elemDT.textContent = "DT:" + DT.toFixed(2);

                time += delta;

                count = 0;

            }, 200 );

        } else {

            count += 1;

        }

    }

}
