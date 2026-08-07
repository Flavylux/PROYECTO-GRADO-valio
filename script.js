document.addEventListener("DOMContentLoaded", () => {
  const readmeImageUrls = {
    about: "https://REEMPLAZAR-URL-IMAGEN-SOBRE-MI",
    unidad1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM6BPwLsPZtAFwagHXUU3m2fdZ86Q3UkHuhm64j_jlcg&s=10",
    unidad2: "https://codelearn.es/wp-content/uploads/sites/4/2022/09/binary-code.jpg",
    unidad3: "https://REEMPLAZAR-URL-IMAGEN-UNIDAD-3"
  };

  const isValidImageUrl = (url) => typeof url === "string" && url.startsWith("http") && !url.includes("REEMPLAZAR-URL");

  const SETTINGS_STORAGE_KEY = "utc-site-settings-v1";
  const loadSettings = () => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const saveSettings = (settings) => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  };
  const siteSettings = {
    soundEnabled: loadSettings().soundEnabled ?? true
  };
  const scriptTag = document.querySelector('script[src$="script.js"]');
  const scriptSrc = scriptTag?.getAttribute("src");
  let siteBasePath = "";
  if (/(^|\.)github\.io$/i.test(window.location.hostname)) {
    const [repoSlug] = window.location.pathname.split("/").filter(Boolean);
    siteBasePath = repoSlug ? `/${repoSlug}` : "";
  } else if (scriptSrc) {
    const scriptUrl = new URL(scriptSrc, document.baseURI);
    const scriptDir = scriptUrl.pathname.replace(/\/[^/]*$/, "");
    siteBasePath = scriptDir === "/" ? "" : scriptDir;
  }
  const withBasePath = (route) => {
    const cleanRoute = route.replace(/^\/+/, "");
    return siteBasePath ? `${siteBasePath}/${cleanRoute}` : `/${cleanRoute}`;
  };

  const playSuccessTone = () => {
    if (!siteSettings.soundEnabled) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.13);
    });

    window.setTimeout(() => ctx.close(), 450);
  };

  const triggerSuccessEffect = (anchorElement) => {
    const burst = document.createElement("div");
    burst.className = "trivia-success-burst";

    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.38;
    const sparkCount = 22;

    for (let i = 0; i < sparkCount; i += 1) {
      const spark = document.createElement("span");
      spark.className = "trivia-spark";
      const angle = (Math.PI * 2 * i) / sparkCount;
      const radius = 90 + Math.random() * 120;
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      spark.style.left = `${centerX}px`;
      spark.style.top = `${centerY}px`;
      spark.style.setProperty("--dx", `${dx}px`);
      spark.style.setProperty("--dy", `${dy}px`);
      burst.appendChild(spark);
    }

    document.body.appendChild(burst);
    window.setTimeout(() => burst.remove(), 950);

    if (anchorElement instanceof HTMLElement) {
      anchorElement.classList.add("success-flash");
      window.setTimeout(() => anchorElement.classList.remove("success-flash"), 620);
    }
  };

  const unitsData = [
    {
      id: "unidad1",
      number: "1",
      title: "Introducción al Mundo de la Programación",
      imageUrl: readmeImageUrls.unidad1,
      topics: [
        {
          heading: "Contexto Histórico y Programadores",
          text: "Evolución del pensamiento algorítmico, aportes de pioneros e hitos fundamentales de la informática."
        },
        {
          heading: "Generaciones de Computadoras",
          text: "Avance del hardware desde tubos al vacío hasta microprocesadores modernos."
        },
        {
          heading: "Avances Tecnológicos",
          text: "Impacto e historia de la tecnología en la sociedad."
        },
        {
          heading: "Sistemas Operativos",
          text: "Conceptos fundamentales, evolución y gestión de recursos del sistema."
        }
      ],
      tags: ["Historia", "Hardware", "Sistemas Operativos"]
    },
    {
      id: "unidad2",
      number: "2",
      title: "Fundamentos de Lógica y Metodología de Desarrollo",
      imageUrl: readmeImageUrls.unidad2,
      topics: [
        {
          heading: "Sistemas de Numeración",
          text: "Números binarios, conversiones y lenguaje máquina."
        },
        {
          heading: "Diagramas de Flujo",
          text: "Representación gráfica de algoritmos para resolución paso a paso."
        },
        {
          heading: "Metodología de Desarrollo de Software",
          text: "Fases del ciclo de vida (Análisis, Diseño, Desarrollo/Codificación, Evaluación/Pruebas)."
        },
        {
          heading: "Conceptos Clave",
          text: "Diferenciación entre Hardware vs. Software, Compilados vs. Interpretados, Lógica vs. Sintaxis."
        },
        {
          heading: "Transición a Pseudocódigo",
          text: "Introducción a PSeInt como puente entre diagramas de flujo y código."
        }
      ],
      tags: ["binarios", "PSeInt", "Lógica"]
    },
    {
      id: "unidad3",
      number: "3",
      title: "Programación Estructurada y Lenguaje Python",
      imageUrl: readmeImageUrls.unidad3,
      topics: [
        {
          heading: "Lógica Algorítmica con PSeInt",
          text: "Lógica compleja y pseudocódigo estructurado."
        },
        {
          heading: "Introducción a Python",
          text: "Sintaxis básica, entorno de ejecución y fundamentos del lenguaje."
        },
        {
          heading: "Estructuras Condicionales",
          text: "Control de flujo y toma de decisiones mediante sentencias",
          badges: ["if"]
        },
        {
          heading: "Estructuras Repetitivas / Bucles",
          text: "Lógica iterativa con bucles",
          badges: ["while", "for"]
        }
      ],
      tags: ["PSeInt", "Python", "if", "while", "for"]
    }
  ];

  const unitsContainer = document.getElementById("units-container");
  if (unitsContainer) {
    unitsContainer.innerHTML = unitsData
      .map((unit, index) => {
        const topicsMarkup = unit.topics
          .map((topic) => {
            const extraBadges = (topic.badges || [])
              .map((badge) => ` <span class="badge">${badge}</span>`)
              .join("");
            return `<li><strong>${topic.heading}:</strong> ${topic.text}${extraBadges}.</li>`;
          })
          .join("");

        const tagsMarkup = (unit.tags || [])
          .map((tag) => `<span class="badge">${tag}</span>`)
          .join("");

        const imageMarkup = isValidImageUrl(unit.imageUrl)
          ? `<img class="unit-cover" src="${unit.imageUrl}" alt="Imagen de ${unit.title}" loading="lazy" decoding="async" />`
          : "";

        return `
          <article class="unit-card reveal" id="${unit.id}">
            <div class="unit-badge">${unit.number}</div>
            <h3>${unit.title}</h3>
            <button class="unit-toggle" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
              ${index === 0 ? "Ocultar temas" : "Ver temas"}
            </button>
            <div class="unit-content ${index === 0 ? "open" : ""}">
              ${imageMarkup}
              <ul class="unit-points">${topicsMarkup}</ul>
              <div class="unit-tags">${tagsMarkup}</div>
              <a class="btn btn-secondary" href="unidad${unit.number}.html">Ver más</a>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const aboutPhoto = document.getElementById("about-photo");
  if (aboutPhoto && isValidImageUrl(readmeImageUrls.about)) {
    aboutPhoto.setAttribute("src", readmeImageUrls.about);
    aboutPhoto.classList.remove("hidden");
  }

  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const targetId = link.getAttribute("href")?.replace("#", "");
            link.classList.toggle("active", targetId === entry.target.id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach((section) => observer.observe(section));
  }

  const topicLinks = Array.from(document.querySelectorAll(".topic-index-link"));
  if (topicLinks.length) {
    const topicMap = topicLinks
      .map((link) => {
        const href = link.getAttribute("href") || "";
        const targetId = href.startsWith("#") ? href.slice(1) : "";
        const target = targetId ? document.getElementById(targetId) : null;
        return { link, targetId, target };
      })
      .filter((item) => item.target);

    const topicObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.getAttribute("id");
        topicMap.forEach(({ link, targetId }) => {
          link.classList.toggle("active", targetId === activeId);
        });
      });
    }, { threshold: 0.32, rootMargin: "-12% 0px -52% 0px" });

    topicMap.forEach(({ link, target }) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    topicMap.forEach(({ target }) => topicObserver.observe(target));
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    reveals.forEach((item) => revealObserver.observe(item));
  }

  const animatedSections = document.querySelectorAll("#sobre-mi, #academico");
  if (animatedSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    }, { threshold: 0.25 });

    animatedSections.forEach((section) => sectionObserver.observe(section));
  }

  const unitToggles = document.querySelectorAll(".unit-toggle");
  if (unitToggles.length) {
    unitToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const content = toggle.nextElementSibling;
        if (!(content instanceof HTMLElement)) return;

        const isOpen = content.classList.contains("open");
        content.classList.toggle("open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
        toggle.textContent = !isOpen ? "Ocultar temas" : "Ver temas";
      });
    });
  }

  const triviaBank = {
    unidad1: [
      {
        question: "¿Quién es reconocida como la primera programadora de la historia?",
        options: ["Grace Hopper", "Ada Lovelace", "Katherine Johnson", "Hedy Lamarr"],
        correctIndex: 1
      },
      {
        question: "¿Qué introdujo el Telar de Jacquard como antecedente de la programación?",
        options: ["Lenguaje ensamblador", "Tarjetas perforadas", "Sistemas operativos", "Memoria RAM"],
        correctIndex: 1
      },
      {
        question: "¿Cuál es el aporte principal de John von Neumann?",
        options: ["El primer compilador", "El primer videojuego", "Arquitectura con memoria compartida para datos e instrucciones", "El lenguaje COBOL"],
        correctIndex: 2
      },
      {
        question: "¿Qué caracteriza a la primera generación de computadoras?",
        options: ["Microprocesadores", "Transistores", "Tubos al vacío", "Nube"],
        correctIndex: 2
      }
    ],
    unidad2: [
      {
        question: "¿Cuál es la base del sistema binario?",
        options: ["Base 8", "Base 2", "Base 10", "Base 16"],
        correctIndex: 1
      },
      {
        question: "¿Qué símbolo representa una decisión lógica en un diagrama de flujo?",
        options: ["Rectángulo", "Paralelogramo", "Rombo", "Círculo"],
        correctIndex: 2
      },
      {
        question: "¿Cuál es el orden correcto del ciclo básico de desarrollo de software?",
        options: ["Diseño, análisis, evaluación, codificación", "Análisis, diseño, desarrollo, evaluación", "Evaluación, desarrollo, análisis, diseño", "Desarrollo, análisis, diseño, pruebas"],
        correctIndex: 1
      },
      {
        question: "En términos generales, ¿qué ventaja principal tienen los lenguajes interpretados?",
        options: ["Más consumo de memoria", "Compilación obligatoria", "Desarrollo y depuración más ágiles", "Nula portabilidad"],
        correctIndex: 2
      }
    ],
    unidad3: [
      {
        question: "¿Qué operación describe mejor la conversión de binario a decimal?",
        options: ["Restar potencias de 10", "Multiplicar cada bit por potencias de 2 y sumar", "Dividir por 16", "Convertir a octal primero"],
        correctIndex: 1
      },
      {
        question: "¿Qué propiedad exige que un algoritmo termine?",
        options: ["Precisión", "Definición", "Finitud", "Recursividad"],
        correctIndex: 2
      },
      {
        question: "¿Qué fase del SDLC se centra en pruebas y depuración?",
        options: ["Análisis", "Diseño", "Evaluación", "Codificación"],
        correctIndex: 2
      },
      {
        question: "¿Cuál es el objetivo principal de PSeInt?",
        options: ["Reemplazar Python", "Entrenar lógica con pseudocódigo antes de la sintaxis formal", "Diseñar hardware", "Compilar C++"],
        correctIndex: 1
      }
    ]
  };

  const TRIVIA_STORAGE_KEY = "utc-trivia-progress-v1";

  const loadTriviaProgress = () => {
    try {
      const raw = localStorage.getItem(TRIVIA_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveTriviaProgress = (state) => {
    localStorage.setItem(TRIVIA_STORAGE_KEY, JSON.stringify(state));
  };

  const buildGlobalRanking = (state) => {
    const unitKeys = Object.keys(triviaBank);
    const ranking = unitKeys
      .map((key) => {
        const best = Number(state[key]?.bestScore || 0);
        return { key, best, total: triviaBank[key].length };
      })
      .sort((a, b) => b.best - a.best);

    const bestSum = ranking.reduce((acc, item) => acc + item.best, 0);
    const totalSum = ranking.reduce((acc, item) => acc + item.total, 0);
    const completedCount = unitKeys.filter((key) => Boolean(state[key]?.completed)).length;

    return { ranking, bestSum, totalSum, completedCount, unitTotal: unitKeys.length };
  };

  const renderProgressOverview = (state) => {
    const panel = document.getElementById("progress-overview");
    if (!(panel instanceof HTMLElement)) return;

    const global = buildGlobalRanking(state);
    const percent = global.totalSum > 0 ? Math.round((global.bestSum / global.totalSum) * 100) : 0;
    const rows = global.ranking
      .map((item) => {
        const unitPercent = item.total > 0 ? Math.round((item.best / item.total) * 100) : 0;
        const unitLabel = item.key.replace("unidad", "Unidad ");
        return `
          <div class="progress-row">
            <div class="progress-row-head">
              <span>${unitLabel}</span>
              <strong>${item.best}/${item.total}</strong>
            </div>
            <div class="progress-bar"><span style="width:${unitPercent}%"></span></div>
          </div>
        `;
      })
      .join("");

    panel.innerHTML = `
      <p class="eyebrow">Mapa de progreso general</p>
      <div class="progress-header">
        <h3>Avance acumulado de trivias</h3>
        <strong>${global.bestSum}/${global.totalSum} • ${percent}%</strong>
      </div>
      <div class="progress-bar progress-bar-global"><span style="width:${percent}%"></span></div>
      <p class="progress-caption">Unidades completadas: ${global.completedCount}/${global.unitTotal}</p>
      <div class="progress-grid">${rows}</div>
    `;
  };

  const triviaHubs = document.querySelectorAll(".trivia-hub");
  renderProgressOverview(loadTriviaProgress());

  if (triviaHubs.length) {
    const triviaState = loadTriviaProgress();

    triviaHubs.forEach((hub) => {
      const unitKey = hub.getAttribute("data-unit");
      const target = hub.querySelector(".trivia-game");
      const questions = unitKey ? triviaBank[unitKey] : null;
      const statsBox = document.createElement("div");
      statsBox.className = "trivia-stats";
      target?.before(statsBox);

      if (!(target instanceof HTMLElement) || !questions?.length) return;

      const saved = triviaState[unitKey] || {};
      let current = Number.isInteger(saved.currentIndex) ? saved.currentIndex : 0;
      let score = Number.isInteger(saved.currentScore) ? saved.currentScore : 0;
      let locked = false;

      const persistUnitState = (extra = {}) => {
        triviaState[unitKey] = {
          ...triviaState[unitKey],
          currentIndex: current,
          currentScore: score,
          bestScore: Math.max(Number(triviaState[unitKey]?.bestScore || 0), Number(extra.lastScore || score)),
          completed: Boolean(extra.completed ?? triviaState[unitKey]?.completed),
          plays: Number(triviaState[unitKey]?.plays || 0),
          lastPlayedAt: new Date().toISOString(),
          ...extra
        };
        saveTriviaProgress(triviaState);
        renderProgressOverview(triviaState);
      };

      const renderStats = () => {
        const unitState = triviaState[unitKey] || {};
        const global = buildGlobalRanking(triviaState);
        const rankingItems = global.ranking
          .map((item, index) => `<li><strong>#${index + 1}</strong> ${item.key.toUpperCase()}: ${item.best}/${item.total}</li>`)
          .join("");

        statsBox.innerHTML = `
          <div class="trivia-unit-stat">
            <span>Mejor puntaje (${unitKey.toUpperCase()}):</span>
            <strong>${Number(unitState.bestScore || 0)}/${questions.length}</strong>
          </div>
          <div class="trivia-unit-stat">
            <span>Ranking global acumulado:</span>
            <strong>${global.bestSum}/${global.totalSum}</strong>
          </div>
          <div class="trivia-unit-stat">
            <span>Unidades completadas:</span>
            <strong>${global.completedCount}/${global.unitTotal}</strong>
          </div>
          <label class="trivia-audio-toggle">
            <input type="checkbox" ${siteSettings.soundEnabled ? "checked" : ""} />
            <span>Sonido de acierto</span>
          </label>
          <ol class="trivia-ranking">${rankingItems}</ol>
        `;

        const soundInput = statsBox.querySelector(".trivia-audio-toggle input");
        if (soundInput instanceof HTMLInputElement) {
          soundInput.addEventListener("change", () => {
            siteSettings.soundEnabled = soundInput.checked;
            saveSettings(siteSettings);
          });
        }
      };

      if (current >= questions.length) {
        current = questions.length - 1;
      }
      if (current < 0) {
        current = 0;
      }

      renderStats();

      const renderQuestion = () => {
        const item = questions[current];
        const options = item.options
          .map((option, index) => `<button class="trivia-option" data-index="${index}" type="button">${option}</button>`)
          .join("");

        target.innerHTML = `
          <div class="trivia-progress">Pregunta ${current + 1} de ${questions.length} • Puntaje: ${score}</div>
          <p class="trivia-question">${item.question}</p>
          <div class="trivia-options">${options}</div>
          <p class="trivia-feedback">Selecciona una opción.</p>
          <button class="btn btn-secondary trivia-next" type="button" disabled>Siguiente</button>
        `;

        const feedback = target.querySelector(".trivia-feedback");
        const nextButton = target.querySelector(".trivia-next");
        const optionButtons = target.querySelectorAll(".trivia-option");

        persistUnitState({ completed: false });
        renderStats();

        optionButtons.forEach((button) => {
          button.addEventListener("click", () => {
            if (locked || !(feedback instanceof HTMLElement) || !(nextButton instanceof HTMLButtonElement)) return;
            locked = true;
            const picked = Number(button.getAttribute("data-index"));
            const correct = item.correctIndex;

            optionButtons.forEach((btn) => {
              const idx = Number(btn.getAttribute("data-index"));
              btn.classList.toggle("correct", idx === correct);
              btn.classList.toggle("wrong", idx === picked && idx !== correct);
              btn.setAttribute("disabled", "true");
            });

            if (picked === correct) {
              score += 1;
              feedback.textContent = "Correcto. Buen dominio del tema.";
              feedback.classList.add("success");
              triggerSuccessEffect(hub);
              playSuccessTone();
            } else {
              feedback.textContent = `Respuesta incorrecta. La opción correcta era: ${item.options[correct]}.`;
              feedback.classList.add("error");
            }

            persistUnitState();
            renderStats();
            nextButton.disabled = false;
          });
        });

        if (nextButton instanceof HTMLButtonElement) {
          nextButton.addEventListener("click", () => {
            locked = false;
            current += 1;
            if (current < questions.length) {
              persistUnitState();
              renderQuestion();
              return;
            }

            const plays = Number(triviaState[unitKey]?.plays || 0) + 1;
            persistUnitState({
              currentIndex: 0,
              currentScore: score,
              lastScore: score,
              bestScore: Math.max(Number(triviaState[unitKey]?.bestScore || 0), score),
              completed: true,
              plays
            });
            renderStats();

            target.innerHTML = `
              <p class="trivia-question">Juego finalizado</p>
              <p class="trivia-feedback success">Obtuviste ${score} de ${questions.length} respuestas correctas.</p>
              <button class="btn btn-primary trivia-restart" type="button">Volver a jugar</button>
            `;

            const restart = target.querySelector(".trivia-restart");
            if (restart instanceof HTMLButtonElement) {
              restart.addEventListener("click", () => {
                current = 0;
                score = 0;
                locked = false;
                persistUnitState({ currentIndex: 0, currentScore: 0, completed: false });
                renderStats();
                renderQuestion();
              });
            }
          });
        }
      };

      if (saved.completed && Number.isInteger(saved.lastScore)) {
        target.innerHTML = `
          <p class="trivia-question">Ya completaste esta trivia</p>
          <p class="trivia-feedback success">Último puntaje: ${saved.lastScore}/${questions.length}. Puedes intentar superarlo.</p>
          <button class="btn btn-primary trivia-restart" type="button">Volver a jugar</button>
        `;

        const restart = target.querySelector(".trivia-restart");
        if (restart instanceof HTMLButtonElement) {
          restart.addEventListener("click", () => {
            current = 0;
            score = 0;
            locked = false;
            persistUnitState({ currentIndex: 0, currentScore: 0, completed: false });
            renderStats();
            renderQuestion();
          });
        }
      } else {
        renderQuestion();
      }
    });
  }

  const apiInfo = document.getElementById("api-info");
  if (apiInfo) {
    fetch(withBasePath("api/info"))
      .then((response) => response.json())
      .then((data) => {
        const activity = data?.data?.activity || "Explorar nuevas ideas";
        const type = data?.data?.type || "educación";
        apiInfo.innerHTML = `<p><strong>Actividad sugerida:</strong> ${activity}</p><p><strong>Tipo:</strong> ${type}</p>`;
      })
      .catch(() => {
        apiInfo.innerHTML = `<p><strong>Fallback:</strong> La información externa no está disponible, pero la página sigue funcionando.</p>`;
      });
  }

  const quizOptions = document.querySelectorAll('.quiz-option');
  const quizFeedback = document.getElementById('quiz-feedback');
  const retryButton = document.getElementById('retry-btn');

  if (quizOptions.length && quizFeedback && retryButton) {
    const resetQuiz = () => {
      quizOptions.forEach((option) => {
        option.classList.remove('correct', 'wrong');
        option.disabled = false;
      });
      quizFeedback.textContent = 'Elige una respuesta.';
      quizFeedback.className = 'quiz-feedback';
      retryButton.classList.add('hidden');
    };

    quizOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const isCorrect = option.dataset.correct === 'true';
        if (isCorrect) {
          option.classList.add('correct');
          quizFeedback.innerHTML = '🎉 EXCELENTE! <br>¡Respuesta correcta!';
          quizFeedback.classList.add('success');
          triggerSuccessEffect(option.closest('.content-card'));
          playSuccessTone();
          quizOptions.forEach((btn) => btn.disabled = true);
          retryButton.textContent = 'Volver a intentar';
          retryButton.classList.remove('hidden');
        } else {
          option.classList.add('wrong');
          quizFeedback.innerHTML = '😞 Muy mal. <br>Inténtalo otra vez.';
          quizFeedback.classList.add('error');
          quizOptions.forEach((btn) => btn.disabled = true);
          retryButton.textContent = 'Intentar otra vez';
          retryButton.classList.remove('hidden');
        }
      });
    });

    retryButton.addEventListener('click', resetQuiz);
  }

  const activityOptions = document.querySelectorAll('.activity-option');
  const activityFeedback2 = document.getElementById('activity-feedback-2');
  const activityFeedback3 = document.getElementById('activity-feedback-3');

  const handleActivityResponse = (feedback, options) => {
    if (!feedback || !options.length) return;

    options.forEach((option) => {
      option.addEventListener('click', () => {
        const isCorrect = option.dataset.correct === 'true';
        if (isCorrect) {
          option.classList.add('correct');
          feedback.innerHTML = '✅ Correcto. <br>Aplicar con pasos claros demuestra comprensión.';
          feedback.classList.add('success');
          triggerSuccessEffect(option.closest('.content-card'));
          playSuccessTone();
        } else {
          option.classList.add('wrong');
          feedback.innerHTML = '🔎 Casi. <br>Piensa en la opción que resuelve mejor el problema.';
          feedback.classList.add('error');
        }
        options.forEach((btn) => btn.disabled = true);
      });
    });
  };

  if (activityOptions.length) {
    handleActivityResponse(activityFeedback2 || activityFeedback3, activityOptions);
  }

  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  if (form && formMessage) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      formMessage.textContent = "Enviando...";
      formMessage.style.color = "#f59e0b";

      try {
        const response = await fetch(withBasePath("contacto"), {
          method: "POST",
          body: new URLSearchParams(formData)
        });

        const text = await response.text();
        formMessage.textContent = text;
        formMessage.style.color = response.ok ? "#86efac" : "#fda4af";

        if (response.ok) {
          form.reset();
        }
      } catch {
        formMessage.textContent = "No se pudo enviar el mensaje. Inténtalo nuevamente más tarde.";
        formMessage.style.color = "#fda4af";
      }
    });
  }
});
