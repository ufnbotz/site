(function () {
  "use strict";

  /**
   * Função select para simplificar a seleção de elementos DOM.
   * @param {string} el - O elemento a ser selecionado.
   * @param {boolean} all - Se true, seleciona todos os elementos correspondentes. Caso contrário, seleciona o primeiro.
   * @returns {Element} - O elemento(s) selecionado(s).
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Função para simplificar a adição de ouvintes de eventos.
   * @param {string} type - O tipo de evento.
   * @param {string} el - O elemento ao qual o ouvinte será adicionado.
   * @param {function} listener - A função a ser chamada quando o evento ocorrer.
   * @param {boolean} all - Se true, adiciona o ouvinte a todos os elementos correspondentes. Caso contrário, adiciona ao primeiro.
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Função para simplificar a adição de ouvintes de eventos de rolagem.
   * @param {Element} el - O elemento ao qual o ouvinte será adicionado.
   * @param {function} listener - A função a ser chamada quando o evento de rolagem ocorrer.
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Ativa o link do navbar correspondente à seção atual na página.
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 500
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scroll suave para elementos com uma classe .scrollto.
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Mantém o cabeçalho fixo no topo da página ao rolar.
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop
    let nextElement = selectHeader.nextElementSibling
    const headerFixed = () => {
      if ((headerOffset - window.scrollY) <= 0) {
        selectHeader.classList.add('fixed-top')
        nextElement.classList.add('scrolled-offset')
      } else {
        selectHeader.classList.remove('fixed-top')
        nextElement.classList.remove('scrolled-offset')
      }
    }
    window.addEventListener('load', headerFixed)
    onscroll(document, headerFixed)
  }

  /**
   * Mostra ou esconde o botão "volta ao topo".
   */
  let backtotop = select('.voltar-topo')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Alterna a visualização do navbar em dispositivos móveis.
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Rolagem suave com offset ao clicar em links com a classe .scrollto.
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Rolagem suave com offset ao carregar a página com links hash na URL.
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Gerencia o slider de detalhes do projeto.
   */
  window.addEventListener('load', () => {
    let projetoContainer = select('.projeto-container');
    if (projetoContainer) {
      let projetoIsotope = new Isotope(projetoContainer, {
        itemSelector: '.projeto-item',
        layoutMode: 'fitRows'
      });

      let projetofiltros = select('#projeto-filtros li', true);

      on('click', '#projeto-filtros li', function (e) {
        e.preventDefault();
        projetofiltros.forEach(function (el) {
          el.classList.remove('filtro-ativo');
        });
        this.classList.add('filtro-ativo');

        projetoIsotope.arrange({
          filtro: this.getAttribute('data-filtro')
        });
        projetoIsotope.on('arrangeComplete', function () {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Configura o lightbox do projeto.
   */
  const projetoLightbox = GLightbox({
    selector: '.projeto-lightbox'
  });

  /**
   * Inicializa o slider de detalhes do projeto.
   */
  new Swiper('.projeto-detalhes-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Configura a biblioteca de animação de rolagem (AOS Library).
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()