class RTR {
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

	static get ToneStream () {
		return class ToneStream {
			constructor (deg = 0, speed = 2.5) {
				this.x = RTR.self.width / 2,
				this.y = RTR.self.height / 5;

				this.deg = deg,
				this.speed = speed;
			}

			addTone () {
				let tone = new RTR.Tone(this.x, this.y, 1),
					dx = this.speed * Math.cos(DOM.util.degToRad(180 + this.deg)),
					dy = -this.speed * Math.sin(DOM.util.degToRad(180 + this.deg));

				let looper = setInterval(() => {
					tone.x += dx,
					tone.y += dy,
					tone.radius += 250 / -(RTR.self.height - this.y) / dy;

					tone.render();

					if (tone.x < 0 || tone.x > RTR.self.width + tone.radius || tone.y > RTR.self.height + tone.radius) {
						clearInterval(looper);
					}
				});
			}
		}
	}

	static get Tone () {
		return class Tone {
			constructor (x = 0, y = 0, radius = 10) {
				this.x = x,
				this.y = y,
				this.radius = radius;

				this.ringColor = "Plum";
			}

			render () {
				let ctx = RTR.self.ctx;
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
					ctx.closePath();

					ctx.strokeStyle = this.ringColor;
					ctx.stroke();
			}
		}
	}

	static get TapTone () {
		return class TapTone extends RTR.Tone {
			constructor (x = 0, y = 0, radius = 10) {
				super(x, y, z);
			}
		}
	}

	static get Scorebar () {
		return class Scorebar {
			constructor (score = 0) {
				this.self = DOM("RTR-Scorebar");

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
		let scorebar = this.scorebar = new RTR.Scorebar(0);
			document.body.appendChild(scorebar.self);

		let cvs = this.cvs = DOM("Canvas", { id: "PlayingLayout" });
			document.body.appendChild(cvs);



		this.width = DOM.width,
		this.height = DOM.height - scorebar.self.offsetHeight;

		this.ctx = this.cvs.getContext("2d");
	}

	get width () { return this._width }

	set width (val = 0) {
		this._width = val;

		this.cvs.applyProperties({ attributes: { width: this._width } });
	}

	get height () { return this._height }

	set height (val = 0) {
		this._height = val;

		this.cvs.applyProperties({ attributes: { height: this._height } });
	}
}