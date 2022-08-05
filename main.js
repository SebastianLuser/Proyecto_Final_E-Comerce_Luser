
//La pagina consta de una Ecomerce de venta de juegos de mesa . A futuro posibilidad de añadir a favoritos para un aviso de ofertas y sistema de suscripciones 

//TODO: Objeto productos seleccionables, Carrito de compras (productos seleccionados , cantidad de c/u y precio total actualizado con iba o descuentos , retirar objetos ), limite de productos(stock) al finalizar el cupo de productos marcar sin stock, filtro por precio y categoria y orden alfabetico
let arrayProductos = [];
const carrito = [];
let productos;
let habilitar = true;

const IVA = 1.21;
class Producto{
    constructor(productox){
        this.id=productox.id;
        this.titulo= productox.titulo;
        this.precio= productox.precio;
        this.categoria = productox.categoria;
        this.stock= productox.stock;
        this.thumbnail = productox.thumbnail;
    }
    clacularPrecio(){
        return this.precio *IVA;
    }
}

class Storage{
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProdcut(id){
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

const traerDatosBaseDeDatos = () => {
    let contador = 1;
    fetch('https://api.mercadolibre.com/sites/MLA/search?nickname=LAMADRIGUERA_CO')
    .then((response)=> response.json())
    .then((data)=>{
        productos = data.results;
        productos.forEach((producto) => {
            const productoX = new Producto ({id:contador,titulo:producto.title,precio:producto.price,thumbnail:producto.thumbnail,categoria:"Cartas",stock:10});
            arrayProductos.push(productoX);
            contador++;
        })
        Storage.saveProducts(arrayProductos);
        mostrarCards(arrayProductos);
    })
}


function mostrarCards(arrayProductos){
    const cotenedorCards = document.getElementById("contenedor-cards");
    cotenedorCards.innerHTML = "";
    arrayProductos.forEach((producto) => {
        const divCard = document.createElement("div");
        divCard.classList.add("producto");
        divCard.innerHTML = `
        <div class="col mb-5" id = "card${producto.id}">
        <div class="card h-100" style="user-select:none;">
            <!-- Product image-->
            <img class="card-img-top" src="${producto.thumbnail}" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
                <div class="text-center">
                    <!-- Product name-->
                    <h5 class="fw-bolder">${producto.titulo}</h5>
                    <!-- Product price-->
                    <input type="hidden" value="${producto.precio}" id="precioProducto-${producto.id}">
                    $${producto.precio}
                </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center"><a onclick="agregarAlCarrito(${producto.id})" class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
            </div>
        </div>
    </div>
    `;
    cotenedorCards.appendChild(divCard);
    })
}
traerDatosBaseDeDatos();

//Filtro por categoria
function filtrarPorCategoria(categoria){
    const ListadoFiltrado = arrayProductos.filter((producto)=> producto.categoria === categoria);
    mostrarCards(ListadoFiltrado);
}
function PrecioMayorMenor(){
    arrayProductos.sort((a,b)=>b.precio-a.precio);
    mostrarCards(arrayProductos);
}
function PrecioMenorMayor(){
    arrayProductos.sort((a,b)=>a.precio-b.precio);
    mostrarCards(arrayProductos);
}
function IdMayorMenor(){
    arrayProductos.sort((a,b)=>b.id-a.id);
    mostrarCards(arrayProductos);
}
function IdMenorMayor(){
    arrayProductos.sort((a,b)=>a.id-b.id);
    mostrarCards(arrayProductos);
}
function Alfabeticamente(){
    arrayProductos.sort((a,b)=>{
            if(a.titulo > b.titulo){
                return 1;
            }
            if(a.titulo < b.titulo){
                return -1;
            }
            return 0;
        })
        mostrarCards(arrayProductos);
}

let cart = [];
//AGREGA AL CARRITO LOS PRODUCTOS SELECCIONADOS
function agregarAlCarrito(pId){
    verificarStock(pId);
    if(habilitar==true){
        // const resultado = new Producto (arrayProductos.find((producto) => producto.id == id));
        //Optimizo evitando usar el producto.
        let cartItem = {...Storage.getProdcut(pId), amount: 1};
        console.log(cartItem);
        if(cart.find(item => item.id===pId)){
            cart.find(item => {
                item.id===pId;
                item.amount = item.amount +1;
            });
        }
        else{
            cart = [...cart,cartItem];
        }
        Storage.saveCart(cart);
        const resultado = new Producto (arrayProductos.find(({id}) => id == pId));
        carrito.push(resultado);
        mostrarCarrito(carrito);
    }
}

//MOSTRAR EL CARRITO CON CANTIDAD DE productoS SELECIONADOS Y PRECIO
function mostrarCarrito(carrito){
    const totalCarrito = carrito.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    let precioCarrito = document.getElementById("precioCarrito");
    precioCarrito.value = totalCarrito;
    // console.log(precioCarrito.value);
    document.getElementById('carrito-elementos').innerHTML = carrito.length + "- $" + totalCarrito;
    let getcart = [];
    getcart = Storage.getCart();
    console.log(getcart);
    addCartItem(getcart)
}

function  addCartItem(getcart){
    const cotenedorCards = document.getElementById("cart-items");
    cotenedorCards.innerHTML = "";
    getcart.forEach((producto) => {
        const divCard = document.createElement("div");
        divCard.classList.add("producto");
        divCard.innerHTML = `
        <div class="col mb-5" id = "card${producto.id}">
            <div class="card h-100" style="user-select:none;">
                <!-- Product image-->
                <img class="card-img-top" src="${producto.thumbnail}"  alt="..." />
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="fw-bolder">${producto.titulo}</h5>
                        <!-- Product price-->
                        <input type="hidden" value="${producto.precio}" id="precioProducto-${producto.id}">
                        $${producto.precio}
                    </div>
                </div>
                <div class="itemQuantity">
                    <input data-quantity="pop" type="submit" value="-">
                    <input autocomplete="off" data-quantity="input" type="tel" value="${producto.amount}">
                    <input data-quantity="push" type="submit" value="+">
                </div>
            </div>
        </div>
    `;
    cotenedorCards.appendChild(divCard);
    })
}

function clearCart(){
    cart = [];
    Storage.saveCart(cart);
    addCartItem(cart);
}


let input1 = document.getElementById("1cuota");
let input2 = document.getElementById("3cuotas");
let input3 = document.getElementById("6cuotas");
let input4 = document.getElementById("12cuotas");

input1.onchange = () => {
    let precioCarrito = parseInt(document.getElementById("precioCarrito").value);
    let precioTarifa = precioCarrito*1;
    document.getElementById('carrito-elementos').innerHTML = carrito.length + "- $" + precioTarifa;

}
input2.onchange = () => {
    let precioCarrito = parseInt(document.getElementById("precioCarrito").value);
    let precioTarifa = precioCarrito*1.2;
    document.getElementById('carrito-elementos').innerHTML = carrito.length + "- $" + precioTarifa;
    
}
input3.onchange = () => {
    let precioCarrito = parseInt(document.getElementById("precioCarrito").value);
    let precioTarifa = precioCarrito*1.5;
    document.getElementById('carrito-elementos').innerHTML = carrito.length + "- $" + precioTarifa;
    
}
input4.onchange = () => {
    let precioCarrito = parseInt(document.getElementById("precioCarrito").value);
    let precioTarifa = precioCarrito*1.8;
    document.getElementById('carrito-elementos').innerHTML = carrito.length + "- $" + precioTarifa;
}

//EVALUAR EL STOCK
function verificarStock(id){
    let hayStock = new Producto (arrayProductos.find((producto) => producto.id == id));
    arrayProductos.forEach((producto) =>{ 
        if(producto.stock>0){
            if (producto.id == hayStock.id){
                producto.stock = producto.stock -1;
                console.log("Hay "+producto.stock+" stock restante")
                habilitar=true;
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Se agrego al carrito',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }else{
            if (producto.id == hayStock.id){
                Toastify({
                    text: "No hay stock",
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "left", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
                console.log("No hay stock");
            }
            document.getElementById("card"+producto.id);
            habilitar = false;
            //Spread para crear un nuevo objeto con un sinStock
            let sinStock = arrayProductos.find(elemento => elemento.id == producto.id);
            sinStock = {...sinStock, reponer: true}
            console.log(sinStock);
        }
    });
}

//Validacion del mail
document.getElementById("user").onchange = (e) => {
    const usuario = e.target.value 
    const isUsuarioValid = validateEmail(usuario);
    const resultado = (isUsuarioValid) ? "Email Valido!" : "Email no valido";
    document.getElementById("feedback").innerHTML = resultado;
}

//Funcion externa para validar emails
function validateEmail(email){
    return String(email)
    .toLowerCase()
    .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

//Evito que el el boton de submit recargue la pagina
let miFormulario = document.getElementById("form");
miFormulario.addEventListener("submit",validarFormulario);
function validarFormulario (e){
    e.preventDefault();
    console.log("Formulario Enviado");
}

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
}
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}