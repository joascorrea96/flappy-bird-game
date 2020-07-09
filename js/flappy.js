/* função que cria um novo elemento, passando
sua tag e classe html */
function novoElemento(tagName, className) {
    /* Cria um novo elemento html e atribui a 'elem' */
    const elem = document.createElement(tagName)
    /* atribui uma classe ao 'elem' */
    elem.className = className

    return elem
}


/* função construtora que define as características da 
barreira */
function Barreira(reversa = false) {
    /* invoca função 'novoElemento' passando
    um elemento 'div' e uma classe 'barreira'.*/ 
    this.elemento = novoElemento('div', 'barreira')

    /* cria um elemento 'div' e a classe 'borda' 
    e atribui a uma constante*/
    const borda = novoElemento('div', 'borda')
    
    const corpo = novoElemento('div', 'corpo') 

    /* irá adicionar um elemento filho em 'elemento'.
    Se for uma barreira reversa, irá adicionar o elemento
    'corpo', se não, adiciona o elemento 'borda' */
    this.elemento.appendChild(reversa ? corpo : borda)

    /* Caso a barreira for reversa, 'borda' é adicionado,
    se não, 'corpo' é adicionado. */
    this.elemento.appendChild(reversa ? borda : corpo)

    /* determina a altura do elemento 'corpo' */
    this.setAltura = altura => corpo.style.height = `${altura}px`
}


/* Determina as caracteriscas das duas barreiras. Passando
como parâmetro a altura, o espaço entre elas, e sua posição.*/
function ParDeBarreiras(altura, abertura, x) {
    /* Cria e atribui um novo elemento 'div' contendo a
    classe 'par-de-barreiras'*/
    this.elemento = novoElemento('div', 'par-de-barreiras')

    /* Instancia a função 'barreira'(superior) definindo o 
    parametro 'reverse' como true */
    this.superior = new Barreira(true)

    // instancia a barreira inferior como 'reverse = false' 
    this.inferior = new Barreira(false)

    /* Adiciona o elemento 'superior'(barreira) na div
    'elemento'(par-de-barreiras). */
    this.elemento.appendChild(this.superior.elemento)

    // Adiciona na div 'elemento', a barreira infeior
    this.elemento.appendChild(this.inferior.elemento)

    // sorteia a altura das barreiras
    this.sortearAbertura = () => {
        // gera um cálculo aleatório para a barreira superior e inferior
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior

        // define a altura de ambas as barreiras
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    /* tem a finalidade de acessar a posição da barreira */
    // 'split('px')[0]' busca o valor numérico da posição
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    
    // irá setar a posição da barreira
    this.setX = x => this.elemento.style.left = `${x}px`
    
    // acessará a largura da barreira
    this.getLargura = () => this.elemento.clientWidth

    // sorteará o espaço entre os elementos
    this.sortearAbertura()

    // setará a posição da barreira. Passando a posição.
    this.setX(x)

}

/* Função construtora que tem como parâmetros
a altura das barreiras, largura, o espaço entre o meio delas, 
e o espaço entre os lados. */
/* 'notificarPonto', irá servir para contabilizar um ponto
no jogo quando uma barreira cruzar o centro da tela */

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        /* Serão criadas quatro barreiras, onde será passado
        para a função construtora a altura, abertura, e largura
        de cada uma. */
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    /* Valor em 'px' do deslocamento das barreiras */
    const deslocamento = 3

    /* terá a finalidade de deslocar as barreiras */
    this.animar = () => {
        // percorre o array de barreiras
        this.pares.forEach(par => {
            // calcula o deslocamento das barreiras
            par.setX(par.getX() - deslocamento)

            // quando o elemento sair da área do jogo
            if(par.getX() < -par.getLargura()) {
                // o elemento é 'lançado' para o final da área
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            // 'meio' recebe a posição central da página
            const meio = largura / 2

            /* verifica se a barreira cruzou o meio da área
            se cruzou, será atribuido a constante */
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            
            /* se 'cruzouOMeio == true', o usuário será
            notificado com novo ponto */
            cruzouOMeio && notificarPonto()
        })
    }
}

/* função que lidará com o elemento que representa
o 'pássaro'. Terá como parametro a altura da área */
function Passaro(alturaJogo) {
    // determina que o pássaro nao estará voando ainda
    let voando = false

    // cria um novo elemento html do tipo 'img' com a classe 'passaro'
    this.elemento = novoElemento('img', 'passaro')

    // define o diretório 'src' do elemento 'img'
    this.elemento.src = 'imgs/passaro.png'

    // acessará a posição css 'bottom' do elemento 
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    
    // setará a posição css 'bottom' do elemento
    this.setY = y => this.elemento.style.bottom = `${y}px`

    // quando qualquer tecla for pressionada, 'voando' receberá true
    window.onkeydown = e => voando = true

    // ao soltar a tecla pressionada, 'voando' receberá false
    window.onkeyup = e => voando = false

    this.animar = () => {
        /* se 'voando == true', 'novoY' recebe a soma de
        'this.getY()' + '8', se não, a soma será com '-5' */
        const novoY = this.getY() + (voando ? 8 : -5)

        // calcula a altura máxima que o passáro poderá atingir
        const alturaMaxima = alturaJogo - this.elemento.clientHeight
        
        // se altura do elemento for menor ou igual a '0'..
        if (novoY <= 0) {
            //setará o elemento com altura '0'
            this.setY(0)
        // se altura do elemento for maior ou igual a 'alturaMaxima'..
        } else if (novoY >= alturaMaxima) {
            //setará o elemento com altura 'alturaMaxima'
            this.setY(alturaMaxima)
        // caso contrário..
        } else {
            // setará o elemento com a nova altura definida
            this.setY(novoY)
        }
    }

    // setará a altura inicial do elemento(passaro)
    this.setY(alturaJogo / 2)
}

// const barreiras = new Barreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')

// areaDoJogo.appendChild(passaro.elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)



// função construtora
function Progresso() {
    // criará um novo elemento do tipo 'span' com classe 'progresso'
    this.elemento = novoElemento('span', 'progresso')

    // atualizará os pontos na tela do usuário
    this.atualizarPontos = pontos => {
        // atribui ao corpo de 'elemento' os pontos.
        this.elemento.innerHTML = pontos
    }
    // define a pontuação inicial como '0'
    this.atualizarPontos(0)
}

// verifica se 'elemntoA' está enconstando em 'elementoB'
function estaoSobrepostos(elementoA, elementoB) {
    /* O método passado retorna o tamanho de seu elemento
    e sua posição relativa ao 'viewport' */
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    /* left + width representa a altura do primeiro elemento, 
    e será verificado se esse valor é maior ou
    igual o comprimento do segundo elemento, se for, os 
    elementos estão se colidindo*/
    const horizontal = a.left + a.width >= b.left 
        && b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return horizontal && vertical
}

// será invocada quando houver a colisão entre os parâmetros
function colidiu(passaro, barreiras) {
    // colisão se iniciará com false
    let colidiu = false

    // percorrerá a lista de pares de barreiras
    barreiras.pares.forEach(parDeBarreiras => {
        // se não tiver colidido..
        if(!colidiu) {
            // será atribuido a barreira superior atual
            const superior = parDeBarreiras.superior.elemento

            // será atribuido a barreira inferior atual
            const inferior = parDeBarreiras.inferior.elemento

            // verifica a colisão superior ou inferior, e a atribuir a constante
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function FlappyBird() {
    let pontos = 0

    // atribui a constante o elemento passado.
    const areaDoJogo = document.querySelector('[wm-flappy]')

    // atribui a constante a altura de 'areaDoJogo'
    const altura = areaDoJogo.clientHeight

    // atribui a constante a largura de 'areaDoJogo'
    const largura = areaDoJogo.clientWidth

    // instancia a função 'Progresso()'
    const progresso = new Progresso()

    // instancia a função 'Barreiras()' passando seus parâmetros
    const barreiras = new Barreiras(altura, largura, 200, 400, 
        () => progresso.atualizarPontos(++pontos)) /* invoca a função
        'atualizarPontos' passando uma nova pontuação */
        
        // instancia a função 'Passaro' passando a altura.
        const passaro = new Passaro(altura)
        
        // adiciona um elemento filho 'progresso' em 'areaDoJogo'
        areaDoJogo.appendChild(progresso.elemento)
        
        // adiciona 'passaro' como elemento filho 
        areaDoJogo.appendChild(passaro.elemento)

        /* adiciona em 'areaDoJogo' cada pares de 
        barreiras */
        barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

        // iniciará o jogo
        this.start = () => {
            // loop do jogo
            const temporizador = setInterval(() => {
                // fará os elementos se mecherem
                barreiras.animar()
                passaro.animar()

                // se tiver colidido os parâmetros..
                if(colidiu(passaro, barreiras)) {
                    // Interval será interrompido
                    clearInterval(temporizador)
                }
        }, 20)
    }
}

new FlappyBird().start()

    