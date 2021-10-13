  const listaProductos = document.querySelector("#lista-carrito tbody")
  const totalCompra = document.getElementById("total")

  let carrito = [];
  if (localStorage.carrito != null) {
    carrito = JSON.parse(localStorage.carrito);
    carrito.forEach((carrito, index) => {
    const row = document.createElement('tr')
    row.innerHTML += `
    <td> <img src="${carrito.img}" width=50 </td>
    <td>${carrito.nombre}</td>
    <td>$${carrito.precio}</td>
    <td> <a href="#" onclick="quitarCurso()" class="borrar-producto fas fa-times-circle m-3 " data-id="${carrito.id}" </a> </td>`
    listaProductos.appendChild(row)
 });
    document.getElementById("contador").innerHTML = carrito.length
    suma()


  }

/***Constructor Clase***/
  class Curso {
    constructor(img, nombre, nivel, duracion, precio, id) {
    this.img = img,
    this.nombre = nombre,
    this.nivel = nivel;
    this.duracion = duracion,
    this.precio = precio;
    this.id = id;
    }
  }

  const cursos = []
  cursos.push(new Curso("./img/IMG_3645.jpg", "ABC de Pastelería", "Nivel inicial", "3 meses", 2400, 1));
  cursos.push(new Curso("./img/IMG_3646.jpg", "Masas y Rellenos", "Nivel medio", "3 mes", 2200, 2))
  cursos.push(new Curso("./img/IMG_3648.jpg", "Decoración de Tortas", "Nivel medio", "1 mes", 1200, 3))
  cursos.push(new Curso("./img/macarron1.jpg", "Macarons", "Nivel avanzado", "1 mes", 1200, 4))

/***Genero las Cards***/
  let mostrar = document.createElement("div")
  mostrar.setAttribute("class", "row mb-5")
  cursos.forEach(curso => {
    mostrar.innerHTML += `<div class="col-lg-3 col-sm-12 col-12" >
    <div class="card" onmouseover="bigImg(this)" onmouseout="normalImg(this)">
    <img src="${curso.img}" class="card-img-top"   loading="lazy" >
    <div class="card-body text-center" >
    <h5 class="card-title" id="${curso.nombre}">${curso.nombre}</h5>
    <p class="card-text">${curso.nivel}</p>
    <p>Duración ${curso.duracion}</p>
    <a href="#" onclick="agregarCarro('${curso.nombre }')" class="btn btn-primary" >$${curso.precio}</a>
    </div>
    </div>
    </div>`

  })
  const post = document.getElementById("cardJs")
  post.appendChild(mostrar)


/***Agregar productos al carrito***/
  function mostrarItemns(nuevoCurso) {
    let carritoIndex = carrito.length - 1
    const row = document.createElement('tr')
    row.innerHTML = `
    <td> <img src="${nuevoCurso.img}" width=50 </td>
    <td>${nuevoCurso.nombre}</td>
    <td>$${nuevoCurso.precio}</td>
    <td> <a href="#" onclick="quitarCurso(${carritoIndex})" class="borrar-producto fas fa-times-circle m-3 " data-id="${carritoIndex}" </a> </td> `
    listaProductos.appendChild(row)
    localStorage.carrito = JSON.stringify(carrito);

  }

  function agregarCarro(nombre) {
    const añadido = cursos.find(curso => curso.nombre === nombre)
    carrito.push(añadido)
    mostrarItemns(añadido)
    document.getElementById("contador").innerHTML = carrito.length
    suma()
}

/***Elimino productos del carrito***/


function quitarCurso(miIndx) {
    carrito.splice(miIndx, 1)
    $("#listaCurso").empty()
    carrito.forEach(curso => mostrarItemns(curso))
    document.getElementById("contador").innerHTML = carrito.length
    if(carrito.length == 0){
    localStorage.removeItem('carrito');
    }
    suma()
  }

  function suma(){
   const suma = carrito.reduce((a,b)=>  a += b.precio,0)
   totalCompra.innerHTML = '$' + suma ;

  }

  
/***Animación de las Cards***/

  function bigImg(x) {
    x.style.height = "105%";
    x.style.width = "105%";
    x.transition = "0.1s";
  }

  function normalImg(x) {
    x.style.height = "100%";
    x.style.width = "100%";
  }


/***Botón comprar***/
  $("#boton").prepend('<button id="btnCompra" type="button" class="btn btn-success" >Comprar</button>');
  $("#btnCompra").click(function() {
    pagar()

  })


/***Genero botón vaciar carrito con JQuery***/
  $("#boton").prepend('<button id="btnVaciar" type="button" class="btn btn-danger" >Vaciar Carrito</button>');

  $("#btnVaciar").click(function() {
    carrito.splice(0, carrito.length)
    $("#contador").html(carrito.length)
    $("#listaCurso").empty()
    suma()
    localStorage.removeItem('carrito');

  })

/***Declaración de métodos encadenados***/
  $("#titulo").css("color", "red")
    .delay(400)
    .slideUp(800)
    .delay(100)
    .animate({
    opacity: "0.8"

    }, "slow",
    () => {
     $("#titulo").text(" Cursos y Talleres")
    .css({
    'color': 'black',
    'font-size': '40px',
    'font-family': 'roboto',
    'letter-spacing': '13px'
    })
    })
    .slideDown(2000);

/***Consumo de API Mercado***/

  const pagar = () => {
    const datosDePago = carrito.map(curso => {
    return {
    "title": curso.nombre,
    "description": "",
    "picture_url": "",
    "category_id": "",
    "quantity": 1,
    "currency_id": "ARS",
    "unit_price": curso.precio,
    }
    })

 const elemento = {
    "items": datosDePago
    }


 const URLAPI = 'https://api.mercadopago.com/checkout/preferences'


    $.ajaxSetup({
    headers: {
    'Authorization': 'Bearer TEST-4669597304203976-092315-d2898d87b995fc50e14ca83e1fc2e609-657245350',
    'Content-Type': 'application/json'
    }
    })

    $.post(URLAPI, JSON.stringify(elemento), (respuesta, status) => {
    urlPago = respuesta.init_point
    window.open(`${urlPago}`);
    })

  }

/***Consumo de API Clima***/

    $.getJSON("http://api.weatherunlocked.com/api/current/ar.R8400,-0.12?app_id=dfd05d5f&app_key=4fb61c73229358a83d4ddeab1a579714",function(res){
    $("#clima").append (res.temp_c + "ºC");
    })
    $("#clima").css("color", "#a7467c","font-weight","bold","margin : 10px")