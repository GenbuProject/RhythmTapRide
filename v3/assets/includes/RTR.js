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

	static get ExtendedComponent () {
		return class ExtendedComponent {
			constructor (onChange = (data) => {}) {
				this.watcher = new MutationObserver(datas => {
					datas.forEach(data => {
						onChange(data);
					});
				});
			}
		}
	}

	static get Scorebar () {
		return class Scorebar extends RTR.ExtendedComponent {
			constructor (score = 0) {
				super(data => {
					switch (data.attributeName) {
						case "score":
							this.score = data.target[data.attributeName];
							break;
					}
				});

				this.self = DOM("RTR-Scorebar");
				this.score = score;

				this.watcher.observe(this.self, {
					attributes: true
				});
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