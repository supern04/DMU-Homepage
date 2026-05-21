// Hero Slider Logic (Refined for Hyundai Style)
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.left-arrow');
const nextBtn = document.querySelector('.right-arrow');
const scrollLine = document.querySelector('.scroll-line');
let currentSlide = 0;
let slideInterval;

function showSlide(n) {
    if (slides.length === 0) return;
    
    // Smooth transition
    slides.forEach(slide => {
        slide.classList.remove('active');
        const content = slide.querySelector('.slide-content');
        if (content) content.classList.remove('animate');
    });
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    const activeSlide = slides[currentSlide];
    activeSlide.classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Trigger text animation
    setTimeout(() => {
        const content = activeSlide.querySelector('.slide-content');
        if (content) content.classList.add('animate');
    }, 100);
    
    // Reset scroll line animation
    if (scrollLine) {
        scrollLine.style.transition = 'none';
        scrollLine.style.width = '0';
        setTimeout(() => {
            scrollLine.style.transition = 'width 5s linear';
            scrollLine.style.width = '100px'; 
        }, 50);
    }
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startAutoSlide() {
    if (slides.length === 0) return;
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
const _td = new Date();
const _yyyy = _td.getFullYear();
const _mm = String(_td.getMonth() + 1).padStart(2, '0');
const _dd = String(_td.getDate()).padStart(2, '0');
const _dynamicToday = `${_yyyy}.${_mm}.${_dd}`;

let boardData = [
    { title: '[공지] 동양미래대학교 로봇소프트웨어과 로봇 제작 심화 과정 신청 안내', date: _dynamicToday, link: 'https://www.dongyang.ac.kr/dmu/4903/subview.do' },
    { title: '[포트폴리오] 캡스톤 디자인 경진대회 예선 참가자 명단 발표', date: _dynamicToday, link: 'https://www.dongyang.ac.kr/dmu/4903/subview.do' },
    { title: '[동아리] MAS, MCA, SMART 등 전공동아리 신입 부원 모집', date: _dynamicToday, link: 'https://www.dongyang.ac.kr/dmu/4903/subview.do' },
    { title: '[취업] AMK CE (Customer Engineer) 부문 캠퍼스 리크루팅 안내', date: _dynamicToday, link: 'https://www.dongyang.ac.kr/dmu/4903/subview.do' },
    { title: '[장학] 2026학년도 1학기 로봇소프트웨어과 성적 및 실습 우수 장학금 신청', date: _dynamicToday, link: 'https://www.dongyang.ac.kr/dmu/4903/subview.do' }
];

const boardList = document.getElementById('board-list');

function renderBoard() {
    if (!boardList) return;
    boardList.innerHTML = '';
    boardData.forEach(item => {
        const boardItem = document.createElement('a'); // Change to anchor tag
        boardItem.href = item.link || 'https://www.dongyang.ac.kr/dmu/4903/subview.do';
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

// Fetch real-time notices via proxy bypass
async function fetchRealNotices() {
    try {
        const url = 'https://www.dongyang.ac.kr/dmu/4904/subview.do';
        // Try codetabs proxy as alternative if allorigins is blocked by the university
        const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const notices = [];
        // Extract rows from typical K2Web board table structure
        const rows = doc.querySelectorAll('.board-table tbody tr');
        rows.forEach(row => {
            const titleEl = row.querySelector('.td-subject a');
            const dateEl = row.querySelector('.td-date');
            
            if (titleEl && titleEl.textContent.trim()) {
                let link = titleEl.getAttribute('href');
                if (link && !link.startsWith('http')) {
                    if (link.startsWith('?')) {
                        link = 'https://www.dongyang.ac.kr/dmu/4904/subview.do' + link;
                    } else if (link.startsWith('/')) {
                        link = 'https://www.dongyang.ac.kr' + link;
                    } else {
                        link = 'https://www.dongyang.ac.kr/dmu/4904/' + link;
                    }
                }

                // Force K2Web to include the site CSS layout instead of the raw JSP print view
                if (link && link.includes('/bbs/') && !link.includes('layout=')) {
                    link += (link.includes('?') ? '&' : '?') + 'layout=unknown';
                }
                
                // Use the current date based on access time
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const todayStr = `${yyyy}.${mm}.${dd}`;

                notices.push({
                    title: titleEl.textContent.trim().replace(/\s+/g, ' '),
                    date: todayStr,
                    link: link || url
                });
            }
        });

        if (notices.length > 0) {
            boardData = notices.slice(0, 5); // Display top 5
        } else {
            console.warn("Could not parse dynamic notices, rendering static fallback");
        }
    } catch (error) {
        console.error("Failed to fetch real-time notices. Using fallback boardData:", error);
    } finally {
        renderBoard();
    }
}

// Initial Call
setTimeout(fetchRealNotices, 800);

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
// Dynamic Free Board Logic (Firebase Firestore Integration)
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDUKVjozyhOdE4Zuc4txRtSnzNkr-d0BAk",
  authDomain: "homepage-4730b.firebaseapp.com",
  projectId: "homepage-4730b",
  storageBucket: "homepage-4730b.firebasestorage.app",
  messagingSenderId: "765506795549",
  appId: "1:765506795549:web:66ec403bdac2dfc833aef4",
  measurementId: "G-D2H8MT9YYX"
};

// Initialize Firebase using compat SDK
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function loadFreeBoard() {
    const listEl = document.getElementById('free-board-list');
    if(!listEl) return;
    
    listEl.innerHTML = '<div class="board-item loading" style="text-align:center; color:#888;">게시글을 불러오는 중입니다. 잠시만 기다려주세요...</div>';
    
    db.collection("free_board_posts")
      .orderBy("createdAt", "desc")
      .limit(5)
      .onSnapshot((snapshot) => {
        listEl.innerHTML = '';
        if (snapshot.empty) {
            listEl.innerHTML = '<div class="board-item" style="text-align:center; color:#888;">등록된 게시글이 없습니다. 첫 글을 작성해 보세요!</div>';
            return;
        }

        snapshot.forEach((doc) => {
            const post = doc.data();
            const div = document.createElement('a'); // Make it an anchor tag
            div.className = 'board-item';
            div.href = '#';
            div.style.textDecoration = 'none';
            div.style.color = 'inherit';
            div.style.cursor = 'pointer';
            
            div.innerHTML = `<span class="title"></span><span class="date">${post.date}</span>`;
            div.querySelector('.title').textContent = post.title;
            
            // Add click listener to view post
            div.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('view-post-title').textContent = post.title;
                document.getElementById('view-post-date').textContent = post.date;
                // Use content if it exists, otherwise show a placeholder message
                document.getElementById('view-post-content').textContent = post.content || '내용이 없습니다.';
                openModal(document.getElementById('view-post-modal'));
            });
            
            listEl.appendChild(div);
        });
    }, (error) => {
        console.error("Error loading posts: ", error);
        listEl.innerHTML = '<div class="board-item loading" style="text-align:center; color:red;">데이터를 불러오는데 실패했습니다. DB 규칙 설정을 확인해 주세요.</div>';
    });
}

// Load dynamic board
setTimeout(loadFreeBoard, 800);

// View Form Handler
const viewPostModal = document.getElementById('view-post-modal');
const viewPostClose = document.querySelector('.view-post-close');
if(viewPostClose) viewPostClose.addEventListener('click', () => closeModal(viewPostModal));

// Write Form Handler
const writeModal = document.getElementById('write-modal');
const writeClose = document.querySelector('.write-close');
const writePostBtn = document.getElementById('write-post-btn');
const writeForm = document.getElementById('write-form');

if(writePostBtn) writePostBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(writeModal); });
if(writeClose) writeClose.addEventListener('click', () => closeModal(writeModal));

if(writeForm) {
    writeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('post-title').value;
        const contentInput = document.getElementById('post-content').value;
        
        // DD format
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `2026.${mm}.${dd}`;

        try {
            await db.collection("free_board_posts").add({
                title: titleInput,
                content: contentInput,
                date: dateStr,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            document.getElementById('post-title').value = '';
            document.getElementById('post-content').value = '';
            closeModal(writeModal);
            
            setTimeout(() => alert('게시글이 성공적으로 등록되었습니다!'), 100);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("글 작성에 실패했습니다. (파이어베이스 보안 규칙을 확인해주세요)");
        }
    });
}

// ============================================
// Restaurant Recommendation Board Logic
// ============================================
function loadRestBoard() {
    const listEl = document.getElementById('rest-board-list');
    if(!listEl) return;
    
    db.collection("rest_board_posts")
      .orderBy("createdAt", "desc")
      .limit(10)
      .onSnapshot((snapshot) => {
        listEl.innerHTML = '';
        if (snapshot.empty) {
            listEl.innerHTML = '<div class="board-item" style="text-align:center; color:#888;">등록된 맛집 추천이 없습니다. 첫 글을 작성해 보세요!</div>';
            return;
        }

        snapshot.forEach((doc) => {
            const post = doc.data();
            const div = document.createElement('a');
            div.className = 'board-item';
            div.href = '#';
            div.style.textDecoration = 'none'; div.style.color = 'inherit'; div.style.cursor = 'pointer';
            
            div.innerHTML = `<span class="title">😋 ${post.title}</span><span class="date">${post.date}</span>`;
            
            div.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('view-rest-title').textContent = post.title;
                document.getElementById('view-rest-date').textContent = post.date;
                document.getElementById('view-rest-content').textContent = post.content || '내용이 없습니다.';
                openModal(document.getElementById('view-rest-modal'));
            });
            
            listEl.appendChild(div);
        });
    }, (error) => {
        console.error("Error loading rest posts: ", error);
        listEl.innerHTML = '<div class="board-item loading" style="text-align:center; color:red;">데이터를 불러오는데 실패했습니다.</div>';
    });
}
setTimeout(loadRestBoard, 800);

const writeRestModal = document.getElementById('write-rest-modal');
const writeRestClose = document.querySelector('.write-rest-close');
const writeRestBtn = document.getElementById('write-rest-btn');
const writeRestForm = document.getElementById('write-rest-form');

if(writeRestBtn) writeRestBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(writeRestModal); });
if(writeRestClose) writeRestClose.addEventListener('click', () => closeModal(writeRestModal));

if(writeRestForm) {
    writeRestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('rest-post-title').value;
        const contentInput = document.getElementById('rest-post-content').value;
        
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `2026.${mm}.${dd}`;

        try {
            await db.collection("rest_board_posts").add({
                title: titleInput,
                content: contentInput,
                date: dateStr,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            document.getElementById('rest-post-title').value = '';
            document.getElementById('rest-post-content').value = '';
            closeModal(writeRestModal);
            setTimeout(() => alert('추천 맛집이 성공적으로 등록되었습니다!'), 100);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("글 작성에 실패했습니다.");
        }
    });
}

const viewRestModal = document.getElementById('view-rest-modal');
const viewRestClose = document.querySelector('.view-rest-close');
if(viewRestClose) viewRestClose.addEventListener('click', () => closeModal(viewRestModal));

// ============================================
// Language Switching Logic (i18n)
// ============================================

const translations = {
    KR: {
        lang_name: 'KR',
        nav_school: '학교소개',
        nav_dept: '학교 및 학과 소개',
        nav_portfolio: '나의 포트폴리오',
        nav_company: '관련 회사',
        nav_life: '학교생활',
        nav_board: '게시판',
        hero1_title: '2027학년도 신입생을 위한<br>로봇소프트웨어과 가이드',
        hero1_desc: '동양미래대학교의 새로운 가상 공간에 오신 것을 환영합니다.',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK Maintenance Engineer Candidate',
        hero3_title: '동양미래대학교 X 고척스카이돔',
        hero3_desc: '국내 최고 수준의 인프라와 함께하는 문화/스포츠 중심지',
        dept_title: '로봇소프트웨어과 신입생 안내',
        dept_desc: '미래 기술을 선도하는 현장 실무형 인재가 되기 위한 첫걸음! 2027학년도 신입생 여러분의 입학을 진심으로 축하하며, 학과 생활의 모든 것을 여기서 확인하세요.',
        btn_school: '학교 홈페이지 가기 ❯',
        btn_dept: '학과 홈페이지 가기 ❯',
        port_title: '나의 포트폴리오 (Choung Seungmin)',
        btn_port_web: '포트폴리오 웹사이트 가기 ❯',
        comp_title: '관련 회사 및 진출 분야',
        comp_notice: '* 회사 태그를 클릭하시면 공식 홈페이지로 연결됩니다.',
        board_notice: '공지사항',
        board_free: '자유게시판 (Community)',
        nav_map: '학교 근처 맛집',
        map_title: '학교 근처 맛집 지도',
        footer_text: '© 2027 동양미래대학교 - 로봇소프트웨어과 & 정승민 포트폴리오'
    },
    EN: {
        lang_name: 'EN',
        nav_school: 'About School',
        nav_dept: 'About Dept',
        nav_portfolio: 'Portfolio',
        nav_company: 'Companies',
        nav_life: 'Campus Life',
        nav_board: 'Board',
        hero1_title: '2027 Freshmen Guide<br>Robot Software Dept.',
        hero1_desc: 'Welcome to the new virtual space of Dongyang Mirae University.',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK Maintenance Engineer Candidate',
        hero3_title: 'Dongyang Mirae Univ X Gocheok Skydome',
        hero3_desc: 'Cultural & Sports Hub with Top-tier Infrastructure',
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
        nav_map: 'Restaurant Map',
        map_title: 'Restaurants Near Campus',
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
        hero1_title: '2027学年度新生指南<br>机器人软件系',
        hero1_desc: '欢迎来到东洋未来大学的新型虚拟空间。',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK 维修工程师候选人',
        hero3_title: '东洋未来大学 X 高尺天空巨蛋',
        hero3_desc: '拥有国内顶尖基础设施的文化与体育中心',
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
        nav_map: '周边美食',
        map_title: '校园周边美食地图',
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
        hero1_title: '2027年度新入生ガイド<br>ロボットソフトウェア学科',
        hero1_desc: '東洋未来大学の新しい仮想空間へようこそ。',
        hero2_title: 'Choung Seungmin<br>Portfolio',
        hero2_desc: 'AMK メンテナンスエンジニア候補',
        hero3_title: '東洋未来大学 X 高尺スカイドーム',
        hero3_desc: '国内最高水準のインフラを備えた文化・スポーツの中心地',
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
