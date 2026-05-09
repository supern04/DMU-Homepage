// Hero Slider Logic (Refined for Hyundai Style)
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.left-arrow');
const nextBtn = document.querySelector('.right-arrow');
const scrollLine = document.querySelector('.scroll-line');
let currentSlide = 0;
let slideInterval;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Reset scroll line animation
    scrollLine.style.transition = 'none';
    scrollLine.style.width = '0';
    setTimeout(() => {
        scrollLine.style.transition = 'width 5s linear';
        scrollLine.style.width = '200px'; // Hyundai-style progress line
    }, 50);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    startAutoSlide();
});

if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    startAutoSlide();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        startAutoSlide();
    });
});

// Initialize
showSlide(0);
startAutoSlide();

// Board Data Rendering
const boardData = [
    { title: '[공지] 동양미래대학교 로봇소프트웨어과 로봇 제작 심화 과정 신청 안내', date: '2026.05.07' },
    { title: '[포트폴리오] 캡스톤 디자인 경진대회 예선 참가자 명단 발표', date: '2026.05.05' },
    { title: '[동아리] MAS, MCA, SMART 등 전공동아리 신입 부원 모집', date: '2026.05.03' },
    { title: '[취업] AMK CE (Customer Engineer) 부문 캠퍼스 리크루팅 안내', date: '2026.04.30' },
    { title: '[장학] 2026학년도 1학기 로봇소프트웨어과 성적 및 실습 우수 장학금 신청', date: '2026.04.28' }
];

const boardList = document.getElementById('board-list');

function renderBoard() {
    if (!boardList) return;
    boardList.innerHTML = '';
    boardData.forEach(item => {
        const boardItem = document.createElement('a'); // Change to anchor tag
        boardItem.href = 'https://www.dongyang.ac.kr/dmu/4903/subview.do';
        boardItem.target = '_blank';
        boardItem.className = 'board-item';
        boardItem.style.textDecoration = 'none';
        boardItem.style.color = 'inherit';
        boardItem.innerHTML = `
            <span class="title">${item.title}</span>
            <span class="date">${item.date}</span>
        `;
        boardList.appendChild(boardItem);
    });
}

setTimeout(renderBoard, 800);

// Interactive UI Modals & Overlays
const userBtn = document.querySelector('.user-btn');
const searchBtn = document.querySelector('.search-btn');
const menuBtn = document.querySelector('.menu-btn');

const loginModal = document.getElementById('login-modal');
const searchOverlay = document.getElementById('search-overlay');
const fullMenu = document.getElementById('full-menu');

const loginClose = document.querySelector('.login-close');
const searchClose = document.querySelector('.search-close');
const menuClose = document.querySelector('.menu-close');

// Toggle Functions
function openModal(element) {
    if(element) element.classList.add('active');
}
function closeModal(element) {
    if(element) element.classList.remove('active');
}

// User (Login) Modal
if (userBtn) userBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(loginModal); });
if (loginClose) loginClose.addEventListener('click', () => closeModal(loginModal));

// Search Overlay
if (searchBtn) searchBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(searchOverlay); });
if (searchClose) searchClose.addEventListener('click', () => closeModal(searchOverlay));

// Full Menu (Hamburger)
if (menuBtn) menuBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(fullMenu); });
if (menuClose) menuClose.addEventListener('click', () => closeModal(fullMenu));

// Prevent form default on login
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('로그인 기능은 준비 중입니다.');
        closeModal(loginModal);
    });
}

// Modal links (Find ID/PW, Register) & Full Menu links
document.querySelectorAll('.modal-links a, .full-menu-container a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('해당 메뉴는 현재 준비 중입니다. (상세 페이지 연결 예정)');
        closeModal(fullMenu);
    });
});

// Handle scroll progress bar
const scrollProgressBar = document.getElementById('scroll-progress-bar');
window.addEventListener('scroll', () => {
    const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    if (scrollProgressBar) {
        scrollProgressBar.style.width = scrolled + '%';
    }
});

// Category Click Handler & Extra Effects
// (Already handled mostly by placeholder logic, but making it smoother)


// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
const observerOptions = { root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============================================
// Dynamic Free Board Logic (LocalStorage Mock of Firebase)
// ============================================
const STORAGE_KEY = 'dmu_free_board_posts';

// Initialize defaults if empty
if(!localStorage.getItem(STORAGE_KEY)) {
    const defaultPosts = [
        { title: '안녕하세요. 신규 가입 인사드립니다.', date: '2026.05.07' },
        { title: '로봇 암 제어 관련 질문이 있습니다.', date: '2026.05.06' },
        { title: 'AMK 면접 후기 공유합니다.', date: '2026.05.05' },
        { title: '캡스톤 디자인 팀원 급하게 구합니다! (1/4)', date: '2026.05.04' },
        { title: '회로 설계 참고할만한 자료 있을까요?', date: '2026.05.02' }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
}

function loadFreeBoard() {
    const listEl = document.getElementById('free-board-list');
    if(!listEl) return;
    
    listEl.innerHTML = '<div class="board-item loading" style="text-align:center; color:#888;">데이터를 불러오는 중입니다...</div>';
    
    // Simulate network delay
    setTimeout(() => {
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        listEl.innerHTML = '';
        posts.slice(0, 5).forEach(post => {
            const div = document.createElement('div');
            div.className = 'board-item';
            // Escaping basics to prevent XSS natively, though innerText is better
            div.innerHTML = `<span class="title"></span><span class="date">${post.date}</span>`;
            div.querySelector('.title').textContent = post.title;
            listEl.appendChild(div);
        });
    }, 400);
}

// Load dynamic board
setTimeout(loadFreeBoard, 800);

// Write Form Handler
const writeModal = document.getElementById('write-modal');
const writeClose = document.querySelector('.write-close');
const writePostBtn = document.getElementById('write-post-btn');
const writeForm = document.getElementById('write-form');

if(writePostBtn) writePostBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(writeModal); });
if(writeClose) writeClose.addEventListener('click', () => closeModal(writeModal));

if(writeForm) {
    writeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('post-title').value;
        const contentInput = document.getElementById('post-content').value;
        
        // DD format
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `2026.${mm}.${dd}`;

        const newPost = { title: titleInput, content: contentInput, date: dateStr };
        
        const posts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        posts.unshift(newPost); // add to top
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        closeModal(writeModal);
        
        loadFreeBoard();
        
        setTimeout(() => alert('게시글이 성공적으로 등록되었습니다!'), 100);
    });
}

// ============================================
// Language Switching Logic (i18n)
// ============================================

const translations = {
    KR: {
        lang_name: 'KR',
        nav_school: '학교소개',
        nav_dept: '학과소개',
        nav_portfolio: '나의 포트폴리오',
        nav_company: '관련 회사',
        nav_life: '학교생활',
        nav_board: '게시판',
        hero1_title: '동양미래대학교<br>로봇소프트웨어과',
        hero1_desc: '현장 실무 중심의 미래 로봇 엔지니어 양성',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK Maintenance Engineer Candidate',
        hero3_title: '트러블슈팅과<br>혁신적 문제해결',
        hero3_desc: '전자회로 분석 및 3D CAD 정밀 설계 역량',
        dept_title: '로봇소프트웨어과 학과소개',
        dept_desc: '미래 기술을 선도하는 현장 실무형 인재 양성! C, C++, Python 프로그래밍부터 하드웨어 회로 설계, 3D CAD까지 전문 지식을 체계적으로 배웁니다.',
        btn_school: '학교 홈페이지 가기 ❯',
        btn_dept: '학과 홈페이지 가기 ❯',
        port_title: '나의 포트폴리오 (Choung Seungmin)',
        btn_port_web: '포트폴리오 웹사이트 가기 ❯',
        comp_title: '관련 회사 및 진출 분야',
        comp_notice: '* 회사 태그를 클릭하시면 공식 홈페이지로 연결됩니다.',
        board_notice: '공지사항',
        board_free: '자유게시판 (Community)',
        footer_text: '© 2026 동양미래대학교 - 로봇소프트웨어과 & 정승민 포트폴리오'
    },
    EN: {
        lang_name: 'EN',
        nav_school: 'About School',
        nav_dept: 'About Dept',
        nav_portfolio: 'Portfolio',
        nav_company: 'Companies',
        nav_life: 'Campus Life',
        nav_board: 'Board',
        hero1_title: 'Dongyang Mirae Univ.<br>Robot Software',
        hero1_desc: 'Training future robot engineers with hands-on expertise',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK Maintenance Engineer Candidate',
        hero3_title: 'Troubleshooting &<br>Innovative Solutions',
        hero3_desc: 'Circuit Analysis & 3D CAD Precision Design',
        dept_title: 'Department Introduction',
        dept_desc: 'Nurturing future leaders in technology! Systematically learning everything from C/C++/Python to hardware design and 3D CAD.',
        btn_school: 'Go to Univ. Website ❯',
        btn_dept: 'Go to Dept. Website ❯',
        port_title: 'My Portfolio (Choung Seungmin)',
        btn_port_web: 'Go to Portfolio Web ❯',
        comp_title: 'Related Companies & Career',
        comp_notice: '* Click company tags to visit official websites.',
        board_notice: 'Notice',
        board_free: 'Community Board',
        footer_text: '© 2026 Dongyang Mirae Univ - Robot Software Dept. & Seungmin Portfolio'
    },
    CN: {
        lang_name: 'CN',
        nav_school: '学校介绍',
        nav_dept: '专业介绍',
        nav_portfolio: '个人作品集',
        nav_company: '相关企业',
        nav_life: '校园生活',
        nav_board: '公告栏',
        hero1_title: '东洋未来大学<br>机器人软件系',
        hero1_desc: '培养以现场实务为中心的未来机器人工程师',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK 维修工程师候选人',
        hero3_title: '故障排除与<br>创新解决方案',
        hero3_desc: '电子电路分析及 3D CAD 精密设计能力',
        dept_title: '机器人软件系专业介绍',
        dept_desc: '培养引领未来技术的现场实务型人才！系统学习从 C、C++、Python 编程到硬件电路设计、3D CAD 等专业知识。',
        btn_school: '访问学校官网 ❯',
        btn_dept: '访问专业官网 ❯',
        port_title: '我的作品集 (Choung Seungmin)',
        btn_port_web: '查看作品集网站 ❯',
        comp_title: '相关企业及就业领域',
        comp_notice: '* 点击企业标签即可访问官网。',
        board_notice: '公告事项',
        board_free: '自由论坛',
        footer_text: '© 2026 东洋未来大学 - 机器人软件系 & 郑承敏作品集'
    },
    JP: {
        lang_name: 'JP',
        nav_school: '学校紹介',
        nav_dept: '学科紹介',
        nav_portfolio: 'ポートフォリオ',
        nav_company: '関連企業',
        nav_life: '学生生活',
        nav_board: '掲示板',
        hero1_title: '東洋未来大学<br>ロボットソフトウェア学科',
        hero1_desc: '現場実務中心の未来ロボットエンジニア養成',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK メンテナンスエンジニア候補',
        hero3_title: 'トラブルシューティングと<br>革新的問題解決',
        hero3_desc: '電子回路分析および 3D CAD 精密設計能力',
        dept_title: 'ロボットソフトウェア学科 学科紹介',
        dept_desc: '未来技術をリードする現場実務型人材の養成！C、C++、Pythonプログラミングからハードウェア回路設計、3D CADまで専門知識を体系的に学びます。',
        btn_school: '学校サイトへ ❯',
        btn_dept: '学科サイトへ ❯',
        port_title: 'マイポートフォリオ (Choung Seungmin)',
        btn_port_web: 'ポートフォリオサイトへ ❯',
        comp_title: '関連企業および進出分野',
        comp_notice: '* 企業タグをクリックすると公式サイトへ移動します。',
        board_notice: 'お知らせ',
        board_free: '自由掲示板',
        footer_text: '© 2026 東洋未来大学 - ロボットソフトウェア学科 & チョン・スンミン ポートフォリオ'
    }
};

function setLanguage(lang) {
    if (!translations[lang]) lang = 'KR';
    
    // Update data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update language select text
    const langSelect = document.querySelector('.lang-select');
    if (langSelect) {
        langSelect.innerHTML = `${translations[lang].lang_name} ▾`;
    }

    // Save preference
    localStorage.setItem('dmu_preferred_lang', lang);
    document.documentElement.lang = lang.toLowerCase();
}

// Language menu event listeners
document.querySelectorAll('.lang-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = e.target.getAttribute('data-lang');
        setLanguage(selectedLang);
    });
});

// Automatic language detection on load
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('dmu_preferred_lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        const browserLang = navigator.language.split('-')[0].toUpperCase();
        if (translations[browserLang]) {
            setLanguage(browserLang);
        } else {
            setLanguage('KR');
        }
    }
});

// ============================================
// Search & Chatbot Features
// ============================================

// Search Functionality
const searchInput = document.getElementById('main-search-input');
const searchBtnSubmit = document.getElementById('main-search-btn');

function executeSearch() {
    if (searchInput && searchInput.value.trim() !== '') {
        alert(`'${searchInput.value}'에 대한 검색 결과가 없습니다.`);
        searchInput.value = '';
        closeModal(searchOverlay);
    } else {
        alert('검색어를 입력해주세요.');
    }
}

if (searchBtnSubmit) {
    searchBtnSubmit.addEventListener('click', executeSearch);
}
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeSearch();
    });
}

// Popular searches
document.querySelectorAll('.popular-searches a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`'${e.target.textContent}'에 대한 검색 결과가 없습니다.`);
        closeModal(searchOverlay);
    });
});

// Chatbot Logic
const chatbotBtn = document.getElementById('chatbot-btn');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

if (chatbotBtn && chatWindow) {
    chatbotBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });
}

if (closeChat) {
    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
}

const botReplies = [
    "현재 등록기간이 아닙니다. 학사일정을 확인해주세요.",
    "자세한 사항은 학과 사무실(02-2610-XXXX)로 문의 바랍니다.",
    "관련 서류는 학교 홈페이지 통합정보시스템에서 출력 가능합니다.",
    "장학금 신청은 매 학기 초 공지사항을 확인해주세요.",
    "네, 맞습니다. 추가로 궁금한 점이 있으신가요?",
    "입력하신 내용에 대한 답변을 준비 중입니다.",
    "동양미래대학교 입학처 홈페이지를 참고하시면 도움이 됩니다."
];

function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Fake Bot Response
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
        botMsg.textContent = reply;
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

if (chatSend) chatSend.addEventListener('click', sendChatMessage);
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}
