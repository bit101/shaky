(function() {
	var shaky = {
		canvas: null,
		context: null,
		segSize: 6,
		shake: 3,
		x: 0,
		y: 0,
		prevX: 0,
		prevY: 0,
		width: 0,
		height: 0,

		create: function(canvas) {
			var obj = Object.create(this);
			if(typeof canvas === "string") {
				canvas = document.getElementById(canvas);
			}
			obj.canvas = canvas;
			obj.context = obj.canvas.getContext("2d");
			obj.width = obj.canvas.width;
			obj.height = obj.canvas.height;
			return obj;
		},

		setSize: function(width, height) {
			this.canvas.width = this.width = width;
			this.canvas.height = this.height = height;
		},

		clear: function() {
			this.context.clearRect(0, 0, this.width, this.height);
		},

		beginPath: function() {
			this.context.beginPath();
		},

		stroke: function() {
			this.context.stroke();
		},

		fill: function() {
			this.context.fill();
		},

		rect: function(x, y, w, h) {
			this.moveTo(x, y);
			var startX = this.x,
				startY = this.y;
			this.lineTo(x + w, y);
			this.lineTo(x + w, y + h);
			this.lineTo(x, y + h);
			this.lineTo(startX, startY, true);
		},

		fillRect: function(x, y, w, h) {
			this.beginPath();
			this.rect(x, y, w, h);
			this.fill();
		},

		clearRect: function(x, y, w, h) {
			this.context.clearRect(x, y, w, h);
		},

		strokeRect: function(x, y, w, h) {
			this.beginPath();
			this.rect(x, y, w, h);
			this.stroke();
		},

		moveTo: function(x, y) {
			this._setXY(x + Math.random() * this.shake - this.shake / 2,
					   y + Math.random() * this.shake - this.shake / 2)
			this.context.moveTo(this.x, this.y);
		},

		lineTo: function(x, y, exactEnd) {
			var toX = exactEnd ? x : x + Math.random() * this.shake - this.shake / 2,
				toY = exactEnd ? y : y + Math.random() * this.shake - this.shake / 2
				dx = toX - this.x,
				dy = toY - this.y,
				dist = Math.sqrt(dx * dx + dy * dy),
				steps = Math.floor(dist / this.segSize),
				resX = dx / steps,
				resY = dy / steps;

			for(var i = 1; i < steps; i++) {
				this.context.lineTo(this.x + resX * i + Math.random() * this.shake - this.shake / 2,
									this.y + resY * i + Math.random() * this.shake - this.shake / 2);
			}
			this.context.lineTo(toX, toY);
			this._setXY(toX, toY);
		},

		arc: function(x, y, r, start, end) {
			while(end < start) end += Math.PI * 2;

			this.moveTo(x + Math.cos(start) * r,
						y + Math.sin(start) * r);
			var slice = Math.PI * 2 / Math.floor(r * Math.PI * 2 / this.segSize);

			for(var angle = start + slice; angle < end; angle += slice) {
				this.context.lineTo(x + Math.cos(angle) * r + Math.random() * this.shake - this.shake / 2,
									y + Math.sin(angle) * r + Math.random() * this.shake - this.shake / 2);
			}
			this._setXY(x + Math.cos(end) * r + Math.random() * this.shake - this.shake / 2,
					   y + Math.sin(end) * r + Math.random() * this.shake - this.shake / 2);
			this.context.lineTo(this.x, this.y);
		},

		circle: function(x, y, r) {
			var slice = Math.PI * 2 / Math.floor(r * Math.PI * 2 / this.segSize);
			this.arc(x, y, r, 0, Math.PI * 2 - slice);
			this._setXY(this.prevX, this.prevY);
			this.context.lineTo(this.x, this.y);
		},

		fillCircle: function(x, y, r) {
			this.beginPath();
			this.circle(x, y, r);
			this.fill();
		},

		strokeCircle: function(x, y, r) {
			this.beginPath();
			this.circle(x, y, r);
			this.stroke();
		},

		ellipse: function(x, y, xr, yr) {
			this.moveTo(x + xr, y);
			var slice = Math.PI * 2 / Math.floor((xr + yr) / 2 * Math.PI * 2 / this.segSize);

			for(var angle = slice; angle < Math.PI * 2 - slice; angle += slice) {
				this.context.lineTo(x + Math.cos(angle) * xr + Math.random() * this.shake - this.shake / 2,
									y + Math.sin(angle) * yr + Math.random() * this.shake - this.shake / 2);
			}
			this.context.lineTo(this.x, this.y);

		},

		fillEllipse: function(x, y, xr, yr) {
			this.beginPath();
			this.ellipse(x, y, xr, yr);
			this.fill();
		},

		strokeEllipse: function(x, y, xr, yr) {
			this.beginPath();
			this.ellipse(x, y, xr, yr);
			this.stroke();
		},

		bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
			var x0 = this.x,
				y0 = this.y,
				distance = this._distance(x0, y0, x1, y1) + this._distance(x1, y1, x2, y2) + this._distance(x2, y2, x3, y3),
				res = this.segSize / distance;

			for(var t = 0; t < 1; t += res) {
				this.context.lineTo(Math.pow(1 - t, 3) * x0 + 
										3 * Math.pow(1 - t, 2) * t * x1 + 
										3 * (1 - t) * t * t * x2 + 
										t * t * t * x3 + 
										Math.random() * this.shake - this.shake / 2,
									Math.pow(1 - t, 3) * y0 + 
										3 * Math.pow(1 - t, 2) * t * y1 + 
										3 * (1 - t) * t * t * y2 + 
										t * t * t * y3 + 
										Math.random() * this.shake - this.shake / 2);
			}
			this._setXY(x3 + Math.random() * this.shake - this.shake / 2, 
					   y3 + Math.random() * this.shake - this.shake / 2);
			this.context.lineTo(this.x, this.y);
		},

		quadraticCurveTo: function(x1, y1, x2, y2) {
			var x0 = this.x,
				y0 = this.y,
				distance = this._distance(x0, y0, x1, y1) + this._distance(x1, y1, x2, y2),
				res = this.segSize / distance;

			for(var t = 0; t < 1; t += res) {
				this.context.lineTo(Math.pow(1 - t, 2) * x0 + 2 * (1 - t) * t * x1 + t * t * x2 + Math.random() * this.shake - this.shake / 2,
									Math.pow(1 - t, 2) * y0 + 2 * (1 - t) * t * y1 + t * t * y2 + Math.random() * this.shake - this.shake / 2);
			}
			this._setXY(x2 + Math.random() * this.shake - this.shake / 2, 
					   y2 + Math.random() * this.shake - this.shake / 2);
			this.context.lineTo(this.x, this.y);
		},

		_distance: function(x0, y0, x1, y1) {
			var dx = x1 - x0,
				dy = y1 - y0;
			return Math.sqrt(dx * dx + dy * dy);
		},

		_setXY: function(x, y) {
			this.prevX = this.x;
			this.prevY = this.y;
			this.x = x;
			this.y = y;
		}

	}
	
	if (typeof define === "function" && define.amd) {
	    define(shaky);
	} else {
	   window.shaky = shaky;
	}

}());
