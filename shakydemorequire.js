require(["shaky"], function(shaky) {
	var s = shaky.create("canvas");
	s.setSize(window.innerWidth, window.innerHeight);

	// squares();
	// lines();
	// anim();
	// arc();
	// circle();
	// ellipse();
	// quadratic();
	// bezier();
	// segSizeShake();
	hatch();


	function squares() {
		for(var x = 10; x < s.width - 50; x += 60) {
			for(var y = 10; y < s.height - 50; y += 60) {
				s.strokeRect(x, y, 50, 50);
			}
		}
	}

	function lines() {
		s.beginPath();
		for(var y = 0; y < s.height; y += 20) {
			s.moveTo(20, y);
			s.lineTo(s.width - 20, y);
		}
		s.stroke();
	}

	function segSizeShake() {
		for(x = 6; x < s.width; x += 50)
		for(var y = 6; y < s.height; y += 50) {
			s.shake = x * .01;
			s.segSize = (s.height - y) * .01 + 1;
			s.strokeRect(x, y, 45, 45);
		}
	}

	function anim() {
		s.segSize = 10;
		s.shake = 5;
		animate();
		function animate() {
			s.clear();
			s.strokeRect(s.width / 2 - 50, s.height / 2 - 50, 100, 100);
			requestAnimationFrame(animate);
		}
	}

	function arc() {
		for(var x = 100; x < s.width - 50; x += 100) {
			for(var y = 100; y < s.height - 50; y += 100) {
				s.beginPath();
				s.arc(x, y, 40, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, false);
				s.stroke();
			}
		}
	}

	function circle() {
		s.segSize = 20;
		s.segSize = 10;
		s.shake = 5;
		for(var x = 100; x < s.width - 50; x += 100) {
			for(var y = 100; y < s.height - 50; y += 100) {
				s.strokeCircle(x, y, 40);
			}
		}
	}

	function ellipse() {
		s.segSize = 20;
		s.segSize = 10;
		s.shake = 5;
		for(var x = 100; x < s.width - 50; x += 100) {
			for(var y = 100; y < s.height - 50; y += 100) {
				s.strokeEllipse(x, y, Math.random() * 50 + 10, Math.random() * 50 + 10);
			}
		}
	}

	function quadratic() {
		document.body.addEventListener("mousemove", function(event) {
			s.clear();
			s.beginPath();
			s.moveTo(0, s.height / 2);
			s.quadraticCurveTo(event.clientX, event.clientY, s.width, s.height / 2);
			s.stroke();
		});
	}

	function bezier() {
		document.body.addEventListener("mousemove", function(event) {
			s.clear();
			s.beginPath();
			s.moveTo(0, s.height / 2);
			s.bezierCurveTo(event.clientX, event.clientY,
							s.width - event.clientX, s.height - event.clientY,
							s.width, s.height / 2);
			s.stroke();

		});
	}

	function hatch() {
		s.segSize = 10;
		s.shake = 0;
		var res = 100,
			div = res / 20
		for(var i = 0; i < s.width; i += res) {
			for(var j = 0; j < s.height; j += res) {
				s.beginPath();
				for(var y = j + div; y <= j + res / 2 - div; y += div) {
					s.moveTo(i - div, y);
					s.lineTo(i + res / 2 + div, y);
				}
				for(var x = i + res / 2 + div; x <= i + res - div; x += div) {
					s.moveTo(x, j - div);
					s.lineTo(x, j + res / 2 + div);
				}
				for(var y = j + res / 2 + div; y <= j + res - div; y += div) {
					s.moveTo(i + res / 2 - div, y);
					s.lineTo(i + res + div, y);
				}
				for(var x = i + div; x <= i + res / 2 - div; x += div) {
					s.moveTo(x, j + res / 2 - div);
					s.lineTo(x, j + res + div);
				}
				s.stroke();
				s.shake += .03;
			}
		}
	}
});