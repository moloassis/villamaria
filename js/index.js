// ==========================================
// CONFIGURAÇÃO DA PLANILHA DO GOOGLE SHEETS
// ==========================================
// Insira aqui a URL do seu Web App implantado via Google Apps Script.
// Exemplo: "https://script.google.com/macros/s/AKfycb.../exec"
const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwR7GifmUAY8MW_DvvaVVrZwVO58SuFY3Ccs_n5qp2RssA1TwyZ6hzExX4QYEcD99Nb/exec";

// Banco de Questões do Quiz Histórico da Villa Maria
const QUIZ_QUESTIONS = [
  {
    question: "Qual é o nome do centro cultural da Universidade Estadual do Norte Fluminense Darcy Ribeiro (UENF)?",
    options: ["Casa Azul", "Villa Maria", "Museu Campos", "Palácio da Cultura"],
    correctIndex: 1
  },
  {
    question: "Em que cidade fica a Casa de Cultura Villa Maria?",
    options: ["Rio de Janeiro", "Macaé", "Campos dos Goytacazes", "Niterói"],
    correctIndex: 2
  },
  {
    question: "A Casa de Cultura Villa Maria pertence a qual universidade?",
    options: ["UFRJ", "UENF", "UFF", "UFES"],
    correctIndex: 1
  },
  {
    question: "Quem idealizou o projeto da Casa de Cultura?",
    options: ["José Benevento", "Finasinha", "Darcy Ribeiro", "Atilano Chrisóstomo"],
    correctIndex: 1
  },
  {
    question: "O palacete Villa Maria foi construído como presente para quem?",
    options: ["A professora Maria Queiroz", "A Prefeitura de Campos", "A Universidade", "A Câmara Municipal"],
    correctIndex: 0
  },
  {
    question: "Como Maria Queiroz era conhecida?",
    options: ["Rainha do Café", "Finasinha", "Dona Maria", "Bela Maria"],
    correctIndex: 1
  },
  {
    question: "Por que Finasinha recebeu o apelido de “Rainha da Bondade”?",
    options: ["Porque gostava de música", "Porque ajudava as pessoas e distribuía presentes", "Porque era cantora", "Porque trabalhava na Prefeitura"],
    correctIndex: 1
  },
  {
    question: "O que existia na Casa de Cultura para as pessoas assistirem filmes?",
    options: ["Biblioteca", "Sala de aula", "Videoteca", "Teatro"],
    correctIndex: 2
  },
  {
    question: "O que a Fonoteca oferecia ao público?",
    options: ["Jogos", "Filmes", "Livros", "Músicas e acervo fonográfico"],
    correctIndex: 3
  },
  {
    question: "Complete a frase:<br>A Casa de Cultura Villa Maria ajudou a promover a _____________, a música, o cinema e a leitura em Campos dos Goytacazes.",
    type: "text",
    correctAnswer: "cultura"
  },
  {
    question: "Por que a Casa de Cultura Villa Maria é importante para Campos dos Goytacazes?",
    options: ["Porque vende roupas", "Porque promove cultura, leitura, música e cinema", "Porque é um supermercado", "Porque é uma fábrica"],
    correctIndex: 1
  },
  {
    question: "O que mais marcou a história de Finasinha?",
    options: ["Ela era cantora famosa", "Ela distribuía presentes e ajudava as pessoas", "Ela morava em outro país", "Ela trabalhava em um cinema"],
    correctIndex: 1
  },
  {
    question: "O que as pessoas podiam fazer na Videoteca?",
    options: ["Assistir filmes", "Comprar roupas", "Jogar bola", "Aprender a dirigir"],
    correctIndex: 0
  },
  {
    question: "O que a Sala de Leitura oferecia aos estudantes?",
    options: ["Material de pesquisa e livros", "Jogos eletrônicos", "Piscina", "Animais para visitação"],
    correctIndex: 0
  }
];

const image = document.getElementById("bg-image");
const wrapper = document.getElementById("panzoom-wrapper");
const viewport = document.getElementById("viewport");

// Elementos do Modal
const modal = document.getElementById("info-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalInteractiveArea = document.getElementById("modal-interactive-area");
const modalClose = document.getElementById("modal-close");

// Elementos do Lightbox (Tesouros do Casarão)
const LIGHTBOX_IMAGES = [
  "fotos/IMG_0010.jpg",
  "fotos/IMG_0013.jpg",
  "fotos/IMG_0014.jpg",
  "fotos/IMG_0017.jpg",
  "fotos/IMG_0018.jpg",
  "fotos/IMG_0020.jpg",
  "fotos/IMG_0022.jpg",
  "fotos/IMG_0032.jpg",
  "fotos/IMG_0034.jpg",
  "fotos/IMG_0038.jpg",
  "fotos/IMG_0039.jpg",
  "fotos/IMG_0043.jpg",
  "fotos/IMG_0044.jpg",
  "fotos/IMG_0046.jpg",
  "fotos/IMG_0047.jpg"
];
let lightboxCurrentIndex = 0;
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxCloseBtn = document.getElementById("lightbox-close");
const lightboxPrevBtn = document.getElementById("lightbox-prev");
const lightboxNextBtn = document.getElementById("lightbox-next");

// Função para abrir o Modal com metadados do hotspot
// Função que controla o estado e interface do Quiz Interativo
function initInteractiveQuiz(container) {
  let currentUser = { nome: "", escola: "" };
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let score = 0;

  function renderRegisterScreen() {
    container.innerHTML = `
      <div class="quiz-container">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #d1d5db; line-height: 1.5;">
          Antes de começar, digite seu nome e escola para registrar sua pontuação na planilha!
        </p>
        <div class="quiz-form-group">
          <label class="quiz-label" for="quiz-user-name">Nome Completo *</label>
          <input type="text" id="quiz-user-name" class="quiz-input" placeholder="Digite seu nome completo" required />
        </div>
        <div class="quiz-form-group" style="margin-bottom: 16px;">
          <label class="quiz-label" for="quiz-user-school">Escola / Turma (Opcional)</label>
          <input type="text" id="quiz-user-school" class="quiz-input" placeholder="Ex: Escola Estadual Darcy Ribeiro" />
        </div>
        <button id="quiz-btn-start" class="modal-btn" style="width: 100%;">
          Iniciar Quiz ➔
        </button>
      </div>
    `;

    const btnStart = document.getElementById("quiz-btn-start");
    const nameInput = document.getElementById("quiz-user-name");
    const schoolInput = document.getElementById("quiz-user-school");

    btnStart.addEventListener("click", () => {
      const nome = nameInput.value.trim();
      const escola = schoolInput.value.trim();

      if (!nome) {
        nameInput.style.borderColor = "#ef4444";
        nameInput.placeholder = "O nome completo é obrigatório!";
        nameInput.focus();
        return;
      }

      currentUser.nome = nome;
      currentUser.escola = escola || "Não informada";
      
      // Começa o quiz
      renderQuestion(0);
    });
  }

  function normalizeText(text) {
    if (!text) return "";
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function renderQuestion(index) {
    const q = QUIZ_QUESTIONS[index];
    const totalQuestions = QUIZ_QUESTIONS.length;
    const progressPercent = ((index + 1) / totalQuestions) * 100;
    const isTextQuestion = q.type === "text";

    let questionContentHtml = "";
    if (isTextQuestion) {
      questionContentHtml = `
        <div class="quiz-text-answer-wrapper">
          <input type="text" id="quiz-text-input" class="quiz-input" placeholder="Digite sua resposta aqui..." autocomplete="off" />
          <button id="quiz-btn-submit-text" class="modal-btn" style="margin-top: 12px; width: 100%;">
            Confirmar Resposta ➔
          </button>
        </div>
        <div id="quiz-text-feedback" class="quiz-text-feedback" style="display: none;"></div>
      `;
    } else {
      questionContentHtml = `
        <div class="quiz-options-list">
          ${q.options.map((option, i) => {
            const letter = String.fromCharCode(97 + i); // a, b, c, d
            return `
              <div class="quiz-option" data-index="${i}">
                <span class="quiz-option-letter">${letter.toUpperCase()}</span>
                <span class="quiz-option-text">${option}</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="quiz-container">
        <!-- Barra de progresso premium -->
        <div class="quiz-progress-wrapper">
          <div class="quiz-progress-text">
            <span>ETAPA DE CONHECIMENTOS</span>
            <span>Pergunta ${index + 1} de ${totalQuestions}</span>
          </div>
          <div class="quiz-progress-bar-bg">
            <div class="quiz-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <h3 class="quiz-question-text">${q.question}</h3>

        ${questionContentHtml}

        <div class="quiz-action-area" style="display: none;">
          <button id="quiz-btn-next" class="modal-btn" style="width: 100%;">
            ${index === totalQuestions - 1 ? "Ver Resultado ➔" : "Próxima Pergunta ➔"}
          </button>
        </div>
      </div>
    `;

    const actionArea = container.querySelector(".quiz-action-area");
    const btnNext = document.getElementById("quiz-btn-next");

    if (isTextQuestion) {
      const textInput = document.getElementById("quiz-text-input");
      const btnSubmit = document.getElementById("quiz-btn-submit-text");
      const feedbackDiv = document.getElementById("quiz-text-feedback");
      let submitted = false;

      const handleTextSubmit = () => {
        if (submitted) return;
        const answerVal = textInput.value.trim();
        if (!answerVal) {
          textInput.style.borderColor = "#ef4444";
          textInput.focus();
          return;
        }

        submitted = true;
        textInput.disabled = true;
        btnSubmit.disabled = true;
        btnSubmit.style.display = "none";

        userAnswers.push(answerVal);

        const isCorrect = normalizeText(answerVal) === normalizeText(q.correctAnswer);

        feedbackDiv.style.display = "flex";
        if (isCorrect) {
          feedbackDiv.className = "quiz-text-feedback correct";
          feedbackDiv.innerHTML = `<span>✓</span> Resposta correta!`;
          score++;
        } else {
          feedbackDiv.className = "quiz-text-feedback incorrect";
          feedbackDiv.innerHTML = `<span>✗</span> Resposta incorreta. Correta: <strong>${q.correctAnswer}</strong>`;
        }

        actionArea.style.display = "flex";
      };

      btnSubmit.addEventListener("click", handleTextSubmit);
      textInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          handleTextSubmit();
        }
      });

      // Auto-focus input
      setTimeout(() => {
        textInput.focus();
      }, 100);

    } else {
      const options = container.querySelectorAll(".quiz-option");
      const btnNext = document.getElementById("quiz-btn-next");
      let selected = false;

      options.forEach(opt => {
        opt.addEventListener("click", function() {
          if (selected) return;
          selected = true;

          const selectedIndex = parseInt(this.dataset.index);
          userAnswers.push(selectedIndex);

          // Desabilita novas escolhas
          options.forEach(o => o.classList.add("disabled"));

          // Compara com a resposta correta
          if (selectedIndex === q.correctIndex) {
            this.classList.add("correct");
            score++;
          } else {
            this.classList.add("incorrect");
            // Mostra a correta em verde
            options[q.correctIndex].classList.add("correct");
          }

          // Mostra a área de ação/próxima pergunta
          actionArea.style.display = "flex";
        });
      });
    }

    btnNext.addEventListener("click", () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < totalQuestions) {
        renderQuestion(currentQuestionIndex);
      } else {
        submitResults();
      }
    });
  }

  function submitResults() {
    container.innerHTML = `
      <div class="quiz-container" style="align-items: center; justify-content: center; padding: 40px 0; text-align: center;">
        <div class="quiz-loading-spinner" style="width: 32px; height: 32px; border-width: 3px; margin-bottom: 16px;"></div>
        <p style="margin: 0; font-size: 15px; color: #d1d5db; font-weight: 500;">
          Enviando as suas respostas para a Planilha do Google...
        </p>
      </div>
    `;

    const payload = {
      nome: currentUser.nome,
      escola: currentUser.escola,
      score: score,
      total: QUIZ_QUESTIONS.length,
      respostas: userAnswers.map((ans, qIdx) => {
        const q = QUIZ_QUESTIONS[qIdx];
        if (q.type === "text") {
          return `Q${qIdx + 1}: ${ans} (Correta: ${q.correctAnswer})`;
        }
        return `Q${qIdx + 1}: ${q.options[ans]} (Correta: ${q.options[q.correctIndex]})`;
      })
    };

    const hasRealUrl = GOOGLE_SHEETS_SCRIPT_URL && 
                       GOOGLE_SHEETS_SCRIPT_URL !== "SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI" && 
                       GOOGLE_SHEETS_SCRIPT_URL.trim() !== "";

    if (hasRealUrl) {
      // POST sem CORS (no-cors) para evitar preflights e gerenciar redirecionamento de App Script nativamente
      fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
      })
      .then(() => {
        // no-cors resolve imediatamente como sucesso, mesmo que não consiga ler a resposta
        setTimeout(() => {
          renderResultScreen(false);
        }, 800);
      })
      .catch((err) => {
        console.error("Erro no envio:", err);
        // Em caso de erro físico de conexão, exibe em modo simulação para não travar
        setTimeout(() => {
          renderResultScreen(true);
        }, 800);
      });
    } else {
      // Sem URL configurada: Simula envio por 1.2 segundos
      setTimeout(() => {
        renderResultScreen(true);
      }, 1200);
    }
  }

  function renderResultScreen(isSimulated) {
    const total = QUIZ_QUESTIONS.length;
    let badgeGlowClass = "bronze";
    let scoreBadge = "🥉";
    let feedbackTitle = "Que tal tentar novamente?";
    let feedbackText = "Explore os pontos de interesse do Casarão para conhecer mais sobre a história da Villa Maria!";

    if (score === total) {
      badgeGlowClass = "gold";
      scoreBadge = "🏆";
      feedbackTitle = "Excelente! Desempenho Perfeito!";
      feedbackText = `Parabéns, ${currentUser.nome}! Você domina a história da Villa Maria como um especialista!`;
    } else if (score >= Math.round(total * 0.7)) {
      badgeGlowClass = "silver";
      scoreBadge = "🌟";
      feedbackTitle = "Muito bom! Ótimo Trabalho!";
      feedbackText = `Bom trabalho, ${currentUser.nome}! Você acertou a maior parte das perguntas sobre a Casa de Cultura.`;
    } else {
      badgeGlowClass = "bronze";
      scoreBadge = "📚";
      feedbackTitle = "Continue estudando!";
      feedbackText = `Não desanime, ${currentUser.nome}! Que tal dar uma volta pelos hotspots do mapa interativo e tentar novamente?`;
    }

/*    
 ${isSimulated ? `
          <div class="quiz-status-msg simulated">
            <span>ℹ️</span> Modo Simulação (URL da planilha não configurada)
          </div>
        ` : `
          <div class="quiz-status-msg">
            <span>✓</span> Respostas salvas na Planilha do Google!
          </div>
        `} 
        */

    container.innerHTML = `
      <div class="quiz-result-container">
        <div class="quiz-score-badge">${scoreBadge}</div>
        
        <div class="quiz-score-circle">
          <div class="quiz-score-circle-glow ${badgeGlowClass}"></div>
          <span class="quiz-score-number">${score}/${total}</span>
          <span class="quiz-score-label">Acertos</span>
        </div>

        <h3 class="quiz-feedback-title">${feedbackTitle}</h3>
        <p class="quiz-feedback-text">${feedbackText}</p>

        

        <div style="display: flex; gap: 10px; width: 100%; margin-top: 10px;">
          <button id="quiz-btn-restart" class="modal-btn" style="flex: 1; background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.1); color: #ffffff;">
            Refazer Quiz ↺
          </button>
          <button id="quiz-btn-close" class="modal-btn" style="flex: 1; background: linear-gradient(135deg, #d97706, #b45309);">
            Concluir ✕
          </button>
        </div>
      </div>
    `;

    document.getElementById("quiz-btn-restart").addEventListener("click", () => {
      currentUser = { nome: "", escola: "" };
      currentQuestionIndex = 0;
      userAnswers = [];
      score = 0;
      renderRegisterScreen();
    });

    document.getElementById("quiz-btn-close").addEventListener("click", closeModal);
  }

  // Inicia na tela de registro
  renderRegisterScreen();
}

// Função para abrir o Modal com metadados do hotspot
function openModal(hotspot) {
  const title = hotspot.dataset.title;
  if (title === "Tesouros do Casarão") {
    openLightbox();
    return;
  }
  const description = hotspot.dataset.description;
  const icon = hotspot.dataset.icon;
  const links = JSON.parse(hotspot.dataset.links || "[]");
  const isUpload = hotspot.dataset.isUpload === "true";
  const isQuiz = hotspot.dataset.isQuiz === "true";

  modalIcon.src = icon;
  modalIcon.alt = title;
  modalTitle.textContent = title;
  modalDescription.textContent = description;

  // Limpa a área interativa do modal
  modalInteractiveArea.innerHTML = "";

  if (isQuiz) {
    // Inicia o fluxo interativo do Quiz
    initInteractiveQuiz(modalInteractiveArea);
  } else if (isUpload) {
    // Zona de upload interativa simulada para o recurso de visitas escolares
    const uploadZone = document.createElement("div");
    uploadZone.className = "upload-zone";
    uploadZone.innerHTML = `
      <span class="upload-icon">📁</span>
      <span class="upload-text">Clique ou arraste fotos/vídeos da sua visita</span>
      <span class="upload-subtext">Formatos suportados: Imagens, Vídeos ou PDFs (máx. 50MB)</span>
      <input type="file" style="display: none;" id="mock-file-input" multiple />
    `;

    const successMsg = document.createElement("div");
    successMsg.className = "upload-success-msg";
    successMsg.innerHTML = `<span>✓</span> Arquivos anexados com sucesso para validação!`;

    modalInteractiveArea.appendChild(uploadZone);
    modalInteractiveArea.appendChild(successMsg);

    uploadZone.addEventListener("click", () => {
      document.getElementById("mock-file-input").click();
    });

    modalInteractiveArea.querySelector("#mock-file-input").addEventListener("change", function () {
      if (this.files && this.files.length > 0) {
        successMsg.style.display = "flex";
        uploadZone.style.borderColor = "#10b981";
        uploadZone.querySelector(".upload-text").innerHTML = `<strong>${this.files.length} arquivo(s)</strong> selecionado(s)!`;
      }
    });
  } else if (links.length > 0) {
    // Cria os botões para os links do PDF
    const container = document.createElement("div");
    container.className = "links-container";
    
    links.forEach((link) => {
      const btn = document.createElement("a");
      btn.className = "modal-btn";
      btn.href = link.url;
      btn.target = "_blank";
      btn.rel = "noopener noreferrer";
      btn.innerHTML = `${link.label} <span style="font-size: 11px;">↗</span>`;
      container.appendChild(btn);
    });
    
    modalInteractiveArea.appendChild(container);
  }

  // Abre o modal
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

// Função para fechar o Modal
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Eventos de Fechamento do Modal
modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

// ==========================================
// FUNÇÕES DO LIGHTBOX (TESOUROS DO CASARÃO)
// ==========================================
function openLightbox() {
  lightboxCurrentIndex = 0;
  updateLightboxImage();
  lightboxModal.classList.add("open");
  lightboxModal.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightboxModal.classList.remove("open");
  lightboxModal.setAttribute("aria-hidden", "true");
}

function updateLightboxImage() {
  lightboxImg.classList.add("changing");
  
  const tempImg = new Image();
  tempImg.src = LIGHTBOX_IMAGES[lightboxCurrentIndex];
  tempImg.onload = () => {
    lightboxImg.src = LIGHTBOX_IMAGES[lightboxCurrentIndex];
    lightboxCounter.textContent = `${lightboxCurrentIndex + 1} / ${LIGHTBOX_IMAGES.length}`;
    lightboxImg.classList.remove("changing");
  };
}

function navigateLightbox(direction) {
  lightboxCurrentIndex += direction;
  if (lightboxCurrentIndex < 0) {
    lightboxCurrentIndex = LIGHTBOX_IMAGES.length - 1;
  } else if (lightboxCurrentIndex >= LIGHTBOX_IMAGES.length) {
    lightboxCurrentIndex = 0;
  }
  updateLightboxImage();
}

// Eventos do Lightbox
if (lightboxCloseBtn) {
  lightboxCloseBtn.addEventListener("click", closeLightbox);
}
if (lightboxPrevBtn) {
  lightboxPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
}
if (lightboxNextBtn) {
  lightboxNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });
}
if (lightboxModal) {
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Suporte a Swipe no Mobile para o Lightbox
  let lightboxTouchStartX = 0;
  let lightboxTouchEndX = 0;

  lightboxModal.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 0) {
      lightboxTouchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  lightboxModal.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      lightboxTouchEndX = e.changedTouches[0].clientX;
      const swipeThreshold = 50;
      if (lightboxTouchEndX < lightboxTouchStartX - swipeThreshold) {
        navigateLightbox(1); // Swipe esquerda -> próxima imagem
      } else if (lightboxTouchEndX > lightboxTouchStartX + swipeThreshold) {
        navigateLightbox(-1); // Swipe direita -> imagem anterior
      }
    }
  }, { passive: true });
}

function initApp() {
  const panzoom = Panzoom(wrapper, {
    maxScale: 12,
    minScale: 1,
    contain: "outside",
    startScale: 1,
  });

  viewport.style.opacity = "1";
  const parent = wrapper.parentElement;
  parent.addEventListener("wheel", panzoom.zoomWithWheel);

  if (window.innerWidth < 768) {
    setTimeout(() => {
      panzoom.zoom(1.5, { animate: true });
    }, 500);
  }

  // Controles de Zoom via Botões Flutuantes
  document.getElementById("zoom-in").addEventListener("click", () => {
    panzoom.zoomIn({ animate: true });
  });
  document.getElementById("zoom-out").addEventListener("click", () => {
    panzoom.zoomOut({ animate: true });
  });

  // Controle de Navegação e Zoom via Teclado
  const panStep = 50;
  window.addEventListener("keydown", (e) => {
    // Se o Lightbox estiver aberto, controla o Lightbox
    if (lightboxModal && lightboxModal.classList.contains("open")) {
      if (e.key === "ArrowLeft") {
        navigateLightbox(-1);
      } else if (e.key === "ArrowRight") {
        navigateLightbox(1);
      } else if (e.key === "Escape") {
        closeLightbox();
      }
      e.preventDefault();
      return;
    }

    // Se o modal estiver aberto, não navega no mapa
    if (modal.classList.contains("open")) return;

    const zoomKeys = ["+", "-", "=", "Add", "Subtract"];
    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (arrowKeys.includes(e.key) || zoomKeys.includes(e.key) || e.code === "NumpadAdd" || e.code === "NumpadSubtract") {
      e.preventDefault(); // Previne comportamento padrão de rolagem/zoom da página
    }

    if (e.key === "ArrowLeft") {
      panzoom.pan(panStep, 0, { relative: true });
    } else if (e.key === "ArrowRight") {
      panzoom.pan(-panStep, 0, { relative: true });
    } else if (e.key === "ArrowUp") {
      panzoom.pan(0, panStep, { relative: true });
    } else if (e.key === "ArrowDown") {
      panzoom.pan(0, -panStep, { relative: true });
    } else if (
      e.key === "+" || 
      e.key === "=" || 
      e.key === "Add" || 
      e.code === "NumpadAdd"
    ) {
      panzoom.zoomIn({ animate: true });
    } else if (
      e.key === "-" || 
      e.key === "Subtract" || 
      e.code === "NumpadSubtract"
    ) {
      panzoom.zoomOut({ animate: true });
    }
  });

  // Global Drag/Pan Detection to prevent accidental hotspot clicks
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  const handleDragStart = (clientX, clientY) => {
    dragStartX = clientX;
    dragStartY = clientY;
    isDragging = false;
  };

  const handleDragMove = (clientX, clientY) => {
    if (dragStartX !== 0 || dragStartY !== 0) {
      const diffX = Math.abs(clientX - dragStartX);
      const diffY = Math.abs(clientY - dragStartY);
      // If panned/dragged more than 6px, flag as dragging
      if (diffX > 6 || diffY > 6) {
        isDragging = true;
      }
    }
  };

  const handleDragEnd = () => {
    dragStartX = 0;
    dragStartY = 0;
  };

  window.addEventListener("mousedown", (e) => {
    handleDragStart(e.clientX, e.clientY);
  });
  window.addEventListener("mousemove", (e) => {
    handleDragMove(e.clientX, e.clientY);
  });
  window.addEventListener("mouseup", () => {
    handleDragEnd();
  });

  window.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  window.addEventListener("touchend", () => {
    handleDragEnd();
  });

  // Hotspots: clique abre o Modal Premium (com bloqueio de arrasto acidental)
  wrapper.querySelectorAll(".hotspot").forEach((hotspot) => {
    hotspot.addEventListener("click", function (e) {
      if (isDragging) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      e.stopPropagation();
      openModal(this);
    });
  });

  // Controle de exibição interativa do painel de instruções
  const navInst = document.getElementById("nav-instructions");
  const instToggle = document.getElementById("inst-toggle");

  if (navInst && instToggle) {
    // Inicialização responsiva: no celular começa minimizado
    if (window.innerWidth < 768) {
      navInst.classList.add("minimized");
    } else {
      navInst.classList.remove("minimized");
    }

    instToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita reabrir imediatamente pelo clique no container
      navInst.classList.add("minimized");
    });

    navInst.addEventListener("click", () => {
      if (navInst.classList.contains("minimized")) {
        navInst.classList.remove("minimized");
      }
    });
  }

  // Helper para registrar novas coordenadas no console ao clicar no mapa
  wrapper.addEventListener("click", (e) => {
    if (isDragging) return;
    if (e.target.classList.contains("hotspot") || e.target.closest(".hotspot")) return;
    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`top: ${y.toFixed(1)}%; left: ${x.toFixed(1)}%;`);
  });
}

if (image.complete) {
  initApp();
} else {
  image.addEventListener("load", initApp);
  image.addEventListener("error", function () {
    alert("Erro ao carregar a imagem. Verifique o caminho do arquivo.");
  });
}
