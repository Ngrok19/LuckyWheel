const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const input = document.getElementById("participantInput");
const list = document.getElementById("participantList");

const popup = document.getElementById("winnerPopup");
const winnerName = document.getElementById("winnerName");
const closePopup = document.getElementById("closePopup");

const playerCount = document.getElementById("playerCount");

let participants = [];
let currentAngle = 0;
let spinning = false;

const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#2ECC71",
    "#F39C12",
    "#E74C3C",
    "#1ABC9C"
];

function updateCounter() {
    playerCount.textContent = participants.length;
}

function drawWheel() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(participants.length===0){

        ctx.beginPath();
        ctx.arc(250,250,240,0,Math.PI*2);
        ctx.fillStyle="#222";
        ctx.fill();

        ctx.fillStyle="white";
        ctx.font="28px Poppins";
        ctx.textAlign="center";
        ctx.fillText("No Participants",250,255);

        return;
    }

    const arc = (Math.PI*2)/participants.length;

    participants.forEach((name,index)=>{

        const angle=index*arc;

        ctx.beginPath();
        ctx.moveTo(250,250);
        ctx.arc(250,250,240,angle,angle+arc);
        ctx.closePath();

        ctx.fillStyle=colors[index%colors.length];
        ctx.fill();

        ctx.save();

        ctx.translate(250,250);
        ctx.rotate(angle+arc/2);

        ctx.fillStyle="white";
        ctx.font="bold 18px Poppins";
        ctx.textAlign="right";

        ctx.fillText(name,210,8);

        ctx.restore();

    });

    ctx.beginPath();
    ctx.arc(250,250,35,0,Math.PI*2);
    ctx.fillStyle="#FFD700";
    ctx.fill();
}

drawWheel();

function renderParticipants(){

    list.innerHTML="";

    participants.forEach((name,index)=>{

        const li=document.createElement("li");

        li.innerHTML=`
            ${name}
            <button class="delete-btn">✖</button>
        `;

        li.querySelector("button").onclick=()=>{

            participants.splice(index,1);
            renderParticipants();
            drawWheel();

        };

        list.appendChild(li);

    });

    updateCounter();
}

addBtn.onclick=()=>{

    const name=input.value.trim();

    if(name==="") return;

    participants.push(name);

    input.value="";

    renderParticipants();
    drawWheel();

};

input.addEventListener("keypress",(e)=>{

    if(e.key==="Enter") addBtn.click();

});

resetBtn.onclick=()=>{

    if(!confirm("Reset all participants?")) return;

    participants=[];

    renderParticipants();
    drawWheel();

};

spinBtn.onclick=()=>{

    if(spinning) return;

    if(participants.length<2){

        alert("Add at least 2 participants.");

        return;
    }

    spinning=true;
    spinBtn.disabled=true;

    const winner=Math.floor(Math.random()*participants.length);

    const arc=360/participants.length;

    const target=360*6+(360-(winner*arc+arc/2));

    currentAngle+=target;

    canvas.style.transition="transform 6s cubic-bezier(.17,.67,.19,.99)";
    canvas.style.transform=`rotate(${currentAngle}deg)`;

    setTimeout(()=>{

        winnerName.textContent=participants[winner];

        popup.classList.add("active");

        spinning=false;
        spinBtn.disabled=false;

    },6000);

};

closePopup.onclick=()=>{

    popup.classList.remove("active");

};

window.onclick=(e)=>{

    if(e.target===popup){

        popup.classList.remove("active");

    }

};