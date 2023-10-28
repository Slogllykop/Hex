const findColors = (background, target) => {
    let parseHex = (color) =>
        color
            .substr(1)
            .match(/.{1,2}/g)
            .map((n) => parseInt(n, 16));
    let colors = [];
    let [r0, g0, b0] = parseHex(background);
    let [rt, gt, bt] = parseHex(target);
    let threshold = 7;

    for (let r = 0; r < 16; r++) {
        for (let g = 0; g < 16; g++) {
            for (let b = 0; b < 16; b++) {
                for (let a = 0; a < 16; a++) {
                    let r1 = (r0 * (255 - a * 17)) / 255 + (r * a * 289) / 255;
                    let g1 = (g0 * (255 - a * 17)) / 255 + (g * a * 289) / 255;
                    let b1 = (b0 * (255 - a * 17)) / 255 + (b * a * 289) / 255;
                    let err = Math.hypot(r1 - rt, g1 - gt, b1 - bt);
                    if (err < threshold)
                        colors.push([
                            `#${r.toString(16)}${g.toString(16)}${b.toString(
                                16
                            )}${a.toString(16)}`,
                            err,
                        ]);
                }
            }
        }
    }

    colors.sort((a, b) => a[1] - b[1]);
    return colors;
};

const back = document.querySelector("#bg");
const targ = document.querySelector("#target");
const main = document.querySelector(".main");

const renderCode = () => {
    document.querySelector(".item-container").innerHTML = "";
    main.style.backgroundColor = back.value;
    let result = findColors(back.value, targ.value);
    for (let i = 0; i < result.length; i++) {
        let template = `
            <div class="code">${result[i][0]}</div>
            <div class="error">${result[i][1]}</div>
        `;

        document
            .querySelector(".item-container")
            .insertAdjacentHTML("beforeend", template);

        if (result[i][1] < 4) {
            document.querySelector(".error:last-child").style.backgroundColor =
                "rgb(0 255 0 / .25)";
        }

        let code = document.querySelectorAll(".code");
        code.forEach((e) => {
            e.addEventListener("click", () => {
                document.querySelector(".right").style.backgroundColor =
                    e.textContent;

                navigator.clipboard.writeText(e.textContent);
            });
        });
    }
};

window.onload = (e) => {
    back.value = "#ffffff";
    targ.value = "#B8B7CC";
    renderCode();
};

back.addEventListener("keyup", renderCode);
targ.addEventListener("keyup", renderCode);
