let base = new RTR();

window.addEventListener("resize", () => {
	base.width = DOM.width,
	base.height = DOM.height - base.scorebar.self.offsetHeight;

	base.cvs.applyProperties({
		attributes: {
			width: base.width,
			height: base.height
		}
	});
})