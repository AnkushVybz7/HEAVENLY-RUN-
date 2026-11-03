import * as THREE from 'three';
import { FlavourId } from '../../types';

/**
 * Procedural texture generator for HEAVENLY-RUN beverage cans.
 * Draws high-resolution cylindrical label textures and condensation bump maps
 * adhering strictly to the official packaging artwork references.
 */

export function createCanTexture(flavour: FlavourId): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const isDevil = flavour === 'devil-rush';

  // 1. Background base gradient
  if (isDevil) {
    // Devil Rush: Midnight Black, Deep Crimson, Metallic Silver streaks
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090B12');
    bgGrad.addColorStop(0.3, '#140608');
    bgGrad.addColorStop(0.5, '#260408');
    bgGrad.addColorStop(0.7, '#140608');
    bgGrad.addColorStop(1, '#090B12');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Crimson dynamic flames / energy streaks
    for (let i = 0; i < 18; i++) {
      ctx.save();
      const x = (width / 18) * i + Math.sin(i) * 30;
      const streakGrad = ctx.createRadialGradient(x, height * 0.7, 10, x, height * 0.7, 300);
      streakGrad.addColorStop(0, 'rgba(181, 18, 39, 0.45)');
      streakGrad.addColorStop(0.5, 'rgba(120, 10, 25, 0.25)');
      streakGrad.addColorStop(1, 'rgba(9, 11, 18, 0)');
      ctx.fillStyle = streakGrad;
      ctx.beginPath();
      ctx.ellipse(x, height * 0.65, 140, 320, (i % 2 === 0 ? 0.3 : -0.3), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else {
    // Heavenly Rush: Pearl White, Icy Sky Blue, Chrome Silver sweeps
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(0.25, '#EFF6FF');
    bgGrad.addColorStop(0.5, '#DBEAFE');
    bgGrad.addColorStop(0.75, '#EFF6FF');
    bgGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Icy blue cosmic mist / water energy waves
    for (let i = 0; i < 16; i++) {
      ctx.save();
      const x = (width / 16) * i;
      const waveGrad = ctx.createRadialGradient(x, height * 0.65, 15, x, height * 0.65, 320);
      waveGrad.addColorStop(0, 'rgba(23, 107, 255, 0.28)');
      waveGrad.addColorStop(0.4, 'rgba(168, 216, 255, 0.25)');
      waveGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      ctx.ellipse(x, height * 0.65, 160, 350, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Draw front facing graphics centered at width * 0.5 (and back facing graphics at width * 0.0 & 1.0)
  const drawLabelFace = (centerX: number, isFront: boolean) => {
    ctx.save();
    ctx.textAlign = 'center';

    if (isFront) {
      // 1. Top Small Brand Wordmark
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '8px';
      ctx.fillStyle = isDevil ? '#C7CDD5' : '#4B6B94';
      ctx.fillText('HEAVENLY-RUN', centerX, 130);

      ctx.font = '600 13px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '12px';
      ctx.fillStyle = isDevil ? '#B51227' : '#176BFF';
      ctx.fillText('ENERGY', centerX, 155);

      // Subtle divider line
      ctx.strokeStyle = isDevil ? 'rgba(181, 18, 39, 0.5)' : 'rgba(23, 107, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - 90, 165);
      ctx.lineTo(centerX + 90, 165);
      ctx.stroke();

      // 2. Official "HR" Emblem with Celestial 4-Point Star
      const logoY = 320;

      // Draw the 4-point celestial star behind HR
      ctx.save();
      ctx.shadowColor = isDevil ? '#B51227' : '#176BFF';
      ctx.shadowBlur = 25;
      ctx.strokeStyle = isDevil ? '#C7CDD5' : '#176BFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Vertical flare
      ctx.moveTo(centerX, logoY - 110);
      ctx.lineTo(centerX, logoY + 110);
      // Horizontal flare
      ctx.moveTo(centerX - 70, logoY);
      ctx.lineTo(centerX + 70, logoY);
      ctx.stroke();

      // Diagonal orbital halo ring
      ctx.beginPath();
      ctx.ellipse(centerX, logoY, 130, 45, -0.28, 0, Math.PI * 2);
      ctx.strokeStyle = isDevil ? 'rgba(199, 205, 213, 0.7)' : 'rgba(23, 107, 255, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Stylized metallic "HR" text
      ctx.save();
      ctx.font = '900 115px "Orbitron", sans-serif';
      ctx.letterSpacing = '-4px';
      ctx.shadowColor = isDevil ? 'rgba(181, 18, 39, 0.8)' : 'rgba(23, 107, 255, 0.7)';
      ctx.shadowBlur = 20;

      const hrGrad = ctx.createLinearGradient(centerX - 90, logoY - 50, centerX + 90, logoY + 50);
      if (isDevil) {
        hrGrad.addColorStop(0, '#FFFFFF');
        hrGrad.addColorStop(0.35, '#C7CDD5');
        hrGrad.addColorStop(0.6, '#B51227');
        hrGrad.addColorStop(1, '#5E000D');
      } else {
        hrGrad.addColorStop(0, '#FFFFFF');
        hrGrad.addColorStop(0.4, '#C7CDD5');
        hrGrad.addColorStop(0.7, '#A8D8FF');
        hrGrad.addColorStop(1, '#176BFF');
      }

      ctx.fillStyle = hrGrad;
      ctx.fillText('HR', centerX, logoY + 38);

      // Metallic stroke
      ctx.strokeStyle = isDevil ? '#C7CDD5' : '#0F4BB0';
      ctx.lineWidth = 3;
      ctx.strokeText('HR', centerX, logoY + 38);
      ctx.restore();

      // Sub-brand below emblem
      ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillStyle = isDevil ? '#B51227' : '#176BFF';
      ctx.fillText('HEAVENLY-RUN', centerX, 430);

      // 3. Flavour Title
      ctx.save();
      ctx.font = '900 48px "Orbitron", sans-serif';
      ctx.letterSpacing = '5px';
      if (isDevil) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#B51227';
        ctx.shadowBlur = 12;
        ctx.fillText('DEVIL', centerX, 540);
        ctx.fillText('RUSH', centerX, 595);
      } else {
        ctx.fillStyle = '#0F2B5C';
        ctx.shadowColor = '#A8D8FF';
        ctx.shadowBlur = 12;
        ctx.fillText('HEAVENLY', centerX, 540);
        ctx.fillText('RUSH', centerX, 595);
      }
      ctx.restore();

      // 4. Flavour Category
      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillStyle = isDevil ? '#FF4A61' : '#176BFF';
      ctx.fillText(isDevil ? 'SPICY & SOUR' : 'SWEET & SOUR', centerX, 640);

      // 5. Specifications & Badges
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillStyle = isDevil ? '#F5F7FC' : '#1A2E4C';
      ctx.fillText('300 ML', centerX, 705);

      ctx.font = '600 16px "Space Grotesk", sans-serif';
      ctx.fillStyle = isDevil ? '#C7CDD5' : '#335380';
      ctx.fillText('100 MG CAFFEINE', centerX, 735);
      ctx.fillText('ZERO SUGAR', centerX, 760);
      ctx.fillText('ZERO CALORIES', centerX, 785);

      // 6. Slogan at base of label
      ctx.font = '800 15px "Orbitron", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillStyle = isDevil ? '#B51227' : '#176BFF';
      ctx.fillText(isDevil ? 'SOUR FIRST. FIRE LAST.' : 'SWEET FIRST. SOUR NEXT.', centerX, 840);

      // 7. Responsible warning statement
      ctx.font = '400 9px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '0.5px';
      ctx.fillStyle = isDevil ? 'rgba(199, 205, 213, 0.6)' : 'rgba(26, 46, 76, 0.6)';
      ctx.fillText('CAFFEINATED BEVERAGE. NOT RECOMMENDED FOR CHILDREN OR SENSITIVE INDIVIDUALS.', centerX, 875);

    } else {
      // BACK OF CAN: Nutrition Facts Panel & Barcode
      ctx.fillStyle = isDevil ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 43, 92, 0.05)';
      ctx.fillRect(centerX - 160, 200, 320, 520);
      ctx.strokeStyle = isDevil ? 'rgba(199, 205, 213, 0.3)' : 'rgba(23, 107, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - 160, 200, 320, 520);

      ctx.textAlign = 'left';
      ctx.fillStyle = isDevil ? '#FFFFFF' : '#0F2B5C';
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.fillText('NUTRITIONAL FACTS (PROVISIONAL)', centerX - 140, 240);

      ctx.font = '13px "Space Grotesk", sans-serif';
      ctx.fillStyle = isDevil ? '#C7CDD5' : '#335380';
      ctx.fillText('Serving Size: 1 Can (300 ml)', centerX - 140, 270);
      ctx.fillText('Servings Per Container: 1', centerX - 140, 290);

      // Table lines
      const items = [
        ['Calories', '0'],
        ['Total Fat', '0g (0% DV)'],
        ['Sodium', '45mg (2% DV)'],
        ['Total Carbohydrate', '0g (0% DV)'],
        ['Total Sugars', '0g'],
        ['Added Sugars', '0g (0% DV)'],
        ['Protein', '0g'],
        ['Caffeine Blend', '100 mg*'],
        ['Taurine & B-Vitamins', 'Complex Active'],
      ];

      let rowY = 330;
      items.forEach(([label, val]) => {
        ctx.fillStyle = isDevil ? '#E2E8F0' : '#1A2E4C';
        ctx.font = '500 13px "Space Grotesk", sans-serif';
        ctx.fillText(label, centerX - 140, rowY);
        ctx.textAlign = 'right';
        ctx.fillText(val, centerX + 140, rowY);
        ctx.textAlign = 'left';

        ctx.strokeStyle = isDevil ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
        ctx.beginPath();
        ctx.moveTo(centerX - 140, rowY + 6);
        ctx.lineTo(centerX + 140, rowY + 6);
        ctx.stroke();

        rowY += 28;
      });

      // Disclaimer
      ctx.font = '400 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isDevil ? 'rgba(199, 205, 213, 0.6)' : 'rgba(26, 46, 76, 0.6)';
      ctx.fillText('*Daily Value (DV) not established.', centerX - 140, 600);
      ctx.fillText('Formulated in the Celestial Lab.', centerX - 140, 615);
      ctx.fillText('Recycle Aluminium Can.', centerX - 140, 630);

      // Barcode graphic
      for (let b = 0; b < 45; b++) {
        const bx = centerX - 130 + b * 6;
        const bw = (b % 3 === 0 || b % 7 === 0) ? 4 : 2;
        ctx.fillStyle = isDevil ? '#C7CDD5' : '#0F2B5C';
        ctx.fillRect(bx, 655, bw, 45);
      }
    }

    ctx.restore();
  };

  // Render front in center (x = width * 0.5)
  drawLabelFace(width * 0.5, true);
  // Render back at left (x = width * 0.1) and right (x = width * 0.9) to wrap nicely
  drawLabelFace(width * 0.1, false);
  drawLabelFace(width * 0.9, false);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural water condensation droplet bump texture
 */
export function createDropletBumpMap(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Neutral grey base (no bump)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Draw procedural moisture beads and droplets
  const dropletCount = 600;
  for (let i = 0; i < dropletCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 4 + 1;

    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    grad.addColorStop(0, '#FFFFFF'); // Highlight (high height)
    grad.addColorStop(0.7, '#A0A0A0');
    grad.addColorStop(1, '#808080'); // Base level

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw some subtle vertical condensation drip streaks
  for (let s = 0; s < 30; s++) {
    const sx = Math.random() * size;
    const sy = Math.random() * (size * 0.6) + size * 0.2;
    const sLen = Math.random() * 40 + 15;

    ctx.strokeStyle = '#B0B0B0';
    ctx.lineWidth = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy + sLen);
    ctx.stroke();
  }

  const bumpTexture = new THREE.CanvasTexture(canvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(2, 2);
  return bumpTexture;
}
