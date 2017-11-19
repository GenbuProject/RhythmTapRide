let base = new RTR();
	base.toneStreams = [];
	for (let i = 0; i < 9; i++) base.toneStreams[i] = new RTR.ToneStream(base, 180 / 8 * i);

window.addEventListener("resize", () => {
	base.width = DOM.width,
	base.height = DOM.height - base.score.self.offsetHeight;

	base.cvs.applyProperties({
		attributes: {
			width: base.width,
			height: base.height
		}
	});
});

setInterval(() => {
	base.score.score += Math.random.randomInt(1000, 1500);
	
	if (base.score.score >= 1000000) base.score.score = 0;
});