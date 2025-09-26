(function(){
  const totalYears = 432000;
  const startYear = -3101;
  const secsPerYear = 365*24*60*60;

  const elYears = document.getElementById('years');
  const elDays  = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMins  = document.getElementById('minutes');
  const elSecs  = document.getElementById('seconds');
  const elProg  = document.querySelector('.progress');

  let lastSecond = null;

  function getRemainingSeconds(){
    const now = new Date();
    const totalSeconds = totalYears*secsPerYear;
    const elapsedYears = now.getFullYear() - startYear;
    const elapsedSeconds = elapsedYears*secsPerYear
      + now.getMonth()*30*24*60*60
      + (now.getDate()-1)*24*60*60
      + now.getHours()*3600
      + now.getMinutes()*60
      + now.getSeconds()
      + now.getMilliseconds()/1000;
    return Math.max(0, totalSeconds - elapsedSeconds);
  }

  function tick(){
    const rem = getRemainingSeconds();
    const years = rem / secsPerYear;
    const days  = (years - Math.floor(years))*365;
    const hours = (days - Math.floor(days))*24;
    const mins  = (hours - Math.floor(hours))*60;
    const secs  = (mins - Math.floor(mins))*60;

    elYears.textContent = Math.floor(years);
    elDays.textContent  = Math.floor(days);
    elHours.textContent = Math.floor(hours);
    elMins.textContent  = Math.floor(mins);
    elSecs.textContent  = Math.floor(secs);

    // progress bar
    const perc = ((totalYears*secsPerYear - rem)/(totalYears*secsPerYear))*100;
    elProg.style.width = perc+'%';

//    if(lastSecond !== Math.floor(secs)){
//      lastSecond = Math.floor(secs);
//      elSecs.classList.remove('tick');
//      void elSecs.offsetWidth;
 //     elSecs.classList.add('tick');
 //   }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  /* ========== STARFIELD + NEBULA + PULSE ========== */
  const starC = document.getElementById('starfield');
  const sctx = starC.getContext('2d');
  let stars = [];
  function resizeStar(){ starC.width=innerWidth; starC.height=innerHeight; initStars(); }
  function initStars(){
    const count=Math.floor((innerWidth*innerHeight)/2200); stars=[];
    for(let i=0;i<count;i++) stars.push({x:Math.random()*starC.width,y:Math.random()*starC.height,z:Math.random()*starC.width,size:Math.random()*1.2+0.2,hue:190+Math.random()*60});
  }
  window.addEventListener('resize',resizeStar);
  resizeStar();

  function drawStars(){
    sctx.clearRect(0,0,starC.width,starC.height);
    sctx.fillStyle="rgba(0,0,0,0.6)"; sctx.fillRect(0,0,starC.width,starC.height);
    for(const st of stars){
      st.z-=1.8; if(st.z<=0) st.z=starC.width;
      const k=128/st.z;
      const x=(st.x-starC.width/2)*k+starC.width/2;
      const y=(st.y-starC.height/2)*k+starC.height/2;
      const size=st.size*(1-st.z/starC.width)*2.4;
      const alpha=Math.max(0,Math.min(1,(1-st.z/starC.width)+0.1));
      sctx.fillStyle=`hsla(${st.hue},80%,70%,${alpha})`; sctx.fillRect(x,y,size,size);
    }
  }

  const neb=document.getElementById('nebula'); const nctx=neb.getContext('2d'); let nebW=0,nebH=0;
  function resizeNeb(){ neb.width=innerWidth; neb.height=innerHeight; nebW=neb.width; nebH=neb.height; }
  window.addEventListener('resize',resizeNeb); resizeNeb();

  const clouds=[{x:0.3,y:0.3,r:0.7,hue:210,alpha:0.06,speed:0.0006},{x:0.7,y:0.6,r:0.5,hue:30,alpha:0.04,speed:-0.0004},{x:0.5,y:0.45,r:0.9,hue:14,alpha:0.045,speed:0.0003}];
  let tstart=performance.now(); let pulses=[];

  function drawNebula(time){
    const t=(time-tstart)*0.001;
    nctx.clearRect(0,0,nebW,nebH);
    const g=nctx.createLinearGradient(0,0,nebW,nebH); g.addColorStop(0,'rgba(2,2,8,0.85)'); g.addColorStop(1,'rgba(8,4,16,0.88)'); nctx.fillStyle=g; nctx.fillRect(0,0,nebW,nebH);

    for(let i=0;i<clouds.length;i++){
      const c=clouds[i];
      const cx=nebW*(c.x+Math.sin(t*c.speed*600+i)*0.02);
      const cy=nebH*(c.y+Math.cos(t*c.speed*600+i*1.2)*0.02);
      const grd=nctx.createRadialGradient(cx,cy,0,cx,cy,nebW*c.r);
      grd.addColorStop(0,`hsla(${c.hue},85%,60%,${c.alpha})`);
      grd.addColorStop(0.4,`hsla(${c.hue},80%,45%,${c.alpha*0.7})`);
      grd.addColorStop(1,`hsla(${c.hue},70%,20%,0)`);
      nctx.globalCompositeOperation='lighter'; nctx.fillStyle=grd; nctx.beginPath(); nctx.arc(cx,cy,nebW*c.r,0,Math.PI*2); nctx.fill(); nctx.globalCompositeOperation='source-over';
    }

    nctx.save(); nctx.globalAlpha=0.04; nctx.translate(nebW/2,nebH/2); nctx.rotate(Math.sin(t*0.02)*0.006);
    for(let i=0;i<8;i++){ nctx.strokeStyle='rgba(246,200,95,0.08)'; nctx.lineWidth=1; nctx.beginPath(); const r=Math.min(nebW,nebH)*(0.18+i*0.08); nctx.arc(0,0,r,Math.PI*0.1*i,Math.PI*1.9+Math.sin(t*0.02+i)*0.08); nctx.stroke();}
    nctx.restore();
  }

  function createPulse(){ pulses.push({x:nebW/2+(Math.random()-0.5)*nebW*0.08, y:nebH/2+(Math.random()-0.5)*nebH*0.08, r:10, life:0.7}); }
  function drawPulses(dt){ for(let i=pulses.length-1;i>=0;i--){ const p=pulses[i]; p.life-=dt; if(p.life<=0){pulses.splice(i,1); continue;} const alpha=Math.max(0,p.life/0.7); const R=(1-alpha)*Math.max(nebW,nebH)*0.02+p.r; const g=nctx.createRadialGradient(p.x,p.y,0,p.x,p.y,R); g.addColorStop(0,`rgba(255,80,80,${0.12*alpha})`); g.addColorStop(0.35,`rgba(255,140,60,${0.06*alpha})`); g.addColorStop(1,`rgba(255,200,95,0)`); nctx.globalCompositeOperation='lighter'; nctx.fillStyle=g; nctx.beginPath(); nctx.arc(p.x,p.y,R,0,Math.PI*2); nctx.fill(); nctx.globalCompositeOperation='source-over'; } }

  let lastTime=performance.now();
  function anim(time){
    const dt=(time-lastTime)/1000; lastTime=time;
    drawStars(); drawNebula(time); drawPulses(dt);
    requestAnimationFrame(anim);
  }
  setInterval(createPulse,1600);
  requestAnimationFrame(anim);

const titleEl = document.getElementById('title');
const subtitleEl = document.getElementById('subtitle');
const noteEl = document.getElementById('note');

// Label elements
const labels = {
  years: document.getElementById('label-years'),
  days: document.getElementById('label-days'),
  hours: document.getElementById('label-hours'),
  minutes: document.getElementById('label-minutes'),
  seconds: document.getElementById('label-seconds')
};

// Array of languages
const languages = [
  {
    title: "Kali Yuga",
    subtitle: "The Final Breath of Kali Yuga",
    note: "According to traditional calculation: Kaliyug — 432,000 years (start ≈ 3102 BCE)",
    labels: {years:"Years", days:"Days", hours:"Hours", minutes:"Minutes", seconds:"Seconds"}
  },
  {
    title: "कालयुग",
    subtitle: "कालयुग का अंतिम श्वास",
    note: "पारंपरिक गणना के अनुसार: कालयुग — ४३२,००० वर्ष (आरंभ ≈ ३१०२ ईसा पूर्व)",
    labels: {years:"वर्ष", days:"दिन", hours:"घंटे", minutes:"मिनट", seconds:"सेकंड"}
  },
  {
    title: "கலியுக",
    subtitle: "கலியுகத்தின் இறுதி மூச்சு",
    note: "பாரம்பரியக் கணக்கீட்டின்படி: கலியுகம் — 4,32,000 ஆண்டுகள் (ஆரம்பம் ≈ கி.மு. 3102)",
    labels: {years:"ஆண்டுகள்", days:"நாட்கள்", hours:"மணி", minutes:"நிமிடங்கள்", seconds:"வினாடிகள்"}
  }
];

let langIndex = 0;
const intervalTime = 11000;

function updateLanguage(){
  langIndex = (langIndex + 1) % languages.length;
  const lang = languages[langIndex];

  titleEl.textContent = lang.title;
  subtitleEl.textContent = lang.subtitle;
  noteEl.textContent = lang.note;

  // update labels
  labels.years.textContent = lang.labels.years;
  labels.days.textContent = lang.labels.days;
  labels.hours.textContent = lang.labels.hours;
  labels.minutes.textContent = lang.labels.minutes;
  labels.seconds.textContent = lang.labels.seconds;
}

// Start the interval
setInterval(updateLanguage, intervalTime);

})();
