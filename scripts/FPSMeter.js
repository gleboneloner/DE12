function FPSMeter () {

    var count = 0, time = null;

    this.update = function () {

        if ( time == null ) {

            time = new Date().getTime();

            setInterval( function () {

                var delta = new Date().getTime()-time; time += delta;

                var FR = count/(delta/1000);
                var DT = delta/count;

                document.getElementById("stats-fr").textContent = "FR:" + FR.toFixed(2);
                document.getElementById("stats-dt").textContent = "DT:" + DT.toFixed(2);

                count = 0;

            }, 200 );

        } else {

            count += 1;

        }

    }

}
