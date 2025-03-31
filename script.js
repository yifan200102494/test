// 全局变量，用于跟踪当前语言状态
let isEnglish = false;
        
// 语言切换功能
function toggleLanguage() {
    console.log("语言切换函数被调用");
    
    // 反转语言状态
    isEnglish = !isEnglish;
    
    // 获取所有可翻译元素
    const elementsWithTranslation = document.querySelectorAll('[data-en]');
    console.log("找到的可翻译元素数量:", elementsWithTranslation.length);
    
    // 遍历所有可翻译元素并切换语言
    elementsWithTranslation.forEach(element => {
        // 保存原始文本（如果还没有保存）
        if (!element.getAttribute('data-original')) {
            element.setAttribute('data-original', element.textContent);
        }
        
        // 切换文本内容
        if (isEnglish) {
            element.textContent = element.getAttribute('data-en');
        } else {
            element.textContent = element.getAttribute('data-original');
        }
    });
    
    // 更新语言切换按钮文本
    const currentLangElement = document.querySelector('.current-lang');
    if (currentLangElement) {
        currentLangElement.textContent = isEnglish ? 'EN' : '中';
    }
    
    const otherLangElement = document.querySelectorAll('#langSwitch span:not(.current-lang):not(.lang-divider)')[0];
    if (otherLangElement) {
        otherLangElement.textContent = isEnglish ? '中' : 'EN';
    }
    
    // 更新网页标题
    const originalTitle = "奇闻异事 - 沉浸式剧本杀体验";
    const englishTitle = "Strange Tales - Immersive Murder Mystery Experience";
    document.title = isEnglish ? englishTitle : originalTitle;
    
    // 为语言切换按钮添加动画效果
    const langSwitch = document.getElementById('langSwitch');
    if (langSwitch) {
        langSwitch.classList.add('switched');
        setTimeout(() => {
            langSwitch.classList.remove('switched');
        }, 500);
    }
    // 切换logo品牌文字
const logoCn = document.querySelector('.logo-cn');
const logoEn = document.querySelector('.logo-en');

if (isEnglish) {
    logoCn.style.display = 'none';
    logoEn.style.display = 'inline-block';
} else {
    logoCn.style.display = 'inline-block';
    logoEn.style.display = 'none';
}

    console.log("语言已切换为:", isEnglish ? "英文" : "中文");
}

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单
    const menuBtn = document.getElementById('menuBtn');
    const menu = document.getElementById('menu');
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.menu ul li a');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }
    
    links.forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            menu.classList.remove('active');
        });
    });
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 淡入动画
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 50 && elementBottom > 0) {
                element.classList.add('active');
            }
        });
    }
    
    // 初始检查
    checkFade();
    window.addEventListener('scroll', checkFade);
    window.addEventListener('resize', checkFade);
});