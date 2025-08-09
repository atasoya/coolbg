import * as p from '@clack/prompts';
import color from 'picocolors';
import path from 'node:path';
import { access } from 'node:fs/promises';
import sharp from 'sharp';

function gradientSvg(width, height, style) {
  const gradients = {
    '1': ['#ff7e5f', '#feb47b'], // orange & yellow
    '2': ['#2193b0', '#6dd5ed'], // blue & green
    '3': ['#DA22FF', '#9733EE'], // pink & purple
    '4': ['#ff512f', '#4caf50'], // red & green
    '5': ['#e52d27', '#1e3c72'], // red & blue
    '6': ['#ff512f', '#f09819'], // red & yellow
  };
  const [start, end] = gradients[style] ?? gradients['1'];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${start}" />
      <stop offset="100%" stop-color="${end}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
</svg>`;
}

function roundedMaskSvg(width, height, radius) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#000"/>
</svg>`;
}

async function main() {
	console.clear();
	p.updateSettings({
		aliases: {
			w: 'up',
			s: 'down',
			a: 'left',
			d: 'right',
		},
	});

	p.intro(`${color.bgCyan(color.black('coolbg'))}`);

	const project = await p.group(
		{
			path: () =>
				p.text({
					message: 'Path of the image:',
					placeholder: './my-not-so-cool-image.png',
					validate: (value) => {
						if (!value) return 'Please enter a path.';
						if (value[0] !== '.') return 'Please enter a relative path.';
					},
				}),
			background: ({ results }) =>
				p.select({
					message: `Pick a cool background for "${results.path}":`,
					initialValue: '1',
					maxItems: 5,
					options: [
						{ value: '1', label: 'orange & yellow' },
						{ value: '2', label: 'blue & green' },
						{ value: '3', label: 'pink & purple' },
						{ value: '4', label: 'red & green' },
						{ value: '5', label: 'red & blue' },
						{ value: '6', label: 'red & yellow' },
					],
				}),
			padding: () =>
				p.text({
					message: 'Image padding:',
					placeholder: '10',
					validate: (value) => {
						if (value == null || value.trim() === '') return 'Please enter a padding.';
						const num = Number(value);
						if (!Number.isFinite(num)) return 'Please enter a number.';
					},
				}),
			imageRoundness: () =>
				p.text({
					message: 'Original image roundness (%) [0-50]:',
					placeholder: '12',
					validate: (value) => {
						if (value == null || value.trim() === '') return 'Please enter a roundness percentage.';
						const num = Number(value);
						if (!Number.isFinite(num)) return 'Please enter a number.';
						if (num < 0 || num > 50) return 'Enter a value between 0 and 50.';
					},
				}),
		},
		{
			onCancel: () => {
				p.cancel('Operation cancelled.');
				process.exit(0);
			},
		}
	);


	try {
		const inputPath = path.resolve(process.cwd(), project.path);
		await access(inputPath);
		const extOk = /(\.png|\.jpg|\.jpeg)$/i.test(inputPath);
		if (!extOk) {
			p.cancel('Only .png, .jpg, or .jpeg files are supported.');
			process.exit(1);
		}

		const inputImage = sharp(inputPath);
		const meta = await inputImage.metadata();
		if (!meta.width || !meta.height) {
			p.cancel('Could not read image dimensions.');
			process.exit(1);
		}

		const padding = Number(project.padding);
		const canvasWidth = meta.width + padding * 2;
		const canvasHeight = meta.height + padding * 2;
		const cornerRadius = Math.round(Math.min(canvasWidth, canvasHeight) * 0.06);

		const bgSvg = gradientSvg(canvasWidth, canvasHeight, project.background);
		const maskSvg = roundedMaskSvg(canvasWidth, canvasHeight, cornerRadius);

		const outputPath = path.join(
			path.dirname(inputPath),
			`${path.parse(inputPath).name}-coolbg.png`
		);

		const roundPct = Number(project.imageRoundness);
		const imgRadius = Math.round(Math.min(meta.width, meta.height) * (roundPct / 100));
		const imgMaskSvg = roundedMaskSvg(meta.width, meta.height, imgRadius);
		const roundedOriginalBuffer = await sharp(await inputImage.png().toBuffer())
			.composite([{ input: Buffer.from(imgMaskSvg), blend: 'dest-in' }])
			.png()
			.toBuffer();

		await sharp(Buffer.from(bgSvg))
			.png()
			.composite([
				{ input: roundedOriginalBuffer, left: padding, top: padding },
				{ input: Buffer.from(maskSvg), blend: 'dest-in' },
			])
			.toFile(outputPath);

		const nextSteps = `Your cool image is ready at ${outputPath}\nStar our repo: https://github.com/coolbg/coolbg\nWebsite: https://coolbg.com`;
		p.note(nextSteps, 'Cool.');
		p.outro(`Star coolbg on GitHub <3 ${color.underline(color.cyan('https://github.com/coolbg/coolbg'))}`);
	} catch (err) {
		p.cancel(`Failed to process image: ${err instanceof Error ? err.message : String(err)}`);
		process.exit(1);
	}
}

main().catch(console.error);
