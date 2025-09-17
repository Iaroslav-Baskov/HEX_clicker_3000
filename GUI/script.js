const n = 20;
const needed = 64;
const root = document.querySelector(':root');

const cols = [
  document.getElementById("col0"),
  document.getElementById("col1"),
  document.getElementById("col2")
];
let keys={
"1":0,
"2":0,
"3":0
}
let scroll = [0, 1, 2];
let points = 0;
let spinning = [false, false, false];
let pressed = false;
let win = false;
let isegg=false
let firstJump=0.5;
 var base=0;
let possibilities=[
0.1,
firstJump
]
for(var i=2;i<n;i++){
possibilities.push(possibilities[i-1]+(1-firstJump)/(n-2));
}
let winPoints = 0;
    var canvas=[document.getElementById("col0im"),document.getElementById("col1im"),document.getElementById("col2im")];
    var ctx=[];
     for( var i=0;i<canvas.length;i++){
        ctx.push(canvas[i].getContext('2d'));
        canvas[i].width=canvas[i].clientWidth;
        canvas[i].height=canvas[i].clientHeight;
    }

    const sources = [];
    const images = [];
    for (let i = 1; i <= n; i++) { sources.push(`toys/${i}.png`);}
    Promise.all(
    sources.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
      images.push(img);
    });
    })
    ).then(loaded => { 
    fillColumns();
});
function fillColumns(egg="") {
  for (var c=0;c<cols.length;c++) {
    if(egg==""){
    ctx[c].drawImage(images[n-1], 0, 0,canvas[c].width,canvas[c].width);}else{
    ctx[c].drawImage(egg, 0, 0,canvas[c].width,canvas[c].width);
    }
    for (let i = 0; i < n; i++) {
    if(egg==""){
    ctx[c].drawImage(images[i], 0, (i+1) * canvas[c].width ,canvas[c].width,canvas[c].width);}else{
    ctx[c].drawImage(egg, 0, (i+1) * canvas[c].width ,canvas[c].width,canvas[c].width);
    }
    }
    if(egg==""){
    ctx[c].drawImage(images[0], 0, (n+1) * canvas[c].width ,canvas[c].width,canvas[c].width);
    ctx[c].drawImage(images[1], 0, (n+2) * canvas[c].width ,canvas[c].width,canvas[c].width);}else{
        ctx[c].drawImage(egg, 0, (n+1) * canvas[c].width ,canvas[c].width,canvas[c].width);
        ctx[c].drawImage(egg, 0, (n+1) * canvas[c].width ,canvas[c].width,canvas[c].width);
    }
  }
    }
function isAnySpinning() {
  return spinning.some(s => s);
}

function rot(index, count,test) {
  const delay = 300*Math.min(n-scroll[index],count)*test*2**(-Math.floor(count/n));
  if(scroll[index]==n){
    scroll[index]=0;
    root.style.setProperty(`--speed${index}`, delay);
    root.style.setProperty(`--scroll${index}`, scroll[index]);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rot(index, count,test);
      });
    });
  } else if (count>0) {
    let cnt=count;
    count-=Math.min(n-scroll[index],cnt);
    scroll[index]+=Math.min(n-scroll[index],cnt);
    root.style.setProperty(`--speed${index}`, delay);
    root.style.setProperty(`--scroll${index}`, scroll[index]);
    setTimeout(()=>{rot(index, count,test);},delay);
  } else {
      document.getElementById("stopSound").currentTime = 0;
      document.getElementById("stopSound").play();
      spinning[index] = false;
      if(!isAnySpinning()){
        if (winCount()==cols.length) {
          winPoints = 2;
          win=true;
          document.getElementById("jackpotSound").currentTime = 0;
          document.getElementById("jackpotSound").play();
          document.getElementById("jpot1").classList.add("active");
          document.getElementById("jpot2").classList.add("active");
        }else if(winCount()==cols.length-1){
          addPoints(2*needed)
        }
      }return;
  }
}

document.addEventListener("keydown", (event) => {
  if (pressed) return;

  const key = event.key;
  if(keys[key]!=undefined){
    var add=1;
    if(Date.now()-keys[key]>50000){
      add=16
    }else if(Date.now()-keys[key]>10000){
      add=8
    }else if(Date.now()-keys[key]>5000){
      add=4
    }else if(Date.now()-keys[key]>1000 || Math.random()<0.1){
      add=2
    }
    keys[key]=Date.now();
    addPoints(add);
  }

  if (key === "s" && !isAnySpinning()) {
    if (winPoints > 0) {
      winPoints--;
    } else {
      if (win) {
        win = false;
        document.getElementById("jackpotSound").pause();
          document.getElementById("jpot1").classList.remove("active");
          document.getElementById("jpot2").classList.remove("active");
      }else{
      if (points >= needed) {
        points -= needed;
         if(points+needed==69){
         isegg=true;
         document.getElementById("easterEggSound").play();
         for(var i=0;i<cols.length;i++){
    root.style.setProperty(`--speed${i}`, 0);
    root.style.setProperty(`--scroll${i}`, n+3);
        document.getElementById("hex").innerText = `${points}`;
         }}else{
         if(isegg){
         isegg=false;
         
         document.getElementById("easterEggSound").pause();
         document.getElementById("easterEggSound").currentTime=0;
         for(var i=0;i<cols.length;i++){
    root.style.setProperty(`--speed${i}`, 0);
    root.style.setProperty(`--scroll${i}`, scroll[i]);
         }
         }
        document.getElementById("hex").innerText = `${points}`;
        const snd = document.getElementById("spinSound");
        base= Math.floor(n * (Math.random() + 2));
        
        for (let i = 0; i < 3; i++) {
          spinning[i] = true;
          var dir=1;
          if(Math.random()>0.5){
          dir=-1;
          }
          var delta = calcPoints(Math.random())*(dir);
          base+=delta;
          const b=0+base;
          setTimeout(()=>{rot(i, b-scroll[i],1);},500*i+100);
          snd.currentTime = 0;
          snd.play();
        }}
      } else {
    document.getElementById("noPoints").play();
    setTimeout(function(){
document.getElementById("noPoints").pause();
document.getElementById("noPoints").currentTime=0;
},3000)
    document.getElementById("no").innerText=`min ${needed}!`;
    document.getElementById("no").classList.remove("hidden");
    setTimeout(() => document.getElementById("no").classList.add("hidden"),50);
      }}
    }
  }

  if (key === "j" && !isAnySpinning()) {
    document.getElementById("hex").innerText = `${points}`;
    var base= Math.floor(n * (Math.random() + 0.5));
    for (let i = 0; i < 3; i++) {
      spinning[i] = true;
      rot(i, base+n - scroll[i] + 10,1);
    }
  }

  pressed = true;
});
document.addEventListener("keyup", () => {
  pressed = false;
});
function calcPoints(rand){
    for(i=0;i<n;i++){
        if(possibilities[i]>rand){
            return i;
        }
    }
    return 1;
}
function addPoints(add){
    points+=add;
    document.getElementById("buttonSound").play();
    document.getElementById("hex").innerText = `${points}`;
    document.getElementById("+").innerText=`+${add}`
    document.getElementById("+").classList.remove("hidden");
    setTimeout(() => document.getElementById("+").classList.add("hidden"),50);
}
function winCount(){
  var scrolls={};
  var max=0;
  for(var i=0;i<cols.length;i++){
    if(scrolls[scroll[i]]==undefined){
      scrolls[scroll[i]]=0;
    }
    scrolls[scroll[i]]+=1;
    if(scrolls[scroll[i]]>max){
      max=scrolls[scroll[i]];
    }
  }
  return max;
}
