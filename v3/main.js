let base = new RTR(9);

window.requestAnimationFrame(function looper () {
	RTR.Graphic.clearBackground(base.toneCtx, base);

	base.tones.forEach((tone, index) => {
		if (tone) {
			tone.render();

			tone.x += tone.dx,
			tone.y -= tone.dy;

			if (tone.x + tone.radius < 0 || tone.x - tone.radius > base.width || tone.y + tone.radius < 0 || tone.y - tone.radius > base.height) {
				base.tones.splice(index, 1);
			}
		}
	});

	window.requestAnimationFrame(looper);
});

window.addEventListener("resize", () => {
	base.width = DOM.width,
	base.height = DOM.height - base.score.self.offsetHeight;
});

setInterval(() => {
	switch (Math.random.randomInt(1)) {
		case 0:
			new RTR.Tone(base, DOM.Util.degToRad(180 + 180 / 8 * Math.random.randomInt(0, 8)));
			break;

		case 1:
			new RTR.Tone.LongTone(base, DOM.Util.degToRad(180 + 180 / 8 * Math.random.randomInt(0, 8)), 8);
			break;
	}
}, 500);

/*setInterval(() => {
	base.score.score += Math.random.randomInt(1000, 1500);
	
	if (base.score.score >= 1000000) base.score.score = 0;
});*/