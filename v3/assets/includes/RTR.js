class RTR {
	static get ASSETS () {
		return {
			IMAGES: {
				ENDPOINT: (() => {
					let img = new Image();
						img.src = "assets/images/EndPoint.png";
						
					return img
				})()
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

	static get ToneStreamCollection () {
		return class ToneStreamCollection extends Array {
			constructor (root, length = 0) {
				super();

				for (let i = 0; i < length; i++) {
					this.push(new RTR.ToneStream(root, 180 / (length - 1) * i));
				}
			}

			render () {
				this.forEach(stream => {
					stream.endPoint.render();

					let dx = stream.speed * Math.cos(DOM.Util.degToRad(180 + stream.deg)),
						dy = -stream.speed * Math.sin(DOM.Util.degToRad(180 + stream.deg));

					stream.tones.forEach((tone, index) => {
						this.root.toneCtx.clearRect(tone.x - tone.radius, tone.y - tone.radius, tone.radius * 2, tone.radius * 2);
						
						tone.x += dx,
						tone.y += dy;
			
						tone.render();
			
						if (tone.x < 0 || tone.x > this.root.width + tone.radius || tone.y > this.root.height + tone.radius) {
							stream.tones.splice(index);
						}
					});

					RTR.Graphic.clearBackground(stream.root.streamCtx, stream.root);
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
						//RTR.Graphic.fillCircle(this.root.streanCtx, this.x, this.y, this.radius - Tone.ringDistance, this.color);
						RTR.Graphic.strokeCircle(this.root.streanCtx, this.x, this.y, this.radius, this.color, 2.5);
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
						RTR.Graphic.drawImageAsCircle(this.root.streamCtx, RTR.ASSETS.IMAGES.ENDPOINT, this.x, this.y, this.radius - EndPoint.ringDistance);
						RTR.Graphic.strokeCircle(this.root.streamCtx, this.x, this.y, this.radius, this.color, 2.5);
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



	constructor () {
		let scorebar = new RTR.Scorebar(),
			score = this.score = new RTR.Scorebar.Score(0);
			
			scorebar.self.appendChild(score.self),
			document.body.appendChild(scorebar.self);

		let playingLayout = new DOM("RTR-Layout"),
			streamCvs = this.streamCvs = new DOM("Canvas", { id: "StreamCanvas" }),
			toneCvs = this.toneCvs = new DOM("Canvas", { id: "ToneCanvas" });

			playingLayout.appendChild(streamCvs),
			playingLayout.appendChild(toneCvs),
			document.body.appendChild(playingLayout);

		this.streamCtx = this.streamCvs.getContext("2d"),
		this.toneCtx = this.toneCvs.getContext("2d");

		this.width = DOM.width,
		this.height = DOM.height - score.self.offsetHeight;
	}

	get width () { return this._width }

	set width (val = 0) {
		this._width = val;

		[this.streamCvs, this.toneCvs].forEach(cvs => {
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

		[this.streamCvs, this.toneCvs].forEach(cvs => {
			cvs.applyProperties({
				attributes: {
					height: this._height
				}
			});
		});
	}
}