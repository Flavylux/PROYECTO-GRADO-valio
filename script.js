document.addEventListener("DOMContentLoaded", () => {
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

  const apiInfo = document.getElementById("api-info");
  if (apiInfo) {
    fetch("/api/info")
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

      const response = await fetch("/contacto", {
        method: "POST",
        body: new URLSearchParams(formData)
      });

      const text = await response.text();
      formMessage.textContent = text;
      formMessage.style.color = response.ok ? "#86efac" : "#fda4af";

      if (response.ok) {
        form.reset();
      }
    });
  }
});
