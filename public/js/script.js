document.getElementById("locateBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            window.location.href = `/?lat=${lat}&lon=${lon}`;
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
