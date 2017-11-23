let base = new RTR();
	base.streams = new RTR.ToneStreamCollection(base, 8);

requestAnimationFrame(function looper () {
	base.Graphic.clearBackground();
	base.streams.render();

	/*base.streams.forEach(stream => {
		let dx = stream.speed * Math.cos(DOM.Util.degToRad(180 + stream.deg)),
			dy = -stream.speed * Math.sin(DOM.Util.degToRad(180 + stream.deg));

		stream.tones.forEach((tone, index) => {
			base.ctx.fillStyle = "Black";
			base.ctx.fillRect(tone.x - tone.radius, tone.y - tone.radius, tone.radius * 2, tone.radius * 2);
			
			tone.x += dx,
			tone.y += dy;

			tone.render();

			if (tone.x < 0 || tone.x > base.width + tone.radius || tone.y > base.height + tone.radius) {
				stream.tones.splice(index);
			}
		});
		
		stream.endPoint.render();
	});*/
	
	requestAnimationFrame(looper);
});

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

/*setInterval(() => {
	base.score.score += Math.random.randomInt(1000, 1500);
	
	if (base.score.score >= 1000000) base.score.score = 0;
});*/
