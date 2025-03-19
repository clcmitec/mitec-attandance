document.addEventListener("DOMContentLoaded", function() {
    // QR Code Scanner
    function onScanSuccess(qrCodeMessage) {
        document.getElementById("employeeId").value = qrCodeMessage;
    }
    let qrScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
    qrScanner.render(onScanSuccess);

    // Attendance Submission
    document.getElementById("submitBtn").addEventListener("click", function(event) {
        event.preventDefault();
        
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(success, error);

        function success(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            // MITEC Coordinates (Adjust if needed)
            var mitecLat = 3.1808;
            var mitecLng = 101.6911;
            var allowedRadius = 0.2; // 200 meters

            var distance = getDistance(lat, lng, mitecLat, mitecLng);

            if (distance <= allowedRadius) {
                submitAttendance();
            } else {
                alert("Attendance can only be submitted from MITEC.");
            }
        }

        function error() {
            alert("Unable to retrieve your location.");
        }
    });

    // Calculate Distance (Haversine Formula)
    function getDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // Earth's radius in km
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    // Submit Attendance to Google Sheets
    function submitAttendance() {
        var name = document.getElementById("name").value;
        var employeeId = document.getElementById("employeeId").value;
        var location = "MITEC";

        fetch("YOUR_GOOGLE_APPS_SCRIPT_URL", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, employeeId, location })
        })
        .then(response => response.text())
        .then(data => alert("Attendance recorded!"))
        .catch(error => console.error("Error:", error));
    }
});