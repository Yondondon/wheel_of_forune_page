document.addEventListener('DOMContentLoaded', () => {
    const sectors = [
        { color: "#f82", label: "Stack", value: 0 },
        { color: "#0bf", label: "10", value: 10 },
        { color: "#fb0", label: "200", value: 200 },
        { color: "#0fb", label: "50", value: 50 },
        { color: "#b0f", label: "100", value: 100 },
        { color: "#f0b", label: "5", value: 5 },
    ];

    const rand = (m, M) => Math.random() * (M - m) + m;
    const tot = sectors.length;
    const spin_btn = document.querySelector("#spin_btn");
    const popup_spin_btn = document.querySelector("#popup_spin_btn");
    const ctx = document.querySelector("#wheel").getContext('2d');
    const dia = ctx.canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const arc = TAU / sectors.length;

    const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
    let angVel = 0; // Angular velocity
    let ang = 0; // Angle in radians
    let result_text = "";

    const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

    const drawSector = (sector, i) => {
        const ang = arc * i;
        ctx.save();
        // COLOR
        ctx.beginPath();
        ctx.fillStyle = sector.color;
        ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, ang, ang + arc);
        ctx.lineTo(rad, rad);
        ctx.fill();
        // TEXT
        ctx.translate(rad, rad);
        ctx.rotate(ang + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 30px sans-serif";
        ctx.fillText(sector.label, rad - 10, 10);
        //
        ctx.restore();
    };

    const rotate = () => {
        // const sector = sectors[getIndex()];
        ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
        // spin_btn.textContent = !angVel ? "SPIN" : sector.label;
        // spin_btn.style.background = sector.color;
    }

    const frame = () => {
        if (!angVel) return;
        angVel *= friction; // Decrement velocity by friction
        const sector = sectors[getIndex()];
        if (angVel < 0.002) {
            angVel = 0; // Bring to stop
            setTimeout(() => {
                if(sector.value == 0) {
                    result_text = `Sorry! <br> You didn't win anything.`;
                    showResultPopup(result_text);
                } else {
                    result_text = `Congratulations! <br> Your win is ${sector.value}`;
                    showResultPopup(result_text);
                }
            }, 500);
        }
        ang += angVel; // Update angle
        ang %= TAU; // Normalize angle
        rotate();
    }

    const engine = () => {
        frame();
        requestAnimationFrame(engine)
    }

    const showResultPopup = (resultText) => {
        document.querySelector(".modal_overlay").style.display = "block";
        document.querySelector(".result_popup").style.display = "block";
        document.querySelector(".result_popup__text_block").innerHTML = resultText;
    }

    const hideResultPopup = () => {
        document.querySelector(".modal_overlay").style.display = "none";
        document.querySelector(".result_popup").style.display = "none";
    }

    // INIT
    sectors.forEach(drawSector);
    rotate(); // Initial rotation
    engine(); // Start engine
    spin_btn.addEventListener("click", () => {
        if (!angVel) angVel = rand(0.25, 0.35);
    });
    
    popup_spin_btn.addEventListener("click", () => {
        if (!angVel) angVel = rand(0.25, 0.35);
        hideResultPopup();
    });

    document.getElementById("result_popup_close_btn").addEventListener("click", () => {
        hideResultPopup();
    })
})