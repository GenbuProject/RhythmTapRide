class RTR {
	static get ASSETS () {
		return {
			IMAGES: {
				ENDPOINT: (() => {
					let img = new Image();
						img.src = "assets/images/EndPoint.png";
						
					return img;
				})()
			}
		}
	}

	static get Graphic () {
		return class Graphic {
			static clearBackground (ctx, root) {
				ctx.clearRect(0, 0, root.width, root.height);
			}

			static initStroke (ctx, color = "", width = 1) {
				ctx.strokeStyle = color,
				ctx.lineWidth = width;
			}

			static initFill (ctx, color = "", width = 1) {
				ctx.fillStyle = color,
				ctx.lineWidth = width;
			}

			static shapeCircle (ctx, x = 0, y = 0, radius = 0) {
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2, true);
				ctx.closePath();
			}

			static strokeCircle (ctx, x = 0, y = 0, radius = 0, color = "", strokeWidth = 1) {
				this.shapeCircle(ctx, x, y, radius);

				this.initStroke(ctx, color, strokeWidth);
				ctx.stroke();
				this.initStroke(ctx);
			}

			static strokeCircleOnBorderBox (ctx, x = 0, y = 0, radius = 0, color = "", strokeWidth = 1) {
				this.strokeCircle(ctx, x, y, radius - strokeWidth, color, strokeWidth);
			}

			static fillCircle (ctx, x = 0, y = 0, radius = 0, color = "", strokeWidth = 1) {
				this.shapeCircle(ctx, x, y, radius);

				this.initFill(ctx, color, strokeWidth);
				ctx.fill();
				this.initFill(ctx);
			}

			static fillCircleOnBorderBox (ctx, x = 0, y = 0, radius = 0, color = "", strokeWidth = 1) {
				this.fillCircle(ctx, x, y, radius - strokeWidth, color, strokeWidth);
			}

			static drawImage (ctx, img = new Image(), x = 0, y = 0, width, height) {
				ctx.drawImage(img, x, y, width, height);
			}

			static drawImageAsCircle (ctx, img = new Image(), x = 0, y = 0, radius = 0) {
				ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
			}
		}
	}

	static get AudioPlayer () {
		return class AudioPlayer extends AudioContext {
			constructor (url = "") {
				super();

				this.src = url;
			}

			get src () { return this._src }

			set src (val = "") {
				this._src = val;

				if (this._src) {
					DOM.xhr({
						type: "GET",
						url: this._src,
						doesSync: true,
						resType: "arraybuffer",

						onLoad: (event) => {
							this.decodeAudioData(event.target.response, (audioBuffer) => {
								this.buffer = audioBuffer;
							});
						}
					});
				}
			}

			play () {
				let source = this.createBufferSource();
					source.buffer = this.buffer;
					source.connect(this.destination);

					source.start(0);
			}
		}
	}



	static get Scorebar () {
		return class Scorebar {
			static get Score () {
				return class Score {
					constructor (score = 0) {
						this.self = new DOM("RTR-Scorebar-Score");
		
						this.score = score;
					}
		
					get score () { return this._score }
		
					set score (val = 0) {
						this._score = (val > 1000000 ? 1000000 : val);
		
						this.self.setAttribute("score", this._score);
						this.self.style.setProperty("--Score", this._score > 1000000 ? '"1000000"' : `"${this._score}"`);
						this.self.style.setProperty("--ScorePercentage", this._score > 1000000 ? "100%" : `${this._score / 10000}%`);
					}
				}
			}



			constructor () {
				this.self = new DOM("RTR-Scorebar", {
					children: [
						new DOM("Img", {
							attributes: {
								"Src": "assets/images/Score.svg"
							}
						})
					]
				});
			}
		}
	}

	static get Tone () {
		return class Tone {
			constructor (root, deg = 0) {
				this.root = root;

				this.x = this.root.width / 2,
				this.y = DOM.vmin * (5 + 7.5),
				this.rad = DOM.Util.degToRad(180 + deg);

				this.dx = this.velocity * Math.cos(this.rad),
				this.dy = this.velocity * Math.sin(this.rad);

				base.tones.push(this);
			}

			get radius () { return DOM.vmin * 7.5 }
			get strokeWidth () { return DOM.vmin * 0.75 }
			get velocity () { return DOM.vmin * (60 + 7.5) / 60 }
			get color () { return "Plum" }

			render () {
				let ctx = this.root.toneCtx;
					RTR.Graphic.strokeCircleOnBorderBox(ctx, this.x, this.y, this.radius, this.color, this.strokeWidth);
			}
		}
	}

	static get LongTone () {
		return class LongTone extends RTR.Tone {
			constructor (root, deg = 0, length = 0) {
				super(root, deg);

				this.length = length;
			}

			get color () { return "Cyan" }

			render () {
				let ctx = this.root.toneCtx;
					RTR.Graphic.strokeCircleOnBorderBox(ctx, this.x, this.y, this.radius, this.color, this.strokeWidth);

					/*ctx.beginPath()
					ctx.moveTo(this.x - this.radius, this.y - this.radius);
					ctx.lineTo(this.x + this.dx * this.length, this.y - this.dy * this.length);
					ctx.closePath();

					RTR.Graphic.initStroke(ctx, this.color, this.strokeWidth);
					ctx.stroke();
					RTR.Graphic.initStroke(ctx);*/
			}
		}
	}



	constructor (streamQuantity = 0) {
		this.tones = [];
		this.sePlayer = new RTR.AudioPlayer();

		let scorebar = new RTR.Scorebar(),
			score = this.score = new RTR.Scorebar.Score(0);
			
			scorebar.self.appendChild(score.self),
			document.body.appendChild(scorebar.self);

		let playingLayout = new DOM("RTR-Layout"),
			streamLayout = new DOM("RTR-Layout-ToneStream"),

			toneCvs = this.toneCvs = new DOM("Canvas", { id: "ToneCanvas" });
			
			playingLayout.appendChild(toneCvs),
			playingLayout.appendChild(streamLayout);

			document.body.appendChild(playingLayout);

		for (let i = 0; i < streamQuantity; i++) {
			streamLayout.appendChild(
				new DOM("RTR-ToneStream", {
					styles: {
						"Transform": `Rotate(${90 - 180 / (streamQuantity - 1) * i}deg)`
					},

					children: [
						new DOM("RTR-ToneStream-EndPoint", {
							events: {
								"click": () => {
									this.sePlayer.src = "assets/sounds/Tone_Good.wav";
									this.sePlayer.play();

									this.score.score += Math.random.randomInt(1000, 1500);

									if (this.score.score >= 1000000) {
										this.score.score = 0;
									}
								}
							}
						})
					]
				})
			);
		}

		this.toneCtx = toneCvs.getContext("2d");

		this.width = DOM.width,
		this.height = DOM.height - score.self.offsetHeight;
	}

	get width () { return this._width }

	set width (val = 0) {
		this._width = val;

		[this.toneCvs].forEach(cvs => {
			cvs.applyProperties({
				attributes: {
					width: this._width
				}
			});
		});
	}

	get height () { return this._height }

	set height (val = 0) {
		this._height = val;

		[this.toneCvs].forEach(cvs => {
			cvs.applyProperties({
				attributes: {
					height: this._height
				}
			});
		});
	}
}