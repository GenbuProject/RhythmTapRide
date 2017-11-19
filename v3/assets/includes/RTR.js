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

	static get ToneStreamCollection () {
		return class ToneStreamCollection extends Array {
			constructor (root, length = 0) {
				super(length);

				for (let i = 0; i < length + 1; i++) this.push(new RTR.ToneStream(root, 180 / length * i));
			}

			render () {
				this.forEach(stream => {
					stream.endPoint.render();
				});
			}
		}
	}

	static get ToneStream () {
		return class ToneStream {
			static get Tone () {
				return class Tone {
					static get ringDistance () { return 5 }



					constructor (root, x = 0, y = 0, radius = 0) {
						this.root = root;

						this.x = x,
						this.y = y,
						this.radius = radius;
		
						this.color = "Plum";
					}
		
					render () {
						//this.root.Graphic.fillCircle(this.x, this.y, this.radius - Tone.ringDistance, this.color);
						this.root.Graphic.strokeCircle(this.x, this.y, this.radius, this.color, 2.5);
					}
				}
			}
		
			static get EndPoint () {
				return class EndPoint extends RTR.ToneStream.Tone {
					constructor (root, startX = 0, startY = 0, deg = 0) {
						super(root);

						this.x = startX + this.distance * Math.cos(DOM.Util.degToRad(180 + deg)),
						this.y = startY - this.distance * Math.sin(DOM.Util.degToRad(180 + deg)),
						this.radius = this.root.height / 10;

						this.color = "Cyan";

						this.render();
					}

					get distance () { return this.root.height / 8 * 5 }

					render () {
						this.root.Graphic.drawImageAsCircle("assets/images/EndPoint.png", this.x, this.y, this.radius - EndPoint.ringDistance);
						this.root.Graphic.strokeCircle(this.x, this.y, this.radius, this.color, 2.5);
					}
				}
			}



			constructor (root, deg = 0, speed = 2.5) {
				this.root = root;

				this.deg = deg,
				this.speed = speed;

				this.tones = [];
				this.endPoint = new RTR.ToneStream.EndPoint(this.root, this.x, this.y, this.deg, 20);
			}

			get x () { return this.root.width / 2 }
			get y () { return this.root.height / 5 }

			addTone () {
				let tone = new RTR.ToneStream.Tone(this.root, this.x, this.y, this.endPoint.radius),
					dx = this.speed * Math.cos(DOM.Util.degToRad(180 + this.deg)),
					dy = -this.speed * Math.sin(DOM.Util.degToRad(180 + this.deg));

				this.tones.push(tone);
			}
		}
	}



	constructor () {
		let scorebar = new RTR.Scorebar(),
			score = this.score = new RTR.Scorebar.Score(0);
			
			scorebar.self.appendChild(score.self);
			document.body.appendChild(scorebar.self);

		let cvs = this.cvs = new DOM("Canvas", { id: "PlayingLayout" });
			document.body.appendChild(cvs);



		this.width = DOM.width,
		this.height = DOM.height - score.self.offsetHeight;

		this.ctx = this.cvs.getContext("2d");
	}



	get Graphic () {
		let root = this,
			ctx = this.ctx;

		return class Graphic {
			static clearBackground () {
				ctx.clearRect(0, 0, root.width, root.height);
			}

			static shapeCircle (x = 0, y = 0, radius = 0) {
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2, true);
				ctx.closePath();
			}

			static strokeCircle (x = 0, y = 0, radius = 0, color = "Red", strokeWidth = 1) {
				this.shapeCircle(x, y, radius);

				ctx.strokeStyle = color,
				ctx.lineWidth = strokeWidth;

				ctx.stroke();
				
				ctx.strokeStyle = "",
				ctx.lineWidth = 1;
			}

			static fillCircle (x = 0, y = 0, radius = 0, color = "Red") {
				this.shapeCircle(x, y, radius);

				ctx.fillStyle = color;
				ctx.fill();
			}

			static drawImage (url = "", x = 0, y = 0, width, height) {
				let img = new Image();
					img.src = url;

					img.addEventListener("load", () => {
						ctx.drawImage(img, x, y, width, height);
					});
			}

			static drawImageAsCircle (url = "", x = 0, y = 0, radius = 0) {
				let img = new Image();
					img.src = url;

					img.addEventListener("load", () => {
						ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
					});
			}
		}
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