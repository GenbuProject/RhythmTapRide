const COLORS = ["Cyan", "ForestGreen", "Yellow", "Red"];

let base = new RTR(9);

requestAnimationFrame(function looper () {
	//RTR.Graphic.clearBackground(base.toneCtx, base);

	requestAnimationFrame(looper);
});

window.addEventListener("resize", () => {
	base.width = DOM.width,
	base.height = DOM.height - base.score.self.offsetHeight;
});

/*setInterval(() => {
	base.score.score += Math.random.randomInt(1000, 1500);
	
	if (base.score.score >= 1000000) base.score.score = 0;
});*/