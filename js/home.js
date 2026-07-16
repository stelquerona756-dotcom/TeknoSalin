// ===============================
// HOME SEARCH
// ===============================

const searchInput = document.getElementById("homeSearch");
const searchButton = document.getElementById("homeSearchBtn");

function searchTerm() {

    const keyword = searchInput.value.trim();

    if (keyword === "") {

        alert("Maglagay muna ng terminong hahanapin.");

        return;

    }

    // Ipapasa ang search keyword papuntang dictionary.html
    window.location.href =
        `dictionary.html?search=${encodeURIComponent(keyword)}`;

}

searchButton.addEventListener("click", searchTerm);

searchInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        searchTerm();

    }

});