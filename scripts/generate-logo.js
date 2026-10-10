import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <!-- Outer Ring Gradient -->
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#024397"/>
      <stop offset="30%" stop-color="#0066cc"/>
      <stop offset="70%" stop-color="#00a3e0"/>
      <stop offset="100%" stop-color="#012b6b"/>
    </linearGradient>

    <!-- Ring Inner Highlight -->
    <linearGradient id="ringHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#001a4d"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0052cc"/>
    </linearGradient>

    <!-- Catfish Dark Blue Body Gradient -->
    <linearGradient id="fishBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#061b40"/>
      <stop offset="40%" stop-color="#0c3575"/>
      <stop offset="80%" stop-color="#031b44"/>
      <stop offset="100%" stop-color="#020f26"/>
    </linearGradient>

    <!-- Catfish Electric Cyan Highlight -->
    <linearGradient id="fishHighlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>

    <!-- Waves Gradient 1 (Top Wave) -->
    <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0077b6"/>
      <stop offset="100%" stop-color="#03045e"/>
    </linearGradient>

    <!-- Waves Gradient 2 (Bottom Wave) -->
    <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0096c7"/>
      <stop offset="50%" stop-color="#0077b6"/>
      <stop offset="100%" stop-color="#023e8a"/>
    </linearGradient>

    <!-- Leaf Green Gradient -->
    <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#166534"/>
      <stop offset="40%" stop-color="#22c55e"/>
      <stop offset="85%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#86efac"/>
    </linearGradient>

    <!-- Filter for crisp drop shadows and glows -->
    <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#021f54" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- ========================================== -->
  <!-- 1. OUTER CIRCULAR BEVELED RING FRAME       -->
  <!-- ========================================== -->
  <!-- Outer Ring Shadow Layer -->
  <circle cx="512" cy="512" r="448" fill="none" stroke="#011b47" stroke-width="42" opacity="0.4"/>
  <!-- Main Ring Gradient -->
  <circle cx="512" cy="512" r="446" fill="none" stroke="url(#ringGrad)" stroke-width="36"/>
  <!-- Ring Inner Highlight Ridge -->
  <circle cx="512" cy="512" r="462" fill="none" stroke="url(#ringHighlight)" stroke-width="6" opacity="0.75"/>
  <circle cx="512" cy="512" r="430" fill="none" stroke="#02163b" stroke-width="5" opacity="0.6"/>

  <!-- ========================================== -->
  <!-- 2. CATFISH DORSAL FIN (UPPER SPINE)        -->
  <!-- ========================================== -->
  <g id="dorsalFin">
    <!-- Dorsal fin base -->
    <path d="M 320 250 C 340 180, 390 145, 470 148 C 450 185, 430 220, 370 255 Z"
          fill="#082352" stroke="#0284c7" stroke-width="4" stroke-linejoin="round"/>
    <!-- Fin rays -->
    <path d="M 350 240 Q 380 180 435 158" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 375 245 Q 405 195 448 170" stroke="#7dd3fc" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M 335 242 Q 365 200 415 175" stroke="#0ea5e9" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </g>

  <!-- ========================================== -->
  <!-- 3. CATFISH BODY (MAIN DARK BLUE FORM)      -->
  <!-- ========================================== -->
  <!-- Leaping arched catfish body -->
  <path d="M 230 630
           C 180 540, 160 430, 205 320
           C 255 200, 390 140, 560 185
           C 680 220, 775 295, 820 375
           C 825 385, 805 400, 770 410
           C 710 425, 640 420, 570 380
           C 470 320, 380 340, 320 410
           C 250 490, 260 580, 270 645
           Z"
        fill="url(#fishBodyGrad)"
        stroke="#041a40"
        stroke-width="4"
        stroke-linejoin="round"/>

  <!-- Upper Metallic Cyan Ridge Highlight along back -->
  <path d="M 215 325
           C 260 215, 385 155, 545 195
           C 660 230, 750 300, 795 370
           C 760 330, 680 270, 560 240
           C 410 205, 290 260, 235 345
           Z"
        fill="url(#fishHighlightGrad)"
        opacity="0.95"/>

  <!-- Secondary dorsal highlight ribbon -->
  <path d="M 245 310 Q 380 180 570 215" fill="none" stroke="#e0f2fe" stroke-width="4.5" opacity="0.85" stroke-linecap="round"/>

  <!-- ========================================== -->
  <!-- 4. PURE WHITE CONTOURED BELLY & GILL       -->
  <!-- ========================================== -->
  <!-- The iconic white belly dividing the fish body -->
  <path d="M 525 365
           C 590 350, 680 335, 785 365
           C 745 405, 685 425, 610 410
           C 530 395, 490 380, 525 365
           Z"
        fill="#ffffff"
        stroke="#e2e8f0"
        stroke-width="1.5"/>

  <!-- Gill plate white crescent arc -->
  <path d="M 530 310
           C 510 345, 515 390, 565 415
           C 585 425, 630 420, 665 405
           C 620 395, 575 380, 555 350
           C 545 330, 540 315, 530 310
           Z"
        fill="#ffffff"
        opacity="0.95"/>

  <!-- White curved belly stripe extending to tail -->
  <path d="M 235 520
           C 275 420, 365 375, 495 360
           C 440 385, 360 435, 310 520
           C 275 580, 260 625, 255 640
           C 245 610, 225 565, 235 520
           Z"
        fill="#ffffff"
        opacity="0.95"/>

  <!-- Smooth cyan contour between white belly & dark spine -->
  <path d="M 240 515 C 285 410, 375 365, 510 350" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>

  <!-- ========================================== -->
  <!-- 5. CATFISH HEAD, SNOUT & EYE               -->
  <!-- ========================================== -->
  <!-- Mouth crease and jaw contour -->
  <path d="M 760 380 Q 795 375 820 375 C 800 405, 765 415, 730 410" fill="#041838" stroke="#00b4d8" stroke-width="3"/>

  <!-- Catfish Eye -->
  <g id="fishEye">
    <!-- Outer Cyan Ring -->
    <circle cx="680" cy="325" r="22" fill="#021636" stroke="#38bdf8" stroke-width="5"/>
    <!-- Deep Navy Pupil -->
    <circle cx="680" cy="325" r="14" fill="#030b1c"/>
    <!-- Specular White Catchlight Reflection -->
    <circle cx="675" cy="320" r="6" fill="#ffffff"/>
    <circle cx="686" cy="331" r="2.5" fill="#bae6fd"/>
  </g>

  <!-- ========================================== -->
  <!-- 6. CATFISH WHISKERS / BARBELS (DISTINCT)   -->
  <!-- ========================================== -->
  <g id="barbels" stroke-linecap="round" fill="none">
    <!-- Primary Upper Long Barbel (Sweeping arc right & down) -->
    <path d="M 785 365
             C 850 375, 930 420, 930 500
             C 930 540, 890 570, 840 580"
          stroke="#052c6e" stroke-width="12"/>
    <path d="M 785 365
             C 850 375, 930 420, 930 500
             C 930 540, 890 570, 840 580"
          stroke="#38bdf8" stroke-width="5"/>
    <path d="M 785 365
             C 850 375, 930 420, 930 500
             C 930 540, 890 570, 840 580"
          stroke="#ffffff" stroke-width="2.5" opacity="0.8"/>

    <!-- Secondary Long Barbel (Inner curve) -->
    <path d="M 760 385
             C 810 400, 880 445, 875 510
             C 870 545, 835 565, 785 570"
          stroke="#042052" stroke-width="10"/>
    <path d="M 760 385
             C 810 400, 880 445, 875 510
             C 870 545, 835 565, 785 570"
          stroke="#0284c7" stroke-width="4"/>

    <!-- Chin / Mandibular Barbel 1 -->
    <path d="M 690 418
             C 730 450, 770 510, 755 575"
          stroke="#0c3575" stroke-width="7"/>
    <path d="M 690 418
             C 730 450, 770 510, 755 575"
          stroke="#38bdf8" stroke-width="3"/>

    <!-- Chin / Mandibular Barbel 2 -->
    <path d="M 630 422
             C 650 460, 680 520, 650 560"
          stroke="#05214d" stroke-width="6"/>
    <path d="M 630 422
             C 650 460, 680 520, 650 560"
          stroke="#0ea5e9" stroke-width="2.5"/>

    <!-- Short Snout Barbel -->
    <path d="M 730 345 C 770 340, 805 320, 825 330" stroke="#38bdf8" stroke-width="4"/>
  </g>

  <!-- ========================================== -->
  <!-- 7. PECTORAL FIN (MID FLANK)                -->
  <!-- ========================================== -->
  <g id="pectoralFin">
    <path d="M 330 385
             C 380 395, 450 420, 465 445
             C 430 465, 360 450, 325 410
             Z"
          fill="#052354"
          stroke="#0284c7"
          stroke-width="3"/>
    <path d="M 345 395 Q 405 420 445 440" stroke="#38bdf8" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 335 405 Q 380 430 415 445" stroke="#7dd3fc" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>

  <!-- ========================================== -->
  <!-- 8. CAUDAL TAIL FIN (DIVING INTO WAVES)     -->
  <!-- ========================================== -->
  <g id="caudalFin">
    <path d="M 270 600
             C 285 640, 340 710, 400 755
             C 370 765, 320 780, 240 760
             C 190 750, 160 705, 175 645
             C 195 595, 230 580, 270 600
             Z"
          fill="url(#fishBodyGrad)"
          stroke="#0077b6"
          stroke-width="4"/>
    <!-- Tail fin ray highlights -->
    <path d="M 235 625 C 240 670, 275 725, 345 750" stroke="#38bdf8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M 215 640 C 220 680, 245 725, 295 755" stroke="#7dd3fc" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 195 655 C 200 690, 220 725, 255 755" stroke="#bae6fd" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </g>

  <!-- ========================================== -->
  <!-- 9. FLOWING OCEAN / WATER WAVES (BOTTOM)    -->
  <!-- ========================================== -->
  <!-- Deep Blue Base Wave -->
  <path d="M 350 780
           C 420 850, 520 890, 640 890
           C 740 890, 800 850, 825 805
           C 750 840, 650 855, 550 830
           C 440 805, 380 750, 350 780
           Z"
        fill="url(#waveGrad1)"/>

  <!-- Middle Cresting Blue Wave -->
  <path d="M 345 760
           C 420 830, 560 880, 720 850
           C 785 838, 830 805, 845 780
           C 800 815, 730 835, 640 830
           C 510 820, 420 760, 345 760
           Z"
        fill="url(#waveGrad2)"/>

  <!-- Wave 1 White Foam Strip -->
  <path d="M 360 740
           C 430 805, 545 845, 680 825
           C 730 818, 775 795, 810 770
           C 760 795, 705 810, 640 810
           C 520 810, 435 765, 360 740
           Z"
        fill="#ffffff"
        opacity="0.95"/>

  <!-- Wave 2 White Foam Strip -->
  <path d="M 385 710
           C 450 765, 540 795, 640 780
           C 680 772, 720 750, 750 725
           C 710 750, 665 765, 610 765
           C 515 765, 445 730, 385 710
           Z"
        fill="#ffffff"
        opacity="0.95"/>

  <!-- Wave 3 Top Crest Wave -->
  <path d="M 405 690
           C 475 735, 555 755, 635 730
           C 665 720, 695 700, 715 675
           C 685 700, 645 715, 595 715
           C 520 715, 460 695, 405 690
           Z"
        fill="#38bdf8"/>

  <!-- Dynamic splash tail curling along bottom ring -->
  <path d="M 345 830
           C 320 850, 350 870, 410 890
           C 480 915, 560 920, 640 915
           C 550 915, 460 900, 390 870
           C 350 850, 335 835, 345 830
           Z"
        fill="#0284c7"
        opacity="0.8"/>

  <!-- ========================================== -->
  <!-- 10. TROPICAL GREEN LEAF (LOWER RIGHT)      -->
  <!-- ========================================== -->
  <!-- Slanted organic leaf silhouette -->
  <path d="M 680 760
           C 660 700, 665 600, 720 540
           C 775 480, 880 475, 955 490
           C 960 520, 930 640, 860 710
           C 800 770, 720 785, 680 760
           Z"
        fill="url(#leafGrad)"
        stroke="#15803d"
        stroke-width="5"
        stroke-linejoin="round"/>

  <!-- Curved Pure White Leaf Spine / Midrib Highlight -->
  <path d="M 685 750
           C 705 690, 740 600, 830 535
           C 870 505, 915 495, 945 492
           C 910 505, 860 535, 810 575
           C 745 630, 705 695, 685 750
           Z"
        fill="#ffffff"
        opacity="0.95"/>

  <!-- Silver/White Stem Accent connecting to waves -->
  <path d="M 675 765 C 685 755, 695 750, 710 740" stroke="#f1f5f9" stroke-width="7" stroke-linecap="round"/>
</svg>`;

// Ensure output directories exist
fs.mkdirSync('./public', { recursive: true });
fs.mkdirSync('./src/assets/images', { recursive: true });

// 1. Write the vector SVG files
fs.writeFileSync('./public/round_transparent.svg', svgContent, 'utf-8');
fs.writeFileSync('./public/logo.svg', svgContent, 'utf-8');
fs.writeFileSync('./src/assets/images/round_transparent.svg', svgContent, 'utf-8');
fs.writeFileSync('./src/assets/images/logo.svg', svgContent, 'utf-8');

console.log('Saved SVG files.');

// 2. Render crisp PNGs using @resvg/resvg-js
const resvg = new Resvg(svgContent, {
  fitTo: {
    mode: 'width',
    value: 1024,
  },
});
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

fs.writeFileSync('./public/round_transparent.png', pngBuffer);
fs.writeFileSync('./public/logo.png', pngBuffer);
fs.writeFileSync('./public/favicon.png', pngBuffer);
fs.writeFileSync('./src/assets/images/round_transparent.png', pngBuffer);
fs.writeFileSync('./src/assets/images/logo.png', pngBuffer);

// Also generate a 128x128 favicon
const resvgFavicon = new Resvg(svgContent, {
  fitTo: {
    mode: 'width',
    value: 128,
  },
});
const faviconBuffer = resvgFavicon.render().asPng();
fs.writeFileSync('./public/favicon-128.png', faviconBuffer);

console.log('Successfully generated high-resolution PNGs at /public and /src/assets/images!');
