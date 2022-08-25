const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const winnerEl = document.querySelector('#winner')
const winEl = document.querySelector('#wins')
const startGameBtn = document.querySelector('#startGame')
const modalEl = document.querySelector('#modalEl')

class Player {
    constructor(x, y, radius, color, velocity_x, velocity_y){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity_x = velocity_x
        this.velocity_y = velocity_y
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x += this.velocity_x
        this.y += this.velocity_y

        if(this.y + this.radius + this.velocity_y>=canvas.height||
            (this.y - this.radius + this.velocity_y<=0)){
            this.y -= this.velocity_y
        }

        this.velocity_y += 0.01

        if((this.x + this.radius + this.velocity_x>=canvas.width)||
         (this.x - this.radius + this.velocity_x<=0)){
            this.x -= this.velocity_x
        }
    }
}

class bullet {
    constructor(x, y, radius, color, velocity_x, velocity_y){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity_x = velocity_x
        this.velocity_y = velocity_y
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x += this.velocity_x
        this.y += this.velocity_y
    }
}

//playerone array
//playertwo array

const x1 = canvas.width / 4
const x2 = (canvas.width / 4)*3
const y = canvas.height / 2

let playerOne = new Player(x1, y, 30, 'blue', 0, 0)
let playerTwo = new Player(x2, y, 30, 'red', 0, 0)

let bulletOne = []
let bulletTwo = []

function init(){
    playerOne = new Player(x1, y, 30, 'blue', 0, 0)
    playerTwo = new Player(x2, y, 30, 'red', 0, 0)

    bulletOne = []
    bulletTwo = []
}

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    left: {
        pressed: false
    },
    right: {
        pressed: false
    },
    up: {
        pressed: false
    },
    space: {
        pressed: false
    },
    enter: {
        pressed: false
    }
}

let prev = false
let now = false
let pre = false
let no = false

let animationId
function animate() {
    animationId = window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    now = keys.space.pressed
    no = keys.enter.pressed
    
    playerOne.velocity_x = 0;
    playerTwo.velocity_x = 0;

    if(keys.a.pressed){
        playerOne.velocity_x = -1
    }
    if(keys.d.pressed){
        playerOne.velocity_x = 1
    }
    if(keys.w.pressed){
        playerOne.velocity_y = -1
    }

    if(keys.left.pressed){
        playerTwo.velocity_x = -1
    }
    if(keys.right.pressed){
        playerTwo.velocity_x = 1
    }
    if(keys.up.pressed){
        playerTwo.velocity_y = -1
    }

    if(now && (now!=prev)){

        const dirone = Math.atan2(playerTwo.y - playerOne.y, 
            playerTwo.x - playerOne.x)

        bulletOne.push(new bullet(playerOne.x, playerOne.y, 3, 
            playerOne.color, Math.cos(dirone)*5, Math.sin(dirone)*5))

    }
    if(no && (no!=pre)){
        const dirtwo = Math.atan2(playerOne.y - playerTwo.y, 
            playerOne.x - playerTwo.x)

        bulletTwo.push(new bullet(playerTwo.x, playerTwo.y, 3,
            playerTwo.color,  Math.cos(dirtwo)*5, Math.sin(dirtwo)*5))

    }
    

    bulletOne.forEach((bullet, index) => {

        const disOne = Math.hypot(playerTwo.x - bullet.x, playerTwo.y - bullet.y)
        updateOne = true

        if(disOne - playerTwo.radius - bullet.radius < 1){
            updateOne = false
        }
        /*
        if((((bullet.x)>=(playerTwo.x-playerTwo.radius))&&
        ((bullet.x)<=(playerTwo.x+playerTwo.radius)))){

            if((((bullet.y)>=(playerTwo.y-playerTwo.radius))&&
            ((bullet.y)<=(playerTwo.y+playerTwo.radius)))){
                
                updateOne = false;

            }

        } 
        */
        if(updateOne){
            bullet.update()
        }else{
            bulletOne.splice(index,1)
            playerTwo.radius -= 5

            if(playerTwo.radius<=2){
                cancelAnimationFrame(animationId)
                //modalEl.style.backgroundColor = 'blue'
                modalEl.style.display = 'block'
                winnerEl.innerHTML = 'Player BLUE'
                winnerEl.style.color = 'blue'
                winEl.style.color = 'white'
            }
        }
    })

    bulletTwo.forEach((bullet, index) => { 
        
        const disTwo = Math.hypot(playerOne.x - bullet.x, playerOne.y - bullet.y)
        updateTwo = true
        //hit from left
        if(disTwo - playerOne.radius - bullet.radius < 1){
            updateTwo = false
        }
        /*
        if((((bullet.x)>=(playerOne.x-playerOne.radius))&&
        ((bullet.x)<=(playerOne.x+playerOne.radius)))){

            if((((bullet.y)>=(playerOne.y-playerOne.radius))&&
            ((bullet.y)<=(playerOne.y+playerOne.radius)))){
                
                updateTwo = false;

            }

        }
        */
        if(updateTwo){
            bullet.update()
        }else{
            bulletTwo.splice(index,1)
            playerOne.radius -= 5
            if(playerOne.radius<=2){
                cancelAnimationFrame(animationId)
                //modalEl.style.backgroundColor = 'red'
                modalEl.style.display = 'block'
                winnerEl.innerHTML = 'Player RED'
                winnerEl.style.color = 'red'
                winEl.style.color = 'white'
            }
        }
    })

    playerOne.update()
    playerTwo.update()

    prev = now
    pre = no
}

//restart the game
startGameBtn.addEventListener('click', (event)=>{
    init()
    animate()
    modalEl.style.display = 'none'
})

window.addEventListener('keydown', (event)=>{
    switch (event.key){
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            keys.w.pressed = true
            break
        case 'ArrowLeft':
            keys.left.pressed = true
            break
        case 'ArrowRight':
            keys.right.pressed = true
            break
        case 'ArrowUp':
            keys.up.pressed = true
            breakx
        case ' ':
            keys.space.pressed = true
            break
        case 'Enter':
            keys.enter.pressed = true
            break
    }
})

window.addEventListener('keyup', (event)=>{
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 'ArrowLeft':
            keys.left.pressed = false
            break
        case 'ArrowRight':
            keys.right.pressed = false
            break
        case 'ArrowUp':
            keys.up.pressed = false
            break
        case ' ':
            keys.space.pressed = false
            break
        case 'Enter':
            keys.enter.pressed = false
            break
    }
})


