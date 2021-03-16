document.getElementById("bfCalc[gender]").addEventListener("change", () => {
    if (document.getElementById("bfCalc[gender]").value == "female") {
        document.getElementById("female").hidden = false
    } else {
        document.getElementById("female").hidden = true
    }
});
// document.getElementById("bfCalc[gender]").trigger("change");