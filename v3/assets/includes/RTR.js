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

			static shapeCircle (ctx, x = 0, y = 0, radius = 0) {
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2, true);
				ctx.closePath();
			}

			static strokeCircle (ctx, x = 0, y = 0, radius = 0, color = "Red", strokeWidth = 1) {
				this.shapeCircle(ctx, x, y, radius);

				ctx.strokeStyle = color,
				ctx.lineWidth = strokeWidth;

				ctx.stroke();
				
				ctx.strokeStyle = "",
				ctx.lineWidth = 1;
			}

			static fillCircle (ctx, x = 0, y = 0, radius = 0, color = "Red") {
				this.shapeCircle(ctx, x, y, radius);

				ctx.fillStyle = color;
				ctx.fill();
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
			constructor (root, x = 0, y = 0, color = "") {
				this.root = root;

				this.x = x,
				this.y = y,
				this.color = color;
			}

			get radius () { return this.root.height / 20 }

			render () {
				let ctx = this.root.toneCtx;
					RTR.Graphic.strokeCircle(ctx, this.x, this.y, this.radius, this.color, 2.5);
			}
		}
	}



	constructor (streamQuantity = 0) {
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
									this.sePlayer.src = "assets/sounds/Tone_Great.mp3";
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