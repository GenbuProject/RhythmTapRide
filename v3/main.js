let base = new RTR(9);

requestAnimationFrame(function looper () {
	RTR.Graphic.clearBackground(base.toneCtx, base);

	base.tones.forEach((tone, index) => {
		tone.render();

		tone.x += tone.dx,
		tone.y -= tone.dy;

		if (tone.x < 0 || tone.x > base.width || tone.y < 0 || tone.y > base.height) base.tones.splice(index);
	});

	requestAnimationFrame(looper);
});

window.addEventListener("resize", () => {
	base.width = DOM.width,
	base.height = DOM.height - base.score.self.offsetHeight;
});

setInterval(() => {
	new RTR.Tone(base, DOM.Util.degToRad(180 + 180 / 8 * Math.random.randomInt(0, 8)));
}, 500);

/*setInterval(() => {
	base.score.score += Math.random.randomInt(1000, 1500);
	
	if (base.score.score >= 1000000) base.score.score = 0;
});*/