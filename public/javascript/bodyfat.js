//Show/hide fields based on selected input
document.getElementById("bfCalc[gender]").addEventListener("change", () => {
    if (document.getElementById("bfCalc[gender]").value == "female") {
        document.getElementById("female").hidden = false
    } else {
        document.getElementById("female").hidden = true
    }
});
