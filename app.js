
var ronda = 1;

var puntos1 = 0;
var puntos2 = 0;

const span_p1 = document.getElementById("puntos-humano");
const span_p2 = document.getElementById("puntos-ia");
const div_puntuacion = document.querySelector(".puntuacion");
const div_resultado = document.querySelector(".resultado > p");

const div_piedra = document.getElementById("piedra");
const div_papel = document.getElementById("papel");
const div_tijera = document.getElementById("tijera");


var memoriaJugadasIA = [];
var memoriaResultadosIA = [];



function init () {
	
	div_piedra.addEventListener("click", function() {
		pulsa("piedra");
	});

	div_papel.addEventListener("click", function() {
		pulsa("papel");
	});

	div_tijera.addEventListener("click", function() {
		pulsa("tijera");
	});

};



function randomNum (max) {
	return Math.floor (Math.random() * max);
};



function selectRandom (pool) {
	
	return pool [randomNum (pool.length)];
	
};



function counter (id) {
	
	let counter;
	
	switch (id) {
		case "piedra": counter = "papel"; break;
		case "papel": counter = "tijera"; break;
		case "tijera": counter = "piedra"; break;
	};
	
	
	return counter;
	
};



function jugadaRandom () {
	
	let pool;
	
	if (ronda == 1) {
	 	pool = ["piedra", "papel"];
	} else {
		pool = ["piedra", "papel", "tijera"];
	};
	
	
	// Selecciono una jugada aleatoriamente
	let idRnd = selectRandom (pool);
	
	
	if (memoriaJugadasIA.length > 0) {
		
		let idMasReciente = memoriaJugadasIA [0]; // más reciente primero
		let ultimaEsVictoria = memoriaResultadosIA [0];
		
		
		
		// Detecto si lleva X jugadas iguales
		let spamDetectado = true;
		
		for (let i = 1; i <= 2;  i++) {
			
			if (idMasReciente != memoriaJugadasIA[i]) {
				spamDetectado = false;
				break;
			};
		};
		
		
		// Juego su counter
		if (spamDetectado) {
			return counter(idMasReciente);
		};
		
		
		
		/*
		// Detecto si hace piedra papel tijera
		let patronDetectado = false;
		let arr = ["tijera", "piedra", "papel"]; // invertidos
		
		
		for (let i = 0; i <= 2;  i++) {
			
			if (idMasReciente != memoriaJugadasIA[i]) {
				patronDetectado = false;
				break;
			};
		};		
		*/
		
		
		
		// Si la última jugada del jugador es victoria
		if (ultimaEsVictoria) {
			
			// Obtengo el counter de la jugada más reciente
			let counter;
			
			switch (idMasReciente) {
				case "piedra": counter = "papel"; break;
				case "papel": counter = "tijera"; break;
				case "tijera": counter = "piedra"; break;
			};
			
			
			
			if (randomNum(100) < 60) {
				idRnd = counter;
			};
			
		} else {
			
			if (idMasReciente == "piedra") {
				return "piedra";
			};
			
			
			// Seguramente no repita su jugada perdida
			let nuevaPool;
			
			
			// Creo una nueva pool con el counter y el empate
			switch (idMasReciente) {
				case "piedra": nuevaPool = ["tijera", "piedra"]; break;
				case "papel": nuevaPool = ["papel", "piedra"]; break;
				case "tijera": nuevaPool = ["papel", "tijera"]; break;
			};
			
			
			// Vuelvo a seleccionar la jugada
			if (randomNum(100) < 60) {
				idRnd = selectRandom (nuevaPool);
			};
			
			console.log ("Cambio a: " + idRnd);
			
			
		};
		
	};
	
	
	
	// return pool [idx];
	return idRnd;
	
};



function resuelveJugada (jugada1, jugada2) {
	// Devuelve TRUE si la jugada1 es la ganadora.
	
	let resultado = 0; // 0 pierde, 1 gana, 2 empata
	
	
	if (jugada1 == jugada2) {
		
		resultado = 2;
		
	} else if (jugada1 == "piedra") {
		
		if (jugada2 == "tijera") {
			resultado = 1;
		};
		
	} else if (jugada1 == "papel") {
		
		if (jugada2 == "piedra") {
			resultado = 1;
		};
		
	} else if (jugada1 == "tijera") {
		
		if (jugada2 == "papel") {
			resultado = 1;
		};
		
	};
	
	
	return resultado;
	
};



function pulsa (id) {
	
	// Resuelvo jugada
	let rnd = jugadaRandom();
	let res = resuelveJugada (id, rnd);
	
	
	// Añadimos cosas a la memoria de la IA
	addMemoriaIA (id, res == 1);
	
	
	// Construyo texto
	let str1 = '<img class="imgMini" src="img/' + id + '.png" alt="">';
	let str2 = "";
	let str3 = '<img class="imgMini" src="img/' + rnd + '.png" alt="">';
	
	switch (res) {
		case 0: {str2 = "<font color='red'>pierde contra</font>"}; break;
		case 1: {str2 = "<font color='green'>gana contra</font>"}; break;
		case 2: {str2 = "empata contra"}; break;
	};
	
	
	// Actualizo resultado
	div_resultado.innerHTML = str1 + str2 + str3;
	
	
	// Actualizo puntos
	if (res == 0) {
		puntos2 ++;
	} else if (res == 1) {
		puntos1 ++;
	};
	
	span_p1.innerHTML = puntos1;
	span_p2.innerHTML = puntos2;
	
	
	// Ilumino lo pulsado según resultado
	let claseBrillo = "";
	
	switch (res) {
		case 0: claseBrillo = "brillo-rojo"; break;
		case 1: claseBrillo = "brillo-verde"; break;
		case 2: claseBrillo = "brillo-blanco"; break;
	};
	
	
	document.getElementById(id).classList.add(claseBrillo);
	setTimeout(function() { document.getElementById(id).classList.remove(claseBrillo); }, 1000);
	
	
};



function addMemoriaIA (id, esVictoria) {
	
	memoriaJugadasIA.unshift(id);
	memoriaResultadosIA.unshift(esVictoria);
	
	
	// Limito a X elementos
	if (memoriaJugadasIA.length > 15) {
		memoriaJugadasIA.length = 15;
	};
	
	if (memoriaResultadosIA.length > 15) {
		memoriaResultadosIA.length = 15;
	};	
	
};



init ();