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

	static get Tone () {
		return class Tone {
			constructor () {

			}

			renderer () {
				
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
				this._score = val;

				this.self.setAttribute("score", this._score);
				this.self.style.setProperty("--Score", this.score > 1000000 ? "100%" : `${this._score / 10000}%`);
			}
		}
	}



	constructor () {
		this.frameSize = Math.min(DOM.width, DOM.height);

		this.cvs = DOM("Canvas", {
			id: "PlayingLayout",

			attributes: {
				width: this.frameSize,
				height: this.frameSize
			},

			styles: {
				background: "Black"
			}
		});

		document.body.appendChild(this.cvs);
	}
}