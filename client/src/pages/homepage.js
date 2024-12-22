import React, { useState, useEffect, useRef } from "react";
import Header from "./header";
import Footer from "./footer";
import sfondo from "../assets/cavern_amethyst.png";
import caverna from "../assets/cavern2.webp";
import { FaArrowUp, FaMagic, FaBolt, FaLeaf } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";

//pagina principale senza login
function Homepage() {
  const [opacity, setOpacity] = useState(0.8); // Opacità per lo sfondo
  const [cardOpacity, setCardOpacity] = useState([0.2, 0.2, 0.2]); // Opacità per le card
  const [cardScale, setCardScale] = useState([0.5, 0.5, 0.5]); // Scala per le card
  const [showScrollTop, setShowScrollTop] = useState(false); // Mostra il bottone "Scroll-to-Top"
  const [card4Opacity, setCard4Opacity] = useState(0.2); // Opacità per la card 4
  const [card4Scale, setCard4Scale] = useState(0.5); // Scala per la card 4

  const cardRefs = useRef([]);
  const card4Ref = useRef(null); 

  // Gestione dell'opacità dello sfondo durante lo scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      let newOpacity = 0.8 - (scrollPosition / maxScroll) * 0.7;
      newOpacity = Math.max(0.2, newOpacity); // Limitiamo l'opacità tra 0.2 e 0.8
      setOpacity(newOpacity);
      setShowScrollTop(scrollPosition > 200); // Mostra il bottone "Scroll-to-Top" se si scrolla oltre 200px
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Gestione dell'IntersectionObserver per le card
  useEffect(() => {
    const options = {
      root: null, 
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Quando la card è visibile, l'opacità diventa 1 e la scala 1
          setCardOpacity((prev) => {
            const updatedOpacity = [...prev];
            updatedOpacity[index] = 1;
            return updatedOpacity;
          });
          setCardScale((prev) => {
            const updatedScale = [...prev];
            updatedScale[index] = 1;
            return updatedScale;
          });
        } else {
          // Quando la card non è visibile, l'opacità torna a 0.2 e la scala torna a 0.5
          setCardOpacity((prev) => {
            const updatedOpacity = [...prev];
            updatedOpacity[index] = 0.2;
            return updatedOpacity;
          });
          setCardScale((prev) => {
            const updatedScale = [...prev];
            updatedScale[index] = 0.5;
            return updatedScale;
          });
        }
      });
    }, options);

    // Osserviamo ogni card
    cardRefs.current.forEach((card) => {
      if (card) { 
        observer.observe(card);
      }
    });

    return () => {
      // Pulizia dell'osservatore solo su riferimenti validi
      cardRefs.current.forEach((card) => {
        if (card) { 
          observer.unobserve(card);
        }
      });
    };
  }, []);

  // Gestione dell'IntersectionObserver per la card "Caratteristica 4"
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // La card diventa visibile quando almeno il 50% è visibile
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === card4Ref.current) {
          if (entry.isIntersecting) {
            // Quando la card è visibile, aumenta opacità e scala
            setCard4Opacity(1);
            setCard4Scale(1);
          } else {
            // Quando la card non è visibile, diminuisce opacità e scala
            setCard4Opacity(0.2);
            setCard4Scale(0.5);
          }
        }
      });
    }, options);

    // Osserviamo la card "Caratteristica 4"
    if (card4Ref.current) {
      observer.observe(card4Ref.current);
    }

    return () => {
      if (card4Ref.current) {
        observer.unobserve(card4Ref.current);
      }
    };
  }, []);

  // Funzione per scrollare verso l'alto
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
  <Header />

<div className="mb-10">
  {/* sezione immagine inizio pagina */}
  <div className="relative w-full h-screen ">
    <div
      className="absolute top-0 left-0 w-full h-screen bg-cover bg-center z-0"
      style={{
        backgroundImage: `url(${sfondo})`,
        opacity: opacity,
      }}
    >
      {/* svg curve sopra */}
      <svg
        className="w-full absolute top-0"
        viewBox="0 40 1000 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#fff"
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      {/* svg curve sotto */}
      <svg
        className="w-full absolute bottom-0"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#fff"
          d="M0,224L48,213.3C96,203,192,181,288,170.7C384,160,480,160,576,170.7C672,181,768,203,864,218.7C960,235,1056,245,1152,245.3C1248,245,1344,235,1392,229.3L1440,224V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>

    {/* scritta sopra l'immagine */}
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
      <h1 className="bg-white p-1 shadow-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pridi font-bold mb-4 drop-shadow-md text-purple-400">
        BENVENUTI IN AMETHYST!
      </h1>
      <p className="font-charm text-base sm:text-lg md:text-xl lg:text-xl max-w-xl sm:max-w-2xl mb-6 drop-shadow-md text-white">
        Entra in un mondo nelle mani della libertà.
      </p>
    </div>
  </div>

  {/* Main Content Section */}
  <div className="mt-10 px-4">
    <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-8 space-y-8 lg:space-y-0">
      <div
        ref={(el) => (cardRefs.current[0] = el)}
        className="p-5 w-full sm:w-[300px] lg:w-[350px] bg-white rounded-lg shadow-md border-t-4 border-purple-400 relative"
        style={{
          opacity: cardOpacity[0],
          transform: `scale(${cardScale[0]})`,
          transition: "opacity 0.5s, transform 0.5s",
        }}
      >
        <FaMagic className="text-purple-400 text-3xl absolute -top-8 left-4" />
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-purple-600">
          Caratteristica 1
        </h2>
        <p className="text-gray-600 text-sm">
          Offriamo funzionalità intuitive per semplificare la tua esperienza.
        </p>
      </div>
      <div
        ref={(el) => (cardRefs.current[1] = el)}
        className="p-5 w-full sm:w-[300px] lg:w-[400px] bg-white rounded-lg shadow-md border-t-4 border-purple-400 relative"
        style={{
          opacity: cardOpacity[1],
          transform: `scale(${cardScale[1]})`,
          transition: "opacity 0.5s, transform 0.5s",
        }}
      >
        <FaBolt className="text-purple-400 text-3xl absolute -top-8 left-4" />
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-purple-600">
          Caratteristica 2
        </h2>
        <p className="text-gray-600 text-sm">
          Offriamo funzionalità intuitive per semplificare la tua esperienza.
        </p>
      </div>
      <div
        ref={(el) => (cardRefs.current[2] = el)}
        className="p-5 w-full sm:w-[300px] lg:w-[400px] bg-white rounded-lg shadow-md border-t-4 border-purple-400 relative"
        style={{
          opacity: cardOpacity[2],
          transform: `scale(${cardScale[2]})`,
          transition: "opacity 0.5s, transform 0.5s",
        }}
      >
        <FaLeaf className="text-purple-400 text-3xl absolute -top-8 left-4" />
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-purple-600">
          Caratteristica 3
        </h2>
        <p className="text-gray-600 text-sm">
          Offriamo funzionalità intuitive per semplificare la tua esperienza.
        </p>
      </div>
    </div>
  </div>

  <div className="mt-20 flex flex-col lg:flex-row justify-center lg:justify-end items-center lg:items-start px-4">
    <div
      ref={card4Ref}
      className="p-5 w-full sm:w-[300px] lg:w-[400px] bg-white rounded-lg shadow-md border-t-4 border-purple-400 relative lg:mr-40 lg:mt-40"
      style={{
        opacity: card4Opacity,
        transform: `scale(${card4Scale})`,
        transition: "opacity 0.5s, transform 0.5s",
      }}
    >
      <DiAndroid className="text-purple-400 text-3xl absolute -top-8 left-4" />
      <h2 className="text-lg sm:text-xl font-semibold mb-3 text-purple-600">
        Caratteristica 4
      </h2>
      <p className="text-gray-600 text-sm">
        Offriamo funzionalità intuitive per semplificare la tua esperienza.
      </p>
    </div>

    <div className="relative flex justify-center lg:justify-end opacity-60 mt-8 lg:mt-0">
      <img
        src={caverna}
        alt="Caverna"
        className="w-full sm:w-[300px] lg:w-[500px] rounded-lg rounded-b-10xl"
      />
       {/* Curva sopra */}
                <svg
                  className="w-full absolute top-0"
                  viewBox="0 40 1300 320"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#fff"
                    d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                  ></path>
                </svg>
                {/* Curva sotto */}
                <svg
                  className="w-full absolute bottom-0"
                  viewBox="0 0 1300 600"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#fff"
                    d="M0,224L48,213.3C96,203,192,181,288,170.7C384,160,480,160,576,170.7C672,181,768,203,864,218.7C960,235,1056,245,1152,245.3C1248,245,1344,235,1392,229.3L1440,224V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
      
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="animate-bounce fixed bottom-10 left-10 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

  </div>
  <Footer />
</div>

  );
}

export default Homepage;
