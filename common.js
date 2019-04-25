let inputsDiv = document.getElementById("inputsDiv");
let resultsDiv = document.getElementById("resultsDiv");
let length = document.getElementById("lengthInput");
let generateBtn = document.getElementById("generateBtn");
let inputsNum = document.getElementById("inputsNum");

generateInputs(1);

function generateInputs(inputs) {
    inputsDiv.innerHTML = null;

    for (let i = 0; i < inputs; i++) {
        let input = document.createElement("input");
        input.className = "input";
        input.value = 1;
        setInputFilter(input, function (value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) <= length.value);
        });
        inputsDiv.append(input);
    }
}

function generateResults(results) {
    resultsDiv.innerHTML = null;

    results[0].forEach((e, i) => {
        let cell = document.createElement('div');
        if (e) {
            cell.className = "filled";
            cell.innerText = results[1][i];
        } else {
            cell.className = "blank";
        }
        resultsDiv.append(cell);
    });
};

function changeOrient(orientation) {
    resultsDiv.style.flexDirection = orientation;
}

generateBtn.addEventListener("click", () => {
    let leftArray = createArray(2, parseInt(length.value));
    let rightArray = createArray(2, parseInt(length.value));
    let simArray = createArray(2, parseInt(length.value));
    let q = document.querySelectorAll('.input');
    let allInputs = [];
    let k = 0;
    let j = 0;
    let p;
    let o = rightArray[0].length - 1;
    q.forEach(e => {
        allInputs[k] = parseInt(e.value);
        k++;
    });
    let last = allInputs.length - 1;
    allInputs.forEach(e => {
        for (k = 0; k < e; k++) {
            leftArray[0][j] = true;
            leftArray[1][j] = e;
            j++;
        }
        if (allInputs.indexOf(e) != last) {
            leftArray[0][j] = false;
            leftArray[1][j] = 0;
            j++;
        } else {
            p = j - 1;
            for (k = p; k >= 0; k--) {
                rightArray[0][o] = leftArray[0][k];
                rightArray[1][o] = leftArray[1][k];
                o--;
            }
            leftArray[0].fill(false, j);
            leftArray[1].fill(0, j);
            rightArray[0].fill(false, 0, o + 1);
            rightArray[1].fill(0, 0, o + 1);
        }
    });

    for (k = 0; k < leftArray[0].length; k++) {
        if (leftArray[0][k] && rightArray[0][k] && leftArray[1][k] == rightArray[1][k]) {
            simArray[0][k] = true;
            simArray[1][k] = leftArray[1][k];
        } else {
            simArray[0][k] = false;
            simArray[1][k] = 0;
        }
    }

    generateResults(simArray);

    // console.log('results');
    // console.log(leftArray);
    // console.log(rightArray);
    // console.log(simArray);
});

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    });
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }
    return arr;
}