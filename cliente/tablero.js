function Tablero(size) {
	this.size = size;
	this.nombreBarco;
	this.placingOnGrid = false;
	this.flota;

	this.mostrar = function (si) {
		let x = document.getElementById("tablero");
		if (si) {
			x.style.display = "block";
		}
		else {
			x.style.display = "none";
		}
	}

	this.ini = function () {
		var humanCells = document.querySelector('.human-player').childNodes;
		for (var k = 0; k < humanCells.length; k++) {
			humanCells[k].self = this;
			humanCells[k].addEventListener('click', this.placementListener, false);
		}
		var computerCells = document.querySelector('.computer-player').childNodes;
		for (var j = 0; j < computerCells.length; j++) {
			computerCells[j].self = this;
			computerCells[j].addEventListener('click', this.shootListener, false);
		}
	}
	this.asignarFlotaListener = function () {
		var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
		for (var i = 0; i < playerRoster.length; i++) {
			playerRoster[i].self = this;
			playerRoster[i].addEventListener('click', this.rosterListener, false);
		}
	}
	this.placementListener = function (e) {
		self = e.target.self;
		if (self.placingOnGrid) {
			var x = parseInt(e.target.getAttribute('data-x'), 10);
			var y = parseInt(e.target.getAttribute('data-y'), 10);

			self.colocarBarco(x, y, self.nombreBarco);
		}
	};
	this.endPlacing = function (shipType) {
		document.getElementById(shipType).setAttribute('class', 'placed');
		self.placingOnGrid = false;
	}
	this.rosterListener = function (e) {
		var self = e.target.self;
		var cli = this;
		var roster = document.querySelectorAll('.fleet-roster li');
		for (var i = 0; i < roster.length; i++) {
			var classes = roster[i].getAttribute('class') || '';
			classes = classes.replace('placing', '');
			roster[i].setAttribute('class', classes);
		}

		self.nombreBarco = e.target.getAttribute('id');
		document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
		self.placingOnGrid = true;
	};

	this.colocarBarco = function (x, y, nombre) {
		console.log("Colocar barco: " + x + "-" + y + " " + nombre);
		cws.colocarBarco(nombre, x, y);
	}

	this.terminarDeColocarBarco = function (barco, x, y) {
		if (barco.orientacion.nombre== 'horizontal') {
			for (i = 0; i < barco.tam; i++) {
				console.log("x: " + (x + i) + " y:" + y);
				this.updateCell(x + i, y, "ship", 'human-player');
			}
		} else if (barco.orientacion.nombre == 'vertical') {
			for (i = 0; i < barco.tam; i++) {
				console.log("x: " + x + " y:" + (i + y));
				this.updateCell(x, i + y, "ship", 'human-player');
			}
		}
		
		self.endPlacing(barco.nombre);
	}

	this.shootListener = function (e) {
		var x = parseInt(e.target.getAttribute('data-x'), 10);
		var y = parseInt(e.target.getAttribute('data-y'), 10);
		console.log("disparo x: " + x + " y: " + y);
		cws.disparar(x, y);
	}
	this.updateCell = function (x, y, type, target) {
		var player = target;
		var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
		document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
	};

	this.createGrid = function () {
		var gridDiv = document.querySelectorAll('.grid');

		for (var grid = 0; grid < gridDiv.length; grid++) {
			let myNode = gridDiv[grid];
			while (myNode.lastElementChild) {
				myNode.removeChild(myNode.lastElementChild);
			}
			for (var i = 0; i < this.size; i++) {
				for (var j = 0; j < this.size; j++) {
					var el = document.createElement('div');
					el.setAttribute('data-x', j);
					el.setAttribute('data-y', i);
					el.setAttribute('class', 'grid-cell grid-cell-' + j + '-' + i);
					gridDiv[grid].appendChild(el);
				}
			}
		}
		this.ini();
	};
	this.elementosGrid = function () {
		$('#gc').remove();
		let cadena = '<div class="game-container" id="gc">';
		cadena = cadena + '<div id="roster-sidebar">';
		cadena = cadena + '<h4>Barcos</h4><button class="btn btn-warning btn-sm" id="btnAyuda">Ayuda</button><div id="flota"></div></div><div class="grid-container"><h2>Tu flota</h2>';
		cadena = cadena + '<div class="grid human-player"></div></div><div class="grid-container">';
		cadena = cadena + '<h2>Flota enemiga</h2><div class="grid computer-player"></div></div>'
		cadena = cadena + '<div></div></div>';
		$('#ancla').append(cadena);
		this.createGrid();

		$("#btnAyuda").on("click", function () {
			iu.mostrarModal('<img src="cliente/img/ayuda.png"')
		})
	}

	this.mostrarFlota = function () {
		$("#listaF").remove();
		let cadena = '<ul class="fleet-roster" id="listaF">';
		for (let key in this.flota) {
			cadena = cadena + "<li id='" + key + "'>" + key + "</li>"
		}
		cadena = cadena + "</ul>";
		cadena = cadena + "<button class='btn btn-primary' id='btnRotar'>Horizontal</button>"
		$('#flota').append(cadena);

		$("#btnRotar").on("click", function () {
			const btnRotar = document.getElementById('btnRotar')
			orientacion = btnRotar.innerText
			
			if (orientacion == 'Horizontal') {
				btnRotar.innerText = 'Vertical'
				self.orientacion = 'vertical'
			} else if (orientacion == 'Vertical') {
				btnRotar.innerText = 'Horizontal'
				self.orientacion = 'horizontal'
			}
		})
		this.asignarFlotaListener();
	}
}